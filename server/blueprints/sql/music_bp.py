from flask import Blueprint, jsonify, request
from ..__init__ import Session, Music

music_bp = Blueprint("music_bp", __name__)

@music_bp.route("/delete/<int:id>", methods=["DELETE"])
def music_delete(id):
    with Session() as session:
        music = session.get(Music, id)
        if music:
            session.delete(music)
            session.commit()
            return '', 200
        else:
            session.rollback()
            return '', 400

@music_bp.route("/create", methods=["POST"])
def music_create():
    with Session() as session:
        try:
            data = request.form
            music_file = request.files["music_file"]
            if music_file:
                from utils import music_get_duration, music_save
                music_save(music_file)
                duration = music_get_duration(music_file.filename)
                session.add(Music(data["title"], music_file.filename, duration, data["genreId"]))
                session.commit()
                return '', 200
        except:
            session.rollback()
            return '', 400
            
@music_bp.route("/play/<int:id>", methods=["GET"])
def music_play_id(id):
    with Session() as session:
        music = session.query(Music).filter(Music.id==id).first()
        if music:
            from flask import send_file
            from utils import music_get_path
            music = session.query(Music).filter(Music.id == id).first()
            return send_file(music_get_path(music.filename), as_attachment=False), 200
        else:
            session.rollback()
            return '', 404
        
@music_bp.route("/", methods=["GET"])
def music_retrieve_all():
    with Session() as session:
        musics = session.query(Music).all()
        return jsonify([{
            "id": music.id,
            "title": music.title,
            "duration": music.duration,
            "genreId": music.genreId
        } for music in musics]), 200
    