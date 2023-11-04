from datetime import datetime
from email import utils
from flask import Blueprint, jsonify, request

from ..__init__ import Session, Album, AlbumMusic, Music, User
import helpers
from validation import clean_text, validate_name

album_bp = Blueprint("album_bp", __name__)

# Create a new album entry
@album_bp.route("/create", methods=["POST"])
def album_create():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status

            ownerId = user.id

            data = request.form
            title = data.get("title", None)
            releaseDateStr = data.get("releaseDate", None) # Format: YYYY-MM-DD
            description = data.get("description", None) # Optional
            # imageUrl = data.get("imageUrl", None) # Optional

            title = clean_text(title)
            title_valid, title_error = validate_name(title)
            if not title_valid:
                return title_error, 400

            if description is not None and description != '':
                description = clean_text(description)

            if releaseDateStr is None:
                return "Release date is required", 400
            releaseDate = datetime.strptime(releaseDateStr, "%Y-%m-%d")

            new_album = Album(title, releaseDate, ownerId, None, description)

            session.add(new_album)
            session.commit()
            return jsonify({ 'id': new_album.id }), 201
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
        
# Delete an album entry
@album_bp.route("/<int:idAlbum>/delete", methods=["DELETE"])
def album_delete(idAlbum):
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status

            album = session.get(Album, idAlbum)
            if album:
                if album.ownerId == user.id or user.roleId == 1:
                    session.delete(album)
                    session.commit()
                    return "Deleted", 200
                else:
                    return "Unauthorized", 401
            else:
                return "Album not found", 404
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve all music based on Album ID
@album_bp.route("/<int:idAlbum>/music", methods=["GET"])
def album_retrieve_all_music(idAlbum):
    with Session() as session:
        try:
            album = session.get(Album, idAlbum)
            if album:
                album_music = session.query(Music, User.name, Album.title).select_from(Music).join(AlbumMusic).filter(AlbumMusic.idAlbum == idAlbum).join(User, User.id == Music.ownerId).join(Album, Album.id == AlbumMusic.idAlbum).all()
                return jsonify([{
                    "id": music.id,
                    "title": music.title,
                    "duration": music.duration,
                    "genreId": music.genreId,
                    "ownerName": owner_name,
                    "albumName": album_name
                } for music, owner_name, album_name in album_music]), 200
            else:
                return 'No album with specified ID.', 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve all albums that belong to an artist
@album_bp.route("/artist=<int:ownerId>", methods=["GET"])
def album_by_artist(ownerId):
    with Session() as session:
        try:
            albums = session.query(Album, User.name).join(User).filter(Album.ownerId == ownerId).all()
            if albums:
                return jsonify([{
                    "id": album.id,
                    "title": album.title,
                    "imageUrl": album.imageUrl,
                    "releaseDate": album.releaseDate,
                    "ownerId": album.ownerId,
                    "ownerName": ownerName,
                    "description": album.description
                } for album, ownerName in albums]), 200
            else:
                return 'No such artist', 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve a specific album
@album_bp.route("/<int:idAlbum>", methods=["GET"])
def album_retrieve(idAlbum):
    with Session() as session:
        try:
            album, ownerName = session.query(Album, User.name).join(User).filter(Album.id == idAlbum).first()
            if album:
                return jsonify({
                    "id": album.id,
                    "title": album.title,
                    "imageUrl": album.imageUrl,
                    "releaseDate": album.releaseDate,
                    "ownerId": album.ownerId,
                    "ownerName": ownerName,
                    "description": album.description
                }), 200
            else:
                return 'Album not found.', 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
        
# Retrive top 3 albums based on number of music
@album_bp.route("/top3", methods=["GET"])
def album_retrieve_top3():
    with Session() as session:
        try:
            albums = session.query(Album, User.name).join(User).order_by(Album.id.desc()).limit(3).all()
            return jsonify([{
                "id": album.id,
                "title": album.title,
                "imageUrl": album.imageUrl,
                "releaseDate": album.releaseDate,
                "ownerId": album.ownerId,
                "ownerName": ownerName,
                "description": album.description
            } for album, ownerName in albums]), 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve albums owned by caller
@album_bp.route("/mine", methods=["GET"])
def album_retrieve_mine():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status

            ownerId = user.id
            albums = session.query(Album, User.name).filter(Album.ownerId == ownerId).join(User).all()
            if albums:
                return jsonify([{
                    "id": album.id,
                    "title": album.title,
                    "imageUrl": album.imageUrl,
                    "releaseDate": album.releaseDate,
                    "ownerId": album.ownerId,
                    "ownerName": ownerName,
                    "description": album.description
                } for album, ownerName in albums]), 200
            else:
                return 'Not found', 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve all albums
@album_bp.route("/", methods=["GET"])
def album_retrieve_all():
    with Session() as session:
        try:
            albums = session.query(Album, User.name).join(User).all()
            return jsonify([{
                "id": album.id,
                "title": album.title,
                "imageUrl": album.imageUrl,
                "releaseDate": album.releaseDate,
                "ownerId": album.ownerId,
                "ownerName": ownerName,
                "description": album.description
            } for album, ownerName in albums]), 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
    