from flask import Blueprint, jsonify, request
from markupsafe import escape

from .. import Session, User, Role
import utils

user_bp = Blueprint("user_bp", __name__)

# Retrieve all users
@user_bp.route("/", methods=["GET"])
def user_retrieve_all():
    with Session() as session:
        try:
            users = session.query(User).join(Role).filter(User.roleId != 1).all()
            return jsonify([{
                "id": user.id,
                "name": user.name
            } for user in users]), 200
        except:
            return '', 400
        
# Retrive top 3 users
@user_bp.route("/top3", methods=["GET"])
def user_retrieve_top3():
    with Session() as session:
        try:
            users = session.query(User).filter(User.roleId != 1).limit(3).all()
            return jsonify([{
                "id": user.id,
                "name": user.name
            } for user in users[:3]]), 200
        except:
            return '', 400
        
# Retrieve user by id
@user_bp.route("/<id>", methods=["GET"])
def user_retrieve_by_id(id):
    with Session() as session:
        try:
            user = session.query(User).filter(User.id==id).first()
            if user is None:
                return '', 404
            return jsonify({
                "id": user.id,
                "name": user.name
            }), 200
        except:
            return '', 400

@user_bp.route("/register", methods=["POST"])
def register():
    with Session() as session:
        try:
            data = request.form
            name = data.get("name")
            email = data.get("email")
            password = data.get("password")
            confirmPassword = data.get("confirmPassword")
            if name is None:
                return "Name is required.", 400
            
            if email is None:
                return "Email is required.", 400
            
            if len(name) > 64:
                return escape("Name is too long, must be < 64 characters."), 400
            
            if not utils.is_email_valid(email):
                return "Email is invalid.", 400
            
            if confirmPassword != password:
                return "Check that you entered both passwords correctly.", 400
            
            # Fields are valid, proceed to generate user
            hashPwd = utils.hash_password(password)
            newUser = User(name, email, hashPwd, status=2, roleId=2, mfaSecret="", about="")
            session.add(newUser)
            session.commit()
            utils.send_onboarding_email(name, email)
            return "ok!", 200
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return "rip something went wrong (#x_x)", 400
            
@user_bp.route("/onboarding/<token>", methods=["GET"])
def onboarding(token):
    with Session() as session:
        try:
            verifying_email = utils.verify_onboarding_email(token)
            if verifying_email is None:
                return "bruh you tampered with the token (#x_x)", 400
            user = session.query(User).filter(User.email==verifying_email).first()
            if user.status != 2:
                return "bruh you already registered (#x_x)", 400
            user.status = 0
            user.mfaSecret = utils.generate_otp_secret()
            session.commit()
            return utils.generate_otp_qr_string(user.name, user.mfaSecret), 200
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return "rip something went wrong (#x_x)", 400
