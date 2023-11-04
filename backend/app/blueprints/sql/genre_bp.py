from flask import Blueprint, jsonify, request
from ..__init__ import Session, Genre
import helpers

genre_bp = Blueprint("genre_bp", __name__)

# Retrieve all genres
@genre_bp.route("/", methods=["GET"])
def genre_retrieve_all():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status

            genres = session.query(Genre).all()
            return jsonify([{
                "id": genre.id,
                "name": genre.name
            } for genre in genres]), 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
    