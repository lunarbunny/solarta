# Create Flask app
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Initialise Firestore
from firebase_admin import credentials, firestore
import firebase_admin

firebase_admin.initialize_app(credentials.Certificate("serviceAccountKey.json"))
nosql = firestore.client()

# Initialise MariaDB
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
engine = create_engine(os.getenv("SQLALCHEMY_DATABASE_URI"), echo=True)
Session = sessionmaker(bind=engine)

# Generate SQL schema
from models.__init__ import Base
from models.Album import Album
from models.AlbumMusic import AlbumMusic
from models.Genre import Genre
from models.Music import Music
from models.Playlist import Playlist
from models.PlaylistMusic import PlaylistMusic
from models.Role import Role
from models.User import User

Base.metadata.create_all(engine)

# MariaDB endpoints
@app.route("/api/genre", methods=["GET"])
def genre_retrieve_all():
    with Session() as session:
        genres = session.query(Genre).all()
        return jsonify([{
            "id": genre.id,
            "name": genre.name
        } for genre in genres]), 200
    
@app.route("/api/music/delete/<int:id>", methods=["DELETE"])
def music_delete(id):
    with Session() as session:
        music = session.get(Music, id)
        if music:
            session.delete(music)
            session.commit()
            return '', 200
        else:
            session.rollback()
            return '', 400

@app.route("/api/music/create", methods=["POST"])
def music_create():
    with Session() as session:
        try:
            data = request.form
            music_file = request.files["music_file"]
            if music_file:
                from utils import music_get_duration, music_save
                music_save(music_file)
                duration = music_get_duration(music_file.filename)
                session.add(Music(data["title"], music_file.filename, duration, data["genreId"]))
                session.commit()
                return '', 200
        except:
            session.rollback()
            return '', 400
            
@app.route("/api/music/play/<int:id>", methods=["GET"])
def music_play_id(id):
    with Session() as session:
        music = session.query(Music).filter(Music.id==id).first()
        if music:
            from flask import send_file
            from utils import music_get_path
            music = session.query(Music).filter(Music.id == id).first()
            return send_file(music_get_path(music.filename), as_attachment=False), 200
        else:
            session.rollback()
            return '', 404
        
@app.route("/api/music", methods=["GET"])
def music_retrieve_all():
    with Session() as session:
        musics = session.query(Music).all()
        return jsonify([{
            "id": music.id,
            "title": music.title,
            "duration": music.duration,
            "genreId": music.genreId
        } for music in musics]), 200
        
# Firestore endpoints
@app.route("/api/music/history/<string:id>", methods=["GET"])
def music_retrieve_id_history(id):
    try:
        music_ref = nosql.collection("music")
        musics = music_ref.stream()
        return jsonify([music.to_dict() for music in musics]), 200
    except:
        return '', 404

# Base endpoints
@app.route("/")
def default():
    return "ICT3103 Secured Software Development"

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
