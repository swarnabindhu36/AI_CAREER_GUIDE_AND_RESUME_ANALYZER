def test_ats_calculation():
    from services.ats_service import calculate_ats_readiness
    
    sample_resume = """
    Alex Chen
    alex.chen@example.com | 555-0192 | San Francisco, CA
    
    Professional Summary
    Python Developer with 2 years of experience building scalable backend web applications and REST APIs using Flask, PostgreSQL, and SQL.
    
    Work Experience
    Software Engineer | DataCorp | 2023 - Present
    • Developed 12+ RESTful API endpoints using Python, Flask, and PostgreSQL.
    • Optimized database queries and indexes, cutting response latency by 35%.
    • Implemented automated unit testing with Pytest covering 85% of critical flows.
    
    Technical Skills
    Languages: Python, SQL, JavaScript
    Frameworks: Flask, Django, FastAPI
    Tools: Git, PostgreSQL, Pytest
    
    Education
    B.S. in Computer Science | UC Berkeley
    """
    
    result = calculate_ats_readiness(sample_resume, "Python Developer")
    assert result["estimated_ats_readiness"] >= 65, f"Expected ATS score >= 65, got {result['estimated_ats_readiness']}"
    assert "keyword_match" in result["breakdown"]
    assert len(result["matched_skills"]) > 0
    print("ATS test passed with score:", result["estimated_ats_readiness"])

if __name__ == "__main__":
    test_ats_calculation()
