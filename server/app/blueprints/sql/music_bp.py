from flask import Blueprint, jsonify, request
from ..__init__ import Session, Music

music_bp = Blueprint("music_bp", __name__)

# Delete a music entry
@music_bp.route("/<int:id>/delete", methods=["DELETE"])
def music_delete(id):
    with Session() as session:
        try:
            music = session.get(Music, id)
            if music:
                session.delete(music)
                session.commit()
                return '', 200
            else:
                return '', 404
        except:
            session.rollback()
            return '', 400

# Create a new music entry
@music_bp.route("/create", methods=["POST"])
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

# Retrieve all music that matches (substring of) search
@music_bp.route("/search=<string:title>", methods=["GET"])
def music_search_string(title):
    with Session() as session:
        try:
            music_search_results = session.query(Music).filter(Music.title.ilike(f"%{title}"))
            if music_search_results:
                return jsonify([{
                    "id": music.id,
                    "title": music.title,
                    "duration": music.duration,
                    "genreId": music.genreId
                } for music in music_search_results]), 200
            else:
                return '', 404
        except:
            return '', 400

# Retrieve music file based on ID
@music_bp.route("/play/<int:id>", methods=["GET"])
def music_play_id(id):
    with Session() as session:
        try:
            music = session.query(Music).filter(Music.id==id).first()
            if music:
                from flask import send_file
                from utils import music_get_path
                music = session.query(Music).filter(Music.id == id).first()
                return send_file(music_get_path(music.filename), as_attachment=False), 200
            else:
                return '', 404
        except:
            return '', 400

# Retrieve all music
@music_bp.route("/", methods=["GET"])
def music_retrieve_all():
    with Session() as session:
        try:
            musics = session.query(Music).all()
            return jsonify([{
                "id": music.id,
                "title": music.title,
                "duration": music.duration,
                "genreId": music.genreId
            } for music in musics]), 200
        except:
            return '', 400
    