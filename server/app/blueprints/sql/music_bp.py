import math
import os
from flask import Blueprint, jsonify, request
from ..__init__ import Session, Music, User, AlbumMusic
from utils import music_get_path, music_get_duration

music_bp = Blueprint("music_bp", __name__)

# Delete a music entry
@music_bp.route("/<int:id>/delete", methods=["DELETE"])
def music_delete(id):
    from ..__init__ import AlbumMusic, PlaylistMusic
    with Session() as session:
        try:
            music = session.get(Music, id)
            if music:
                session.query(AlbumMusic).filter(AlbumMusic.idMusic == id).delete()
                session.query(PlaylistMusic).filter(PlaylistMusic.idMusic == id).delete()
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
            title = data["title"]
            genreId = int(data["genreId"])
            ownerId = int(data["ownerId"])
            albumId = int(data["albumId"])
            music_file = request.files["music_file"]

            if title == "" or genreId == "" or ownerId == "" or albumId == "" or music_file == "":
                return 'Missing parameters', 400
            
            ext = os.path.splitext(music_file.filename)[1]
            if ext.lower() != '.mp3':
                return 'Invalid file type', 400
            
            # Limit title to 28 characters, leave 6 characters for owner ID prefix, and 5 characters for extension
            # XXXXXX-<title>.mp3
            music_file.filename = f"{ownerId:06}-{music_file.filename[:28]}.mp3"
            music_file.save(music_get_path(music_file.filename))
            duration = music_get_duration(music_file.filename)
            if duration is None:
                return 'Cannot get duration', 422
            
            duration = math.ceil(duration)
            new_music = Music(title, music_file.filename, duration, genreId, ownerId)
            session.add(new_music)
            session.flush()
            session.add(AlbumMusic(albumId, new_music.id))
            session.commit()
            return 'Created', 201
        except Exception as e:
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
            musics = session.query(Music, User.name).join(User, Music.ownerId == User.id).all()
            return jsonify([{
                "id": music.id,
                "title": music.title,
                "duration": music.duration,
                "genreId": music.genreId,
                "ownerName": owner_name
            } for music, owner_name in musics]), 200
        except:
            return '', 400
    