from flask import Blueprint, request, jsonify
from services.interview_service import get_questions_for_role

interview_bp = Blueprint("interview", __name__, url_prefix="/api/interview")

@interview_bp.route("/questions", methods=["GET", "POST"])
def questions():
    if request.method == "POST":
        data = request.get_json() or {}
        role = data.get("role", "Python Developer")
        category = data.get("category", "All")
        difficulty = data.get("difficulty", "All")
    else:
        role = request.args.get("role", "Python Developer")
        category = request.args.get("category", "All")
        difficulty = request.args.get("difficulty", "All")
        
    result = get_questions_for_role(role, category, difficulty)
    return jsonify({"success": True, "data": result, "error": None})
