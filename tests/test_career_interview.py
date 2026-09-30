from services import interview_service, roadmap_service


def test_fallback_roadmap_uses_selected_role_skills(monkeypatch):
    monkeypatch.setattr(roadmap_service, "call_gemini", lambda prompt: None)

    roadmap = roadmap_service.generate_personalized_roadmap(
        "Frontend Developer", [], 5, 2
    )

    assert roadmap["target_role"] == "Frontend Developer"
    assert "DOM event delegation" in roadmap["days"][0]["topic"]
    assert "JavaScript" in roadmap["days"][0]["learning_objectives"]
    assert "Responsive analytics dashboard" in roadmap["days"][0]["practice_task"]
    assert roadmap["days"][0]["youtube_url"].startswith(
        "https://www.youtube.com/results?search_query="
    )


def test_cloud_fallback_uses_daily_learning_topics_and_video_links(monkeypatch):
    monkeypatch.setattr(roadmap_service, "call_gemini", lambda prompt: None)

    roadmap = roadmap_service.generate_personalized_roadmap(
        "Cloud Engineer", [], 5, 2
    )

    topics = [day["topic"] for day in roadmap["days"]]
    assert len(set(topics)) == len(topics)
    assert any("VPC architecture" in topic for topic in topics)
    assert all(day["youtube_url"].startswith("https://www.youtube.com/") for day in roadmap["days"])


def test_interview_fallback_respects_category_and_difficulty(monkeypatch):
    questions = [
        {
            "id": "generic-hr",
            "role": "All Roles",
            "category": "HR",
            "difficulty": "Beginner",
        },
        {
            "id": "generic-technical",
            "role": "All Roles",
            "category": "Technical",
            "difficulty": "Beginner",
        },
    ]
    monkeypatch.setattr(interview_service, "get_all_interview_questions", lambda: questions)

    results = interview_service.get_questions_for_role(
        "Frontend Developer", "HR", "Beginner"
    )

    assert [question["id"] for question in results] == ["generic-hr"]
    assert interview_service.get_questions_for_role(
        "Frontend Developer", "Behavioral", "Beginner"
    ) == []