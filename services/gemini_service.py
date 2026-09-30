import os
import json
import re
import requests
from config import Config

# Standard flash model
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

def call_gemini(prompt):
    api_key = Config.GEMINI_API_KEY
    if not api_key:
        return None

    url = f"{GEMINI_API_URL}?key={api_key}"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "aistudio-build"
    }

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json"
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        if response.status_code == 200:
            result = response.json()
            candidates = result.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    raw_text = parts[0].get("text", "")
                    cleaned = re.sub(r"^```json\s*", "", raw_text.strip())
                    cleaned = re.sub(r"\s*```$", "", cleaned)
                    try:
                        return json.loads(cleaned)
                    except json.JSONDecodeError:
                        return {"raw_text": raw_text}
        else:
            # Silently fallback without crashing when quota is exhausted or API returns error
            return None
    except Exception as e:
        return None
