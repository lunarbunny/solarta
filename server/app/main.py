# Create Flask app
from flask import Flask, request
from flask_cors import CORS
from markupsafe import escape
from models.User import User
import utils

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

# Register NoSQL blueprints
from blueprints.nosql.history_bp import history_bp

app.register_blueprint(history_bp, url_prefix="/api/music/history")

# Register SQL blueprints
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

@app.route("/register", methods=["POST"])
def register():
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")
    confirmPassword = request.form.get("confirmPassword")
    if username is None:
        return "Username is required.", 400
    
    if email is None:
        return "Email is required.", 400
    
    if len(username) > 64:
        return escape("Username is too long, must be < 64 characters."), 400
    
    if not utils.is_email_valid(email):
        return "Email is invalid.", 400
    
    if confirmPassword != password:
        return "Check that you entered both passwords correctly.", 400
    hashPwd = utils.hash_password(password)
    user = User(username, email, hashPwd, 2, 2)
    return "ok!", 200

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
