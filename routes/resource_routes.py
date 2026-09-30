from flask import Blueprint, request, jsonify
from services.resource_service import get_recommended_resources
from repositories.json_repo import get_all_roles

resource_bp = Blueprint("resources", __name__, url_prefix="/api")

@resource_bp.route("/roles", methods=["GET"])
def roles():
    return jsonify({"success": True, "data": get_all_roles(), "error": None})

@resource_bp.route("/resources", methods=["GET"])
def resources():
    role = request.args.get("role", "Python Developer")
    skill = request.args.get("skill", None)
    res_type = request.args.get("type", "All")
    q = request.args.get("q", "")
    
    data = get_recommended_resources(role, skill, res_type, q)
    return jsonify({"success": True, "data": data, "error": None})
