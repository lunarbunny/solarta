import math
import os
from flask import Blueprint, jsonify, request, send_file
from werkzeug.utils import secure_filename

from ..__init__ import Session, Music, User, AlbumMusic, PlaylistMusic, Album
from validation import clean_num_only, clean_text
import utils

music_bp = Blueprint("music_bp", __name__)

# Delete a music entry
@music_bp.route("/<int:id>/delete", methods=["DELETE"])
def music_delete(id):
    with Session() as session:
        try:
            id = clean_num_only(id)
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
            user, status = utils.check_authenticated(session, request)
            if user is None:
                return utils.nachoneko(), status

            ownerId = user.id
            data = request.form
            title = data.get("title", "")
            genreId = data.get("genreId", "")
            albumId = data.get("albumId", "")
            music_file = request.files["music_file"]

            if title == "" or genreId == "" or ownerId == "" or albumId == "" or music_file == "":
                return 'Missing parameters', 400
            
            filename, ext = os.path.splitext(music_file.filename)
            if ext.lower() != '.mp3':
                return 'Invalid file type', 400
            
            # Clean filename
            # Limit title to 28 characters, leave 6 characters for owner ID prefix, and 5 characters for extension
            # XXXXXX-<title>.mp3
            filename = f"{ownerId:06}-{secure_filename(filename)[:28]}{ext}"
            save_dir = utils.music_get_save_dir()
            save_path = os.path.join(save_dir, filename)
            
            music_file.save(save_path)
            duration = utils.music_get_duration(save_path)
            if duration is None:
                return 'Cannot get duration', 422
            
            duration = math.ceil(duration)
            new_music = Music(title, filename, duration, genreId, ownerId)
            session.add(new_music)
            session.flush()
            session.add(AlbumMusic(albumId, new_music.id))
            session.commit()
            return 'Created', 201
        except:
            session.rollback()
            return '', 400

# Retrieve all music that matches (substring of) search
@music_bp.route("/search=<string:title>", methods=["GET"])
def music_search_string(title):
    with Session() as session:
        try:
            title = clean_text(title)
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
            id = clean_num_only(str(id))
            music = session.query(Music).filter(Music.id==id).first()
            if music:
                return send_file(os.path.join(utils.music_get_save_dir(), music.filename), as_attachment=False), 200
            else:
                return 'Not found', 404
        except:
            return '', 400
        
# Retrieve top 10 music
@music_bp.route("/trending", methods=["GET"])
def music_retrieve_trending():
    with Session() as session:
        try:
            musics = session.query(Music, User.name, Album.title).join(User, Music.ownerId == User.id).join(AlbumMusic, Music.id == AlbumMusic.idMusic).join(Album, AlbumMusic.idAlbum == Album.id).order_by(Music.id.desc()).limit(10).all()
            if musics:
                return jsonify([{
                    "id": music.id,
                    "title": music.title,
                    "duration": music.duration,
                    "genreId": music.genreId,
                    "ownerName": owner_name,
                    "albumName": album_name
                } for music, owner_name, album_name in musics]), 200
            else:
                return '', 404
        except:
            return '', 400
        
# Retrieve music owned by caller
@music_bp.route("/mine", methods=["GET"])
def music_retrieve_mine():
    with Session() as session:
        try:
            user, status = utils.check_authenticated(session, request)
            ownerId = user.id

            musics = session.query(Music, User.name, Album.title).filter(Music.ownerId == ownerId).join(User, Music.ownerId == User.id).join(AlbumMusic, Music.id == AlbumMusic.idMusic).join(Album, AlbumMusic.idAlbum == Album.id).all()
            if musics:
                return jsonify([{
                    "id": music.id,
                    "title": music.title,
                    "duration": music.duration,
                    "genreId": music.genreId,
                    "ownerName": owner_name,
                    "albumName": album_name
                } for music, owner_name, album_name in musics]), 200
            else:
                return '', 404
        except:
            return '', 400

# Retrieve all music
@music_bp.route("/", methods=["GET"])
def music_retrieve_all():
    with Session() as session:
        try:
            musics = session.query(Music, User.name, Album.title).join(User, Music.ownerId == User.id).join(AlbumMusic, Music.id == AlbumMusic.idMusic).join(Album, AlbumMusic.idAlbum == Album.id).all()
            return jsonify([{
                "id": music.id,
                "title": music.title,
                "duration": music.duration,
                "genreId": music.genreId,
                "ownerName": owner_name,
                "albumName": album_name
            } for music, owner_name, album_name in musics]), 200
        except:
            return '', 400
    