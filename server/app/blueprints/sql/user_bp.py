from flask import Blueprint, jsonify, request
from markupsafe import escape
from .. import Session, User
import utils

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

@user_bp.route("/register", methods=["POST"])
def register():
    with Session() as session:
        try:
            data = request.form
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            confirmPassword = data.get("confirmPassword")
            if username is None:
                return "Username is required.", 400
            
            if email is None:
                return "Email is required.", 400
            
            if len(username) > 64:
                return escape("Username is too long, must be < 64 characters."), 400
            
            if not utils.is_email_valid(email):
                return "Email is invalid.", 400
            
            if confirmPassword != password:
                return "Check that you entered both passwords correctly.", 400
            
            # Fields are valid, proceed to generate user
            hashPwd = utils.hash_password(password)
            print(len(hashPwd))
            newUser = User(username, email, hashPwd, banStatus=2, roleId=2, mfaSecret="")
            session.add(newUser)
            session.commit()
            return "ok!", 200
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return "rip something went wrong (#×_×)", 400
            
@user_bp.route("/onboarding", methods=["POST"])
def onboarding():
    return