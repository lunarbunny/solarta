from flask import Blueprint, jsonify
from ..__init__ import Session, Genre

genre_bp = Blueprint("genre_bp", __name__)

@genre_bp.route("/", methods=["GET"])
def genre_retrieve_all():
    with Session() as session:
        genres = session.query(Genre).all()
        return jsonify([{
            "id": genre.id,
            "name": genre.name
        } for genre in genres]), 200
    