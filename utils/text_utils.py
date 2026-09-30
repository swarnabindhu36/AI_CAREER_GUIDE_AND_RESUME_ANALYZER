import re

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'\r\n|\r', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else None

def extract_phone(text):
    match = re.search(r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}', text)
    return match.group(0) if match else None

def extract_sections(text):
    section_patterns = {
        "summary": r'(?:professional summary|summary|about me|profile)',
        "experience": r'(?:work experience|experience|employment history|work history)',
        "education": r'(?:education|academic background|academics)',
        "skills": r'(?:technical skills|skills|technologies|core competencies)',
        "projects": r'(?:projects|personal projects|key projects)',
        "certifications": r'(?:certifications|certificates|licenses)'
    }
    
    found_sections = {}
    lines = text.split('\n')
    for line in lines:
        cleaned = line.strip().lower()
        if len(cleaned) < 40:
            for sec_name, pattern in section_patterns.items():
                if re.search(r'^' + pattern + r'[:\s]*$', cleaned):
                    found_sections[sec_name] = True
    return list(found_sections.keys())
