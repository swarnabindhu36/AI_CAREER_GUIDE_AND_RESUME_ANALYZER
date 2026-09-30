from repositories.json_repo import get_all_resources

def get_recommended_resources(target_role="Python Developer", skill_filter=None, type_filter="All", search_query=""):
    resources = get_all_resources()
    filtered = []
    
    for r in resources:
        # Check type
        if type_filter != "All" and r.get("type", "").lower() != type_filter.lower():
            continue
            
        # Check search query
        if search_query:
            q = search_query.lower()
            text = f"{r.get('title', '')} {r.get('skill', '')} {r.get('provider', '')} {r.get('description', '')}".lower()
            if q not in text:
                continue
                
        # Check skill filter
        if skill_filter and skill_filter.lower() != "all":
            if skill_filter.lower() not in r.get("skill", "").lower():
                continue
                
        filtered.append(r)
        
    return filtered
