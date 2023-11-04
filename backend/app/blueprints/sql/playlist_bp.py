from datetime import datetime
from flask import Blueprint, jsonify, request

from ..__init__ import Session, Playlist, PlaylistMusic, Music, User
from validation import clean_text
import helpers

playlist_bp = Blueprint("playlist_bp", __name__)


# Delete a playlist
@playlist_bp.route("/<int:id>/delete", methods=["DELETE"])
def playlist_delete(id):
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status
            
            playlist = session.get(Playlist, id)
            if playlist is not None and playlist.ownerId == user.id:
                session.query(PlaylistMusic).filter(PlaylistMusic.idPlaylist == id).delete()
                session.delete(playlist)
                session.commit()
                return "OK", 200
            else:
                return "Not found", 404
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Create a playlist
@playlist_bp.route("/create", methods=["POST"])
def playlist_create():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status

            data = request.form
            creationDateStr = data.get("creationDate", None)  # Format: YYYY-MM-DD
            title = clean_text(data.get("title", None))
            description = clean_text(data.get("description", None))  # Optional
            if title is None or creationDateStr is None:
                return "Missing parameters", 400

            creationDate = datetime.strptime(creationDateStr, "%Y-%m-%d").date()
            new_playlist = Playlist(user.id, creationDate, title, description)
            session.add(new_playlist)
            session.commit()
            return "Created", 201
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Add/Delete songs in playlist
@playlist_bp.route("/playlist=<int:idPlaylist>/music=<int:idMusic>", methods=["POST", "DELETE"])
def playlist_modify_song(idPlaylist, idMusic):
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status
            
            playlist = session.get(Playlist, idPlaylist)

            if request.method == "POST":
                music = session.get(Music, idMusic)
                if playlist and music and playlist.ownerId == user.id:
                    new_playlist_music = PlaylistMusic(idPlaylist, idMusic)
                    session.add(new_playlist_music)
                    session.commit()
                    return "Created", 201
                else:
                    return "Not found", 404
                
            elif request.method == "DELETE":
                if playlist:
                    playlistMusic = session.query(PlaylistMusic).filter(PlaylistMusic.idPlaylist == playlist.id, PlaylistMusic.idMusic == idMusic).one_or_none()
                    if playlistMusic:
                        session.delete(playlistMusic)
                        session.commit()
                        return "OK", 200
                return "Not found", 404
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Update a playlist (title and/or description)
@playlist_bp.route("/<int:id>/update", methods=["PUT"])
def playlist_update(id):
    with Session() as session:
        try:
            music = session.get(Playlist, id)
            if music:
                data = request.form
                title = clean_text(data.get("title", music.title))
                description = clean_text(data.get("description", music.description))
                music.title = title
                music.description = description
                session.commit()
                return "OK", 200
            else:
                return "Not found", 404
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Retrieve all music not added into current playlist
@playlist_bp.route("<int:idPlaylist>/music/notadded", methods=["GET"])
def playlist_retrieve_notadded_music(idPlaylist):
    with Session() as session:
        try:
            playlist = session.get(Playlist, idPlaylist)
            if playlist:
                to_exclude = session.query(PlaylistMusic.idMusic).filter(PlaylistMusic.idPlaylist == playlist.id)
                excluded_playlist = (
                    session.query(Music, User.name)
                    .join(User, User.id == Music.ownerId)
                    .filter(~Music.id.in_(to_exclude))
                    .all()
                )
                return (
                    jsonify([{
                        "id": music.id,
                        "title": music.title,
                        "duration": music.duration,
                        "genreId": music.genreId,
                        "ownerName": owner_name
                    } for music, owner_name in excluded_playlist]), 200
                )
            else:
                return "Not found", 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Retrieve all music based on Playlist ID
@playlist_bp.route("/<int:idPlaylist>/music", methods=["GET"])
def playlist_retrieve_all_music(idPlaylist):
    with Session() as session:
        try:
            playlist = session.get(Playlist, idPlaylist)
            if playlist:
                playlist_music = (
                    session.query(Music, User.name)
                    .join(PlaylistMusic)
                    .filter(PlaylistMusic.idPlaylist == idPlaylist)
                    .join(User, User.id == Music.ownerId)
                    .all()
                )
                return (
                    jsonify([{
                        "id": music.id,
                        "title": music.title,
                        "duration": music.duration,
                        "genreId": music.genreId,
                        "ownerName": owner_name
                    } for music, owner_name in playlist_music]), 200
                )
            else:
                return "Not found", 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Retrieve all playlists of a user
@playlist_bp.route("/mine", methods=["GET"])
def playlist_retrieve_user():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status

            ownerId = user.id
            playlists = (
                session.query(Playlist).filter(Playlist.ownerId == ownerId).all()
            )
            return (
                jsonify(
                    [
                        {
                            "id": playlist.id,
                            "creationDate": playlist.creationDate,
                            "title": playlist.title,
                            "description": playlist.description,
                        }
                        for playlist in playlists
                    ]
                ),
                200,
            )
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Retrieve a certain playlist
@playlist_bp.route("/<int:idPlaylist>", methods=["GET"])
def playlist_retrieve_details(idPlaylist):
    with Session() as session:
        try:
            playlist = session.get(Playlist, idPlaylist)
            if playlist:
                return (
                    jsonify(
                        {
                            "id": playlist.id,
                            "title": playlist.title,
                            "description": playlist.description,
                            "creationDate": playlist.creationDate,
                        }
                    ),
                    200,
                )
            else:
                return "Playlist not found.", 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
