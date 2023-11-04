# Create Flask app
from flask import Flask, jsonify
from flask_cors import CORS
from apscheduler.schedulers.background  import BackgroundScheduler
from helpers import is_debug_mode, music_get_max_size
from blueprints.csrf import CSRF
import os

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = music_get_max_size()

CORS(app, supports_credentials=True) # Allow CORS for all endpoints

# Register blueprints
from blueprints.sql.album_bp import album_bp
from blueprints.sql.genre_bp import genre_bp
from blueprints.sql.music_bp import music_bp
from blueprints.sql.playlist_bp import playlist_bp
from blueprints.sql.user_bp import user_bp

app.register_blueprint(album_bp, url_prefix="/album")
app.register_blueprint(genre_bp, url_prefix="/genre")
app.register_blueprint(music_bp, url_prefix="/music")
app.register_blueprint(playlist_bp, url_prefix="/playlist")
app.register_blueprint(user_bp, url_prefix="/user")

# Base endpoints
@app.route("/csrf_token", methods=["GET"])
def get_csrf_token():
    token = CSRF().get_token()
    return jsonify({ 'token': token })

@app.route("/")
def default():
    return "Welcome to ICT3103 SSD"

# Scheduler to regenerate CSRF tokens every 30s
scheduler = BackgroundScheduler()
scheduler.start()

def regenerate_csrf_tokens():
    CSRF().regenerate_token()

scheduler.add_job(regenerate_csrf_tokens, 'interval', seconds=30)

# Run Flask app
if __name__ == "__main__":
    app.run(debug=is_debug_mode, host="0.0.0.0")
