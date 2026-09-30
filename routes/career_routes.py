from flask import Blueprint, request, jsonify
from services.career_service import analyze_career_profile
from services.roadmap_service import generate_personalized_roadmap

career_bp = Blueprint("career", __name__, url_prefix="/api/career")

@career_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json() or {}
    result = analyze_career_profile(data)
    return jsonify({"success": True, "data": result, "error": None})

@career_bp.route("/roadmap", methods=["POST"])
def roadmap():
    data = request.get_json() or {}
    target_role = data.get("targetRole", "Python Developer")
    current_skills = data.get("currentSkills", [])
    days_count = data.get("prepDays", 30)
    daily_hours = data.get("dailyHours", 2)
    
    result = generate_personalized_roadmap(target_role, current_skills, days_count, daily_hours)
    return jsonify({"success": True, "data": result, "error": None})
