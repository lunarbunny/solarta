# Create Flask app
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Register blueprints
from blueprints.nosql.history_bp import history_bp
from blueprints.sql.genre_bp import genre_bp
from blueprints.sql.music_bp import music_bp

app.register_blueprint(history_bp, url_prefix="/api/music/history")
app.register_blueprint(genre_bp, url_prefix="/api/genre")
app.register_blueprint(music_bp, url_prefix="/api/music")

# Base endpoints
@app.route("/")
def default():
    return "ICT3103 Secured Software Development"

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
