import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes.main_routes import main_bp
from routes.career_routes import career_bp
from routes.resume_routes import resume_bp
from routes.resource_routes import resource_bp
from routes.interview_routes import interview_bp

def create_app():
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    app.register_blueprint(main_bp)
    app.register_blueprint(career_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(resource_bp)
    app.register_blueprint(interview_bp)

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"success": False, "data": None, "error": {"code": "BAD_REQUEST", "message": "Your request is invalid."}}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "data": None, "error": {"code": "NOT_FOUND", "message": "Requested resource was not found."}}), 404

    @app.errorhandler(413)
    def payload_too_large(error):
        return jsonify({"success": False, "data": None, "error": {"code": "FILE_TOO_LARGE", "message": "The uploaded file exceeds the 5 MB limit."}}), 413

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"success": False, "data": None, "error": {"code": "SERVER_ERROR", "message": "Internal server error occurred."}}), 500

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    print(f"🚀 ApexCareer Flask Platform starting on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
