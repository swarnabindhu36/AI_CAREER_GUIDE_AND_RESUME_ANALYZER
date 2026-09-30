import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-ai-career-guide-pink-2026")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    PORT = int(os.getenv("PORT", 3000))
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB upload limit
    DATA_DIR = os.path.join(BASE_DIR, "data")
    ROLES_FILE = os.path.join(DATA_DIR, "roles.json")
    SKILLS_FILE = os.path.join(DATA_DIR, "skills.json")
    RESOURCES_FILE = os.path.join(DATA_DIR, "resources.json")
    INTERVIEW_FILE = os.path.join(DATA_DIR, "interview_questions.json")
    JOB_PLATFORMS_FILE = os.path.join(DATA_DIR, "job_platforms.json")
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}
    JSON_SORT_KEYS = False
