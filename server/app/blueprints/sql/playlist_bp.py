from flask import Blueprint, jsonify
from ..__init__ import Session, Playlist, PlaylistMusic, Music

playlist_bp = Blueprint("playlist_bp", __name__)

# Delete a playlist
@playlist_bp.route("/<int:id>/delete", methods=["DELETE"])
def playlist_delete(id):
    with Session() as session:
        try:
            playlist = session.get(Playlist, id)
            if playlist:
                session.delete(playlist)
                session.commit()
                return '', 200
            else:
                return '', 404
        except:
            session.rollback()
            return '', 400

# Retrieve all music based on Playlist ID
@playlist_bp.route("/<int:idPlaylist>/music", methods=["GET"])
def playlist_retrieve_all_music(idPlaylist):
    with Session() as session:
        try:
            playlist = session.get(Playlist, idPlaylist)
            if playlist:
                playlist_music = session.query(Music).join(PlaylistMusic).filter(PlaylistMusic.idPlaylist == idPlaylist)
                return jsonify([{
                    "id": music.id,
                    "title": music.title,
                    "duration": music.duration,
                    "genreId": music.genreId
                } for music in playlist_music]), 200
            else:
                return '', 404
        except:
            return '', 400

# Retrieve all playlists of a user
@playlist_bp.route("/owner/<int:ownerId>", methods=["GET"])
def playlist_retrieve_user(ownerId):
    with Session() as session:
        try:
            playlists = session.query(Playlist).filter(Playlist.ownerId == ownerId).all()
            return jsonify([{
                "id": playlist.id,
                "creationDate": playlist.creationDate,
                "title": playlist.title,
                "description": playlist.description
            } for playlist in playlists]), 200
        except:
            return '', 400
    