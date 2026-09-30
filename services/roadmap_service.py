from urllib.parse import quote_plus, urlparse

from repositories.json_repo import get_all_roles
from services.gemini_service import call_gemini


def _youtube_search_url(target_role, topic):
    query = quote_plus(f"{target_role} {topic} tutorial course")
    return f"https://www.youtube.com/results?search_query={query}"


def _is_youtube_url(url):
    parsed = urlparse(url or "")
    return parsed.scheme == "https" and parsed.hostname in {"youtube.com", "www.youtube.com", "youtu.be"}


def generate_personalized_roadmap(target_role, current_skills, days_count, daily_hours):
    days_count = max(5, min(60, int(days_count)))
    daily_hours = max(0.5, min(8.0, float(daily_hours)))
    total_hours = round(days_count * daily_hours, 1)

    roles = get_all_roles()
    role_meta = next((r for r in roles if r.get("role", "").lower() == target_role.lower()), None)
    if not role_meta and roles:
        role_meta = next((r for r in roles if target_role.lower() in r.get("role", "").lower()), roles[0])

    core_skills = role_meta.get("core_skills", ["Core Programming", "Data Architecture", "APIs"]) if role_meta else ["Programming"]
    missing_skills = [s for s in core_skills if s.lower() not in [c.lower() for c in current_skills]]
    if not missing_skills:
        missing_skills = role_meta.get("secondary_skills", ["System Architecture", "Deployment", "Testing"]) if role_meta else ["Advanced Systems"]

    # AI generation attempt
    prompt = f"""You are an elite career development architect and technical educator.
Generate an actionable day-by-day career roadmap for a candidate.

Parameters:
- Target Role: {target_role}
- Current Skills: {', '.join(current_skills) if current_skills else 'Beginner'}
- Identified Skill Gaps to Bridge: {', '.join(missing_skills)}
- Preparation Duration: Exactly {days_count} days
- Daily Available Time: {daily_hours} hours per day
- Total Calculated Workload: {total_hours} hours

Return valid JSON with:
{{
  "target_role": "{target_role}",
  "duration_days": {days_count},
  "daily_hours": {daily_hours},
  "total_hours": {total_hours},
  "strategy_summary": "<concise 2-sentence summary>",
  "days": [
    {{
      "day_number": 1,
    "topic": "<Specific topic to learn today>",
      "estimated_hours": {daily_hours},
      "priority": "High" | "Medium",
    "learning_objectives": ["<specific subtopic 1>", "<specific subtopic 2>"],
      "practice_task": "<practical coding or design task>",
    "resource_links": ["<resource URL>"],
    "youtube_url": "<YouTube video URL or YouTube search URL for this day's topic>"
    }}
  ]
}}
Ensure you generate an array with exactly {min(days_count, 15)} detailed days (and provide a scalable progression for remaining days).
"""
    ai_result = call_gemini(prompt)
    if ai_result and "days" in ai_result and len(ai_result["days"]) > 0:
        for day in ai_result["days"]:
            day_topic = day.get("topic") or f"{target_role} learning topic"
            day["topic"] = day_topic
            if not _is_youtube_url(day.get("youtube_url")):
                day["youtube_url"] = _youtube_search_url(target_role, day_topic)
            if not day.get("learning_objectives"):
                day["learning_objectives"] = [day_topic]
        return ai_result

    # Deterministic fallback uses the selected role's skill gaps and projects.
    days_list = []
    projects = role_meta.get("projects", []) if role_meta else []
    role_topics = role_meta.get("interview_topics", []) if role_meta else []
    role_skills = core_skills + (role_meta.get("secondary_skills", []) if role_meta else [])
    topics = list(dict.fromkeys(role_topics + role_skills)) or missing_skills
    learning_phases = ["Guided practice", "Applied design", "Review and interview practice"]
    for d in range(1, days_count + 1):
        skill = missing_skills[(d - 1) % len(missing_skills)]
        topic = topics[(d - 1) % len(topics)]
        phase = (d - 1) // len(topics)
        if phase:
            topic = f"{learning_phases[(phase - 1) % len(learning_phases)]}: {topic}"
        project = projects[(d - 1) % len(projects)] if projects else f"Build a small {target_role} project applying {skill}"
        days_list.append({
            "day_number": d,
            "topic": topic,
            "estimated_hours": daily_hours,
            "priority": "High" if d <= max(3, days_count // 3) else "Medium",
            "learning_objectives": [
                topic,
                skill
            ],
            "practice_task": f"Develop this role-aligned deliverable: {project}",
            "resource_links": [],
            "youtube_url": _youtube_search_url(target_role, topic)
        })

    return {
        "target_role": target_role,
        "duration_days": days_count,
        "daily_hours": daily_hours,
        "total_hours": total_hours,
        "strategy_summary": f"Personalized {days_count}-day curriculum calibrated at {daily_hours} hrs/day ({total_hours} total hours) targeting {target_role} competencies.",
        "days": days_list
    }
