from flask import Blueprint, jsonify
from ..__init__ import Firestore

history_bp = Blueprint("history_bp", __name__)
nosql = Firestore()

# Firestore endpoints
@history_bp.route("/<string:id>", methods=["GET"])
def music_retrieve_id_history(id):
    try:
        music_ref = nosql.collection("music")
        musics = music_ref.stream()
        return jsonify([music.to_dict() for music in musics]), 200
    except:
        return '', 404
    