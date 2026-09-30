import json
import os
from config import Config

def load_json(filepath, default=None):
    if not os.path.exists(filepath):
        return default if default is not None else []
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return default if default is not None else []

def get_all_roles():
    return load_json(Config.ROLES_FILE, [])

def get_all_resources():
    return load_json(Config.RESOURCES_FILE, [])

def get_all_interview_questions():
    return load_json(Config.INTERVIEW_FILE, [])

def get_job_platforms():
    return load_json(Config.JOB_PLATFORMS_FILE, [])
