from datetime import datetime
from flask import Blueprint, jsonify, request
from ..__init__ import Session, Playlist, PlaylistMusic, Music

playlist_bp = Blueprint("playlist_bp", __name__)

# Delete a playlist
@playlist_bp.route("/<int:id>/delete", methods=["DELETE"])
def playlist_delete(id):
    from ..__init__ import PlaylistMusic
    with Session() as session:
        try:
            playlist = session.get(Playlist, id)
            if playlist:
                session.query(PlaylistMusic).filter(PlaylistMusic.idPlaylist == id).delete()
                session.delete(playlist)
                session.commit()
                return '', 200
            else:
                return '', 404
        except:
            session.rollback()
            return '', 400

# Create a playlist
@playlist_bp.route("/create", methods=["POST"])
def playlist_create():
    with Session() as session:
        try:
            data = request.form
            ownerId = int(data["ownerId"]) # TODO: Should take from session instead
            creationDateStr = data.get("creationDate", datetime.now().strftime("%Y-%m-%d")) # Format: YYYY-MM-DD
            title = data["title"]
            description = data.get("description", None)

            if ownerId == "" or title == "":
                return "Missing parameters", 400

            creationDate = datetime.strptime(creationDateStr, "%Y-%m-%d")
            new_playlist = Playlist(ownerId, creationDate, title, description)
            session.add(new_playlist)
            session.commit()
            return "Created", 201
        except Exception as e:
            session.rollback()
            return str(e), 400
        
# Add song to playlist
@playlist_bp.route("/playlist=<int:idPlaylist>/music=<int:idMusic>", methods=["POST"])
def playlist_add_song(idPlaylist, idMusic):
    with Session() as session:
        try:
            idPlaylist = int(idPlaylist)
            idMusic = int(idMusic)
            playlist = session.get(Playlist, idPlaylist)
            music = session.get(Music, idMusic)

            if playlist and music:
                new_playlist_music = PlaylistMusic(idPlaylist, idMusic)
                session.add(new_playlist_music)
                session.commit()
                return 'Created', 201
            else:
                return '', 404
        except Exception as e:
            session.rollback()
            return str(e), 400

# Update a playlist (title and/or description)
@playlist_bp.route("/<int:id>/update", methods=["PUT"])
def playlist_update(id):
    with Session() as session:
        try:
            music = session.get(Playlist, id)
            if music:
                data = request.form
                title = data.get("title", music.title)
                description = data.get("description", music.description)
                music.title = title
                music.description = description
                session.commit()
                return 'OK', 200
            else:
                return '', 404
        except Exception as e:
            session.rollback()
            return str(e), 400

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
    