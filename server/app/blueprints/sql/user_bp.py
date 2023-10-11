from flask import Blueprint, jsonify
from .. import Session, User

user_bp = Blueprint("user_bp", __name__)

# Retrieve all users
@user_bp.route("/", methods=["GET"])
def user_retrieve_all():
    with Session() as session:
        try:
            users = session.query(User).all()
            return jsonify([{
                "id": user.id,
                "name": user.name
            } for user in users if user.roleId != 1]), 200
        except:
            return '', 400
    