# Create Flask app
from flask import Flask
from flask_cors import CORS
from helpers import is_debug_mode, music_get_max_size

app = Flask(__name__)
CORS(app, supports_credentials=True) # Allow CORS for all endpoints

app.config['MAX_CONTENT_LENGTH'] = music_get_max_size()

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
@app.route("/")
def default():
    return "ICT3103 Secured Software Development"

# Run Flask app
if __name__ == "__main__":
    app.run(debug=is_debug_mode, host="0.0.0.0")