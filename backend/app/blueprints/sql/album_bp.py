from datetime import datetime
from flask import Blueprint, jsonify, request

from ..__init__ import Session, Album, AlbumMusic, Music, User
from ..csrf import CSRF
import helpers
from validation import clean_text, validate_desc, validate_name

album_bp = Blueprint("album_bp", __name__)

# Create a new album entry
@album_bp.route("/create", methods=["POST"])
def album_create():
    if not CSRF().validate(request.headers.get("X-Csrf-Token", None)):
        return "Skill issue", 403
    
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status
            
            # Only user can create album
            if user.roleId != 2:
                return helpers.nachoneko(), 403

            data = request.form
            title = data.get("title", None)
            rel_date_str = data.get("releaseDate", None) # Format: YYYY-MM-DD
            description = data.get("description", None) # Optional

            title = clean_text(title)
            title_valid, title_error = validate_name(title)
            if not title_valid:
                return title_error, 400

            if description is not None and description != '':
                description = clean_text(description)
                valid_desc, desc_error = validate_desc(description)
                if not valid_desc:
                    return desc_error, 400

            if rel_date_str is None:
                return "Release date is required", 400
            release_date = datetime.strptime(rel_date_str, "%Y-%m-%d")

            new_album = Album(title, release_date, user.id, None, description)

            session.add(new_album)
            session.commit()
            return jsonify({ 'id': new_album.id }), 201
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
        
# Delete an album entry
@album_bp.route("/<int:album_id>/delete", methods=["DELETE"])
def album_delete(album_id):
    if not CSRF().validate(request.headers.get("X-Csrf-Token", None)):
        return "Skill issue", 403
    
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status

            album = session.get(Album, album_id)
            
            if album is None:
                return "Not found", 404

            # Only allow deletion if user is admin or owner of album
            if not (album.ownerId == user.id or user.roleId == 1):
                return "Unauthorized", 403

            session.delete(album)
            session.commit()
            return "Deleted", 200
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve all music based on Album ID
@album_bp.route("/<int:album_id>/music", methods=["GET"])
def album_retrieve_all_music(album_id):
    with Session() as session:
        try:
            album = session.get(Album, album_id)

            if album is None:
                return "Not found", 404
            
            # Retrieve all music that belongs to this album
            album_music = session.query(Music, User.name, Album.title).select_from(Music).join(AlbumMusic).filter(AlbumMusic.idAlbum == album_id).join(User, User.id == Music.ownerId).join(Album, Album.id == AlbumMusic.idAlbum).all()
            return jsonify([{
                "id": music.id,
                "title": music.title,
                "duration": music.duration,
                "genreId": music.genreId,
                "ownerName": owner_name,
                "albumName": album_name
            } for music, owner_name, album_name in album_music]), 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve all albums that belong to an artist
@album_bp.route("/artist=<int:owner_id>", methods=["GET"])
def album_by_artist(owner_id):
    with Session() as session:
        try:
            albums = session.query(Album, User.name).join(User).filter(Album.ownerId == owner_id).all()
            
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

# Retrieve a specific album
@album_bp.route("/<int:album_id>", methods=["GET"])
def album_retrieve(album_id):
    with Session() as session:
        try:
            albumOwner = session.query(Album, User.name).join(User).filter(Album.id == album_id).first()
            
            if albumOwner is None:
                return "Not found", 404
            
            album, ownerName = albumOwner
            
            return jsonify({
                "id": album.id,
                "title": album.title,
                "imageUrl": album.imageUrl,
                "releaseDate": album.releaseDate,
                "ownerId": album.ownerId,
                "ownerName": ownerName,
                "description": album.description
            }), 200
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

            # Only user can retrieve their own albums
            if user.roleId != 2:
                return helpers.nachoneko(), 403

            ownerId = user.id
            albums = session.query(Album, User.name).filter(Album.ownerId == ownerId).join(User).all()
            
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
    
