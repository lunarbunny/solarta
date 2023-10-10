from flask import Blueprint, jsonify
from ..__init__ import Session, Album, AlbumMusic, Music

album_bp = Blueprint("album_bp", __name__)

# Retrieve all music based on Album ID
@album_bp.route("/<int:idAlbum>/music", methods=["GET"])
def album_retrieve_all_music(idAlbum):
    with Session() as session:
        try:
            album = session.get(Album, idAlbum)
            if album:
                album_music = session.query(Music).join(AlbumMusic).filter(AlbumMusic.idAlbum == idAlbum)
                return jsonify([{
                    "id": music.id,
                    "title": music.title,
                    "duration": music.duration,
                    "genreId": music.genreId
                } for music in album_music]), 200
            else:
                return '', 404
        except:
            return '', 400

# Retrieve all albums that belong to an artist
@album_bp.route("/artist=<int:ownerId>")
def album_by_artist(ownerId):
    with Session() as session:
        try:
            albums = session.query(Album).filter(Album.ownerId == ownerId)
            if albums:
                return jsonify([{
                    "id": album.id,
                    "title": album.title,
                    "imageUrl": album.imageUrl,
                    "releaseDate": album.releaseDate,
                    "ownerId": album.ownerId,
                    "description": album.description
                } for album in albums]), 200
            else:
                return '', 404
        except:
            return '', 400

# Retrieve all albums
@album_bp.route("/", methods=["GET"])
def album_retrieve_all():
    with Session() as session:
        try:
            albums = session.query(Album).all()
            return jsonify([{
                "id": album.id,
                "title": album.title,
                "imageUrl": album.imageUrl,
                "releaseDate": album.releaseDate,
                "ownerId": album.ownerId,
                "description": album.description
            } for album in albums]), 200
        except:
            return '', 400
    