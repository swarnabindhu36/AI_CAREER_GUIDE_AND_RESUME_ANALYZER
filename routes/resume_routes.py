import os
from flask import Blueprint, request, jsonify
from services.resume_parser import parse_resume_file
from services.ats_service import calculate_ats_readiness
from utils.file_utils import save_uploaded_file, safe_remove_file

resume_bp = Blueprint("resume", __name__, url_prefix="/api/resume")

@resume_bp.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"success": False, "data": None, "error": {"code": "NO_FILE", "message": "No file uploaded."}}), 400
        
    file = request.files["file"]
    filepath = save_uploaded_file(file)
    if not filepath:
        return jsonify({"success": False, "data": None, "error": {"code": "INVALID_FILE", "message": "Invalid file type. Please upload a PDF, DOCX, or TXT file."}}), 400
        
    text, error = parse_resume_file(filepath)
    safe_remove_file(filepath)
    
    if error:
        return jsonify({"success": False, "data": None, "error": {"code": "PARSE_ERROR", "message": error}}), 400
        
    return jsonify({
        "success": True,
        "data": {
            "filename": file.filename,
            "text": text,
            "char_count": len(text),
            "word_count": len(text.split())
        },
        "error": None
    })

@resume_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json() or {}
    resume_text = data.get("resumeText", "")
    target_role = data.get("targetRole", "Python Developer")
    job_description = data.get("jobDescription", "")
    
    if not resume_text or len(resume_text.strip()) < 30:
        return jsonify({"success": False, "data": None, "error": {"code": "SHORT_RESUME", "message": "Please provide a resume with sufficient content to analyze."}}), 400
        
    analysis = calculate_ats_readiness(resume_text, target_role, job_description)
    return jsonify({"success": True, "data": analysis, "error": None})
