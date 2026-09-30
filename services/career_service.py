from repositories.json_repo import get_all_roles
from services.gemini_service import call_gemini

def analyze_career_profile(profile_data):
    target_role = profile_data.get("targetRole", "Python Developer")
    current_role = profile_data.get("currentRole", "Early Career Developer")
    years_exp = profile_data.get("yearsExperience", 1)
    daily_hours = profile_data.get("dailyHours", 2)
    prep_days = profile_data.get("prepDays", 30)
    current_skills = profile_data.get("currentSkills", [])

    roles = get_all_roles()
    matching_role = next((r for r in roles if r.get("role", "").lower() == target_role.lower()), None)
    if not matching_role and roles:
        matching_role = next((r for r in roles if target_role.lower() in r.get("role", "").lower()), roles[0])

    core_skills = matching_role.get("core_skills", ["Core Programming", "SQL", "APIs", "Git"]) if matching_role else ["Programming"]
    missing_skills = [s for s in core_skills if s.lower() not in [c.lower() for c in current_skills]]
    matched_skills = [s for s in core_skills if s.lower() in [c.lower() for c in current_skills]]

    # Hybrid deterministic analysis with fallback
    readiness_index = max(55, min(92, int((len(matched_skills) / max(len(core_skills), 1)) * 40 + (years_exp * 5) + 45)))

    gaps = []
    for skill in (missing_skills[:3] if missing_skills else ["System Design & Caching", "Docker Containerization"]):
        gaps.append({
            "skill": skill,
            "category": "Core Competency",
            "urgency": "High",
            "estimated_hours": 12,
            "recommended_focus": f"Master {skill} through hands-on implementation and official docs."
        })

    return {
        "target_role": target_role,
        "readiness_index": readiness_index,
        "market_demand": "High",
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "priority_gaps": gaps,
        "executive_summary": f"Your current foundations provide a direct runway into {target_role}. By dedicating {daily_hours} hrs/day over {prep_days} days, you can bridge critical gaps in {', '.join(missing_skills[:2]) if missing_skills else 'advanced architecture'}.",
        "recommended_projects": matching_role.get("projects", []) if matching_role else []
    }
