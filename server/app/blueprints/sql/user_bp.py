from flask import Blueprint, jsonify, request, make_response
from markupsafe import escape
from utils import clean_input

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
                "name": user.name,
                "about": user.about,
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
                "name": user.name,
                "about": user.about,
            } for user in users[:3]]), 200
        except:
            return '', 400
        
# Retrieve user by id
@user_bp.route("/<int:id>", methods=["GET"])
def user_retrieve_by_id(id):
    with Session() as session:
        try:
            id = clean_input(str(id))
            user = session.query(User).filter(User.id==id).first()
            if user is None:
                return '', 404
            return jsonify({
                "id": user.id,
                "name": user.name,
                "about": user.about,
            }), 200
        except:
            return '', 400

@user_bp.route("/register", methods=["POST"])
def register():
    with Session() as session:
        try:
            data = request.form
            name = clean_input(data.get("name"))
            email = clean_input(data.get("email"))
            password = clean_input(data.get("password"))
            #confirmPassword = clean_input(data.get("confirmPassword"))
            if name is None:
                return "Name is required.", 400
            
            if email is None:
                return "Email is required.", 400
            
            if len(name) > 64:
                return escape("Name is too long, must be <= 64 characters."), 400
            
            if not utils.is_email_valid(email):
                return "Email is invalid.", 400
            
            #if confirmPassword != password:
            #    return "Check that you entered both passwords correctly.", 400
            
            # Fields are valid, proceed to generate user
            hashPwd = utils.hash_password(password)
            newUser = User(name, email, hashPwd, status=2, roleId=2, mfaSecret=None, sessionId=None, sessionExpiry=None, about=None)
            session.add(newUser)
            session.commit()
            utils.send_onboarding_email(name, email)
            return "ok!", 200
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return utils.nachoneko(), 400
            
@user_bp.route("/onboarding/<string:token>", methods=["GET"])
def onboarding(token):
    with Session() as session:
        try:
            verifying_email = utils.verify_onboarding_email(token)
            if verifying_email is None:
                return utils.nachoneko(), 400
            user = session.query(User).filter(User.email==verifying_email).first()
            if user.status != 2:
                return utils.nachoneko(), 400
            user.status = 0
            user.mfaSecret = utils.generate_otp_secret()
            session.commit()
            return utils.generate_otp_qr_string(user.name, user.mfaSecret), 200
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return utils.nachoneko(), 400

@user_bp.route("/login", methods=["POST"])
def login():
    with Session() as session:
        try:
            data = request.form
            email = data.get("email", None)
            password = data.get("password", None)
            mfa = data.get("mfa", None)

            if email is None:
                return "Email is required.", 400
            elif not utils.is_email_valid(email):
                return "Email is invalid.", 400
            
            clean_email = clean_input(email)

            if mfa is None:
                return "MFA is required.", 400
            elif not mfa.isdigit() or len(mfa) != 6:
                return "MFA is incorrect.", 400

            if password is None:
                return "Password is required.", 400
        
            user = session.query(User).filter(User.email==clean_email).first()

            if not utils.verify_otp(mfa, user.mfaSecret):
                return utils.nachoneko(), 400

            if not utils.verify_password_hash(user.hashPwd, password):
                return utils.nachoneko(), 400

            if user.sessionId == None:
                user.sessionId = utils.generate_session()

            cookie_expiry = utils.set_cookie_expiry()
            user.sessionExpiry = cookie_expiry
            session.commit()

            response = make_response("ok!")
            response.status = 200
            response.set_cookie("SESSIONID",
                                value=user.sessionId,
                                max_age=None,
                                expires=cookie_expiry,
                                secure=False,
                                httponly=True,
                                samesite=None,
                                domain="nisokkususu.com")

            return response

        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return utils.nachoneko(), 400
            
@user_bp.route("/authenticated", methods=["GET"])
def authenticated():
    with Session() as session:
        try:
            sessionId = request.cookies.get('SESSIONID', None)
            if sessionId is None:
                return utils.nachoneko(), 400

            user = utils.verify_session(session, sessionId)
            if user is None:
                return utils.nachoneko(), 400

            return jsonify({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "about": user.about,
            }), 200
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return utils.nachoneko(), 400

@user_bp.route("/logout", methods=["GET"])
def logout():
    with Session() as session:
        try:
            sessionId = clean_input(request.cookies.get('SESSIONID'))
            if sessionId is None:
                return utils.nachoneko(), 400

            user = utils.verify_session(session, sessionId)
            if user is None:
                return utils.nachoneko(), 400

            user.sessionId = None
            user.sessionExpiry = None
            session.commit()

            response = make_response("ok")
            response.set_cookie('SESSIONID', value='', expires=0)

            return response
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return utils.nachoneko(), 400
