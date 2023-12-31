import math
import os
from flask import Blueprint, jsonify, request, send_file
from werkzeug.utils import secure_filename

from ..__init__ import Session, Music, User, AlbumMusic, Album
from ..csrf import CSRF
from validation import clean_text, validate_name
import helpers

music_bp = Blueprint("music_bp", __name__)

# Create a new music entry
@music_bp.route("/create", methods=["POST"])
def music_create():
    if not CSRF().validate(request.headers.get("X-Csrf-Token", None)):
        return "Skill issue", 403
    
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status

            owner_id = user.id
            data = request.form
            title = data.get("title", "")
            genre_id = data.get("genreId", "")
            album_id = data.get("albumId", "")

            title_valid, title_error = validate_name(title)
            if not title_valid:
                return title_error, 400
            
            if not genre_id.isdigit():
                return 'Invalid genre ID', 400
            
            if not album_id.isdigit():
                return 'Invalid album ID', 400
            
            if request.files is None or "music_file" not in request.files:
                return 'No music file', 400
            music_file = request.files["music_file"]
            
            filename, ext = os.path.splitext(music_file.filename)
            if ext.lower() != '.mp3':
                return 'Invalid file type', 400
            
            # Clean filename
            # Limit title to 28 characters, leave 6 characters for owner ID prefix, and 4 characters for extension
            # XXXXXX-<title>.mp3 (Typically 6 + 28 + 4 = 38 characters, max db support is 45 characters)
            filename = f"{owner_id:06}-{secure_filename(filename)[:28]}{ext}"
            save_dir = helpers.music_get_save_dir()
            save_path = os.path.join(save_dir, filename)

            if os.path.commonprefix((os.path.realpath(save_path), save_dir)) != save_dir:
                return 'Invalid file name', 400

            music_file.save(save_path)
            meta = helpers.music_strip_tags_and_get_metadata(save_path)
            if meta is None:
                return 'Music file is invalid.', 400
            # Size constrained with Max-Content-Length header, no need to check here
            duration, _ = meta
            duration = math.ceil(duration)
            
            new_music = Music(title, filename, duration, genre_id, owner_id)
            session.add(new_music)
            session.flush()
            session.add(AlbumMusic(album_id, new_music.id))
            session.commit()
            return 'Created', 201
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
        
# Delete music, and remove from all playlists and albums
@music_bp.route("/delete/<int:id>", methods=["DELETE"])
def music_delete_id(id):
    if not CSRF().validate(request.headers.get("X-Csrf-Token", None)):
        return "Skill issue", 403
    
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status
             
            music = session.get(Music, id)
            if music and (user.roleId == 1 or music.ownerId == user.id):
                session.delete(music)
                session.commit()
                return 'OK', 200
            else:
                return helpers.nachoneko(), 404
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve all music that matches (substring of) search
@music_bp.route("/search=<string:title>", methods=["GET"])
def music_search_string(title):
    with Session() as session:
        try:
            title = clean_text(title)
            music_search_results = session.query(Music).filter(Music.title.ilike(f"{title}%"))
            if music_search_results:
                return jsonify([{
                    "id": music.id,
                    "title": music.title,
                    "duration": music.duration,
                    "genreId": music.genreId
                } for music in music_search_results]), 200
            else:
                return 'Not found', 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve music file based on ID
@music_bp.route("/play/<int:id>", methods=["GET"])
def music_play_id(id):
    with Session() as session:
        try:
            music = session.query(Music).filter(Music.id==id).first()
            if music:
                return send_file(os.path.join(helpers.music_get_save_dir(), music.filename), as_attachment=False), 200
            else:
                return 'Not found', 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
        
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
                return 'Not found', 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
        
# Retrieve music owned by caller
@music_bp.route("/mine", methods=["GET"])
def music_retrieve_mine():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status
            
            # Only user can retrieve their own music
            if user.roleId != 2:
                return helpers.nachoneko(), 403

            owner_id = user.id
            musics = session.query(Music, User.name, Album.title).filter(Music.ownerId == owner_id).join(User, Music.ownerId == User.id).join(AlbumMusic, Music.id == AlbumMusic.idMusic).join(Album, AlbumMusic.idAlbum == Album.id).all()
            
            return jsonify([{
                "id": music.id,
                "title": music.title,
                "duration": music.duration,
                "genreId": music.genreId,
                "ownerName": owner_name,
                "albumName": album_name
            } for music, owner_name, album_name in musics]), 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve all music (for admin)
@music_bp.route("/", methods=["GET"])
def music_retrieve_all():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status
            
            # Only admin can retrieve all music
            if user.roleId != 1:
                return helpers.nachoneko(), 403

            musics = session.query(Music, User.name, Album.title).join(User, Music.ownerId == User.id).join(AlbumMusic, Music.id == AlbumMusic.idMusic).join(Album, AlbumMusic.idAlbum == Album.id).all()
            return jsonify([{
                "id": music.id,
                "title": music.title,
                "duration": music.duration,
                "genreId": music.genreId,
                "ownerName": owner_name,
                "albumName": album_name
            } for music, owner_name, album_name in musics]), 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
    
