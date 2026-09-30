from flask import Blueprint, render_template, send_from_directory, jsonify, current_app
from config import Config
import os

main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def index():
    return render_template("index.html")

@main_bp.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "hasApiKey": bool(Config.GEMINI_API_KEY),
        "database": "JSON",
        "backend": "Python / Flask"
    })
