from repositories.json_repo import get_all_interview_questions

def get_questions_for_role(role="Python Developer", category="All", difficulty="All"):
    questions = get_all_interview_questions()
    filtered = []
    
    for q in questions:
        question_role = q.get("role", "")
        role_match = (
            question_role == "All Roles" or
            role.lower() in question_role.lower() or
            question_role.lower() in role.lower()
        )
        cat_match = (category == "All" or q.get("category", "").lower() == category.lower())
        diff_match = (difficulty == "All" or q.get("difficulty", "").lower() == difficulty.lower())
        
        if role_match and cat_match and diff_match:
            filtered.append(q)
            
    # Fall back to generic questions only when they honor all selected filters.
    if not filtered:
        filtered = [
            q for q in questions
            if q.get("role") == "All Roles"
            and (category == "All" or q.get("category", "").lower() == category.lower())
            and (difficulty == "All" or q.get("difficulty", "").lower() == difficulty.lower())
        ]
        
    return filtered
