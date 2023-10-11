# Create Flask app
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Register NoSQL blueprints
from blueprints.nosql.history_bp import history_bp

app.register_blueprint(history_bp, url_prefix="/api/music/history")

# Register SQL blueprints
from blueprints.sql.album_bp import album_bp
from blueprints.sql.genre_bp import genre_bp
from blueprints.sql.music_bp import music_bp
from blueprints.sql.playlist_bp import playlist_bp
from blueprints.sql.user_bp import user_bp

app.register_blueprint(album_bp, url_prefix="/api/album")
app.register_blueprint(genre_bp, url_prefix="/api/genre")
app.register_blueprint(music_bp, url_prefix="/api/music")
app.register_blueprint(playlist_bp, url_prefix="/api/playlist")
app.register_blueprint(user_bp, url_prefix="/api/user")

# Base endpoints
@app.route("/")
def default():
    return "ICT3103 Secured Software Development"

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
