from datetime import datetime
from flask import Blueprint, jsonify, request
from ..__init__ import Session, Album, AlbumMusic, Music, User

album_bp = Blueprint("album_bp", __name__)

# Create a new album entry
@album_bp.route("/create", methods=["POST"])
def album_create():
    with Session() as session:
        try:
            data = request.form
            title = data.get("title", "")
            releaseDateStr = data.get("releaseDate", "") # Format: YYYY-MM-DD
            description = data.get("description", None) # Optional
            imageUrl = data.get("imageUrl", None) # Optional
            ownerId = data.get("ownerId", '3') # TODO: Should take from session instead

            if title == "" or releaseDateStr == "":
                return "Missing parameters", 400

            releaseDate = datetime.strptime(releaseDateStr, "%Y-%m-%d")

            new_album = Album(title, releaseDate, ownerId, imageUrl, description)
            session.add(new_album)
            session.commit()
            return "Created", 201
        except Exception as e:
            session.rollback()
            return str(e), 500

# Retrieve all music based on Album ID
@album_bp.route("/<int:idAlbum>/music", methods=["GET"])
def album_retrieve_all_music(idAlbum):
    with Session() as session:
        try:
            album = session.get(Album, idAlbum)
            if album:
                album_music = session.query(Music, User.name, Album.title).select_from(Music).join(AlbumMusic).filter(AlbumMusic.idAlbum == idAlbum).join(User).join(Album)
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
            return 'Error occured', 400

# Retrieve all albums that belong to an artist
@album_bp.route("/artist=<int:ownerId>")
def album_by_artist(ownerId):
    with Session() as session:
        try:
            albums = session.query(Album).filter(Album.ownerId == ownerId).all()
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
        except:
            return 'Error occured while retriving artist', 400

# Retrieve a specific album        
@album_bp.route("/<int:idAlbum>", methods=["GET"])
def album_retrieve(idAlbum):
    with Session() as session:
        try:
            album, ownerName = session.get(Album, User.name).join(User).filter(Album.id == idAlbum).first()
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
        except:
            return 'Error occured when retrieving album.', 400
        
# Retrive top 3 albums based on number of music
@album_bp.route("/top3", methods=["GET"])
def album_retrieve_top3():
    with Session() as session:
        try:
            albums = session.query(Album, User.name).join(User).limit(3).all()
            return jsonify([{
                "id": album.id,
                "title": album.title,
                "imageUrl": album.imageUrl,
                "releaseDate": album.releaseDate,
                "ownerId": album.ownerId,
                "ownerName": ownerName,
                "description": album.description
            } for album, ownerName in albums]), 200
        except:
            return 'Error occured when retrieving album.', 400

# Retrieve albums owned by caller
@album_bp.route("/mine", methods=["GET"])
def album_retrieve_mine():
    with Session() as session:
        try:
            ownerId = 3 # TODO: Should take from session instead
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
                return '', 404
        except:
            return '', 400

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
        except:
            return 'Error occured when retrieving album.', 400
    