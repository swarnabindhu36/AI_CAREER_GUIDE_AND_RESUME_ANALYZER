import os
import json
import re
from repositories.json_repo import get_all_roles
from utils.text_utils import extract_email, extract_phone, extract_sections

def detect_skills_in_text(text, target_skills):
    text_lower = text.lower()
    matched = []
    missing = []
    
    for skill in target_skills:
        # Match as whole word or phrase
        pattern = r'(?<![a-zA-Z0-9])' + re.escape(skill.lower()) + r'(?![a-zA-Z0-9])'
        match = re.search(pattern, text_lower)
        if match:
            # Determine context section
            section = "General / Experience"
            lines = text.split('\n')
            for line in lines:
                if re.search(pattern, line.lower()):
                    if len(line.strip()) < 80:
                        section = f"Line: '{line.strip()[:40]}...'"
                    break
            matched.append({"skill": skill, "evidence": section})
        else:
            missing.append(skill)
            
    return matched, missing

def calculate_ats_readiness(resume_text, target_role, job_description=""):
    roles = get_all_roles()
    matching_role = next((r for r in roles if r.get("role", "").lower() == target_role.lower()), None)
    
    if not matching_role and roles:
        matching_role = next((r for r in roles if target_role.lower() in r.get("role", "").lower()), roles[0])
        
    core_skills = matching_role.get("core_skills", []) if matching_role else ["Python", "SQL", "Git", "REST APIs"]
    secondary_skills = matching_role.get("secondary_skills", []) if matching_role else ["Docker", "Linux", "CI/CD"]
    
    # 1. Required Skills Match (Max 20 pts)
    matched_core, missing_core = detect_skills_in_text(resume_text, core_skills)
    core_ratio = len(matched_core) / max(len(core_skills), 1)
    skills_score = round(core_ratio * 20, 1)
    
    # 2. Keyword Match (Max 25 pts)
    all_keywords = list(set(core_skills + secondary_skills))
    matched_all, missing_all = detect_skills_in_text(resume_text, all_keywords)
    keyword_ratio = len(matched_all) / max(len(all_keywords), 1)
    keyword_score = round(keyword_ratio * 25, 1)
    
    # 3. Role Alignment (Max 15 pts)
    role_mentions = len(re.findall(re.escape(target_role.lower()), resume_text.lower()))
    role_score = 15.0 if role_mentions >= 2 else (11.0 if role_mentions == 1 else 7.0)
    
    # 4. Resume Structure (Max 15 pts)
    sections = extract_sections(resume_text)
    has_experience = "experience" in sections
    has_skills = "skills" in sections
    has_projects = "projects" in sections
    has_education = "education" in sections
    
    structure_score = 0.0
    if has_experience: structure_score += 4.5
    if has_skills: structure_score += 4.5
    if has_projects: structure_score += 3.0
    if has_education: structure_score += 3.0
    
    # 5. Section Completeness (Max 10 pts)
    contact_email = extract_email(resume_text)
    contact_phone = extract_phone(resume_text)
    section_score = 0.0
    if contact_email: section_score += 3.0
    if contact_phone: section_score += 2.0
    if len(sections) >= 4: section_score += 5.0
    elif len(sections) >= 2: section_score += 3.0
    
    # 6. Formatting (Max 5 pts)
    formatting_score = 5.0
    lines = resume_text.split('\n')
    bullet_lines = [l for l in lines if l.strip().startswith(('•', '-', '*', '–'))]
    if len(bullet_lines) >= 5:
        formatting_score = 5.0
    elif len(bullet_lines) >= 2:
        formatting_score = 4.0
    else:
        formatting_score = 3.0
        
    # 7. Job Description Match (Max 10 pts)
    jd_score = 7.0  # default baseline if no JD
    jd_matched_terms = []
    jd_missing_terms = []
    
    if job_description and len(job_description.strip()) > 30:
        # Extract common tech words from JD
        jd_words = set(re.findall(r'\b[A-Za-z]{3,}\b', job_description.lower()))
        common_stops = {"and", "the", "for", "with", "you", "will", "our", "team", "experience", "role", "years", "work", "looking", "require"}
        jd_tech_candidates = [w for w in jd_words if w not in common_stops and len(w) > 3][:20]
        
        jd_matched = [w for w in jd_tech_candidates if w in resume_text.lower()]
        jd_missing = [w for w in jd_tech_candidates if w not in resume_text.lower()]
        
        jd_ratio = len(jd_matched) / max(len(jd_tech_candidates), 1)
        jd_score = round(jd_ratio * 10, 1)
        jd_matched_terms = jd_matched[:8]
        jd_missing_terms = jd_missing[:8]
    
    total_ats = round(keyword_score + skills_score + role_score + structure_score + section_score + formatting_score + jd_score)
    total_ats = max(35, min(96, total_ats))
    
    # Strengths & Improvements
    strengths = []
    improvements = []
    
    if len(matched_core) >= 4:
        strengths.append(f"Strong coverage of core competencies: {', '.join([m['skill'] for m in matched_core[:3]])}.")
    if has_experience:
        strengths.append("Contains structured work experience section with chronological progression.")
    if contact_email and contact_phone:
        strengths.append("Parsable contact info (email and phone) located cleanly at top.")
    if bullet_lines:
        strengths.append(f"Utilizes bulleted formatting ({len(bullet_lines)} action bullets detected).")
        
    if missing_core:
        improvements.append(f"Explicitly document proficiency in key missing skills: {', '.join(missing_core[:4])} where truthfully applicable.")
    if role_mentions == 0:
        improvements.append(f"Target role title '{target_role}' is not explicitly stated in summary or headline.")
    if not has_projects:
        improvements.append("Add a dedicated Projects section demonstrating practical deployment of key technologies.")
    if formatting_score < 4.5:
        improvements.append("Adopt clear bullet points for all experience entries using the Google XYZ impact format.")
        
    return {
        "estimated_ats_readiness": total_ats,
        "max_score": 100,
        "breakdown": {
            "keyword_match": {"score": keyword_score, "max": 25, "label": "Keyword Match"},
            "skills_match": {"score": skills_score, "max": 20, "label": "Required Skills Match"},
            "role_alignment": {"score": role_score, "max": 15, "label": "Role Alignment"},
            "structure": {"score": structure_score, "max": 15, "label": "Resume Structure"},
            "sections": {"score": section_score, "max": 10, "label": "Section Completeness"},
            "formatting": {"score": formatting_score, "max": 5, "label": "Formatting"},
            "jd_match": {"score": jd_score, "max": 10, "label": "Job Description Match"}
        },
        "matched_skills": matched_core,
        "missing_skills": missing_core,
        "strengths": strengths,
        "improvements": improvements,
        "jd_analysis": {
            "has_jd": bool(job_description and len(job_description.strip()) > 30),
            "matched_terms": jd_matched_terms,
            "missing_terms": jd_missing_terms
        },
        "detected_sections": sections,
        "contact_info": {
            "email": contact_email,
            "phone": contact_phone
        },
        "disclaimer": "This is an estimated resume-readiness score based on measurable factors. Actual employer ATS systems may use different algorithms."
    }
