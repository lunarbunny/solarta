from flask import Blueprint, jsonify, request, make_response
from markupsafe import escape
from validation import clean_email, clean_num_only, clean_text, validate_email, validate_name, validate_about

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
        
# Retrieve user by id
@user_bp.route("/<int:id>", methods=["GET"])
def user_retrieve_by_id(id):
    with Session() as session:
        try:
            id = clean_num_only(str(id))
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
        
# Retrive top 3 users (artists)
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

# Register a new user
@user_bp.route("/register", methods=["POST"])
def register():
    with Session() as session:
        try:
            data = request.form
            name = clean_text(data.get("name"))
            email = clean_email(data.get("email"))
            password = data.get("password")
            if name is None:
                return "Name is required.", 400
            
            if email is None:
                return "Email is required.", 400
            
            name_valid, name_error = validate_name(name)
            if not name_valid:
                return name_error, 400
            
            email_valid, email_error = validate_email(email)
            if not email_valid:
                return email_error, 400
            
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
            
# Update user profile
@user_bp.route("/update", methods=["POST"])
def update():
    with Session() as session:
        try:
            user, status = utils.check_authenticated(session, request)
            if user is None:
                return utils.nachoneko(), status

            data = request.form
            name = data.get("name", None)
            about = data.get("about", None)
            password = data.get("password", None)
            newPassword = data.get("newPassword", None)
            mfa = data.get("mfa", None)
            
            if name is not None and name != "":
                name = clean_text(name)
                name_valid, name_error = validate_name(name)
                if not name_valid:
                    return escape(name_error), 400
                user.name = name
            
            if about is not None and about != "":
                about = clean_text(about)
                about_valid, about_error = validate_about(about)
                if not about_valid:
                    return escape(about_error), 400
                user.about = about

            if newPassword is not None and newPassword != "":
                if password is None or password == "":
                    return "Password is required.", 400
                if newPassword == "" or newPassword is None:
                    return "New password is required.", 400
                if mfa is None or mfa == "":
                    return "MFA is required.", 400
                if not utils.verify_otp(mfa, user.mfaSecret):
                    return utils.nachoneko(), 401
                if not utils.verify_password_hash(user.hashPwd, password):
                    return utils.nachoneko(), 401
                hashPwd = utils.hash_password(newPassword)
                user.hashPwd = hashPwd
            
            session.commit()
            return "ok!", 200
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return utils.nachoneko(), 400
            
# Verify email and setup MFA
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

# Login with email, password and OTP
@user_bp.route("/login", methods=["POST"])
def login():
    with Session() as session:
        try:
            data = request.form
            email = data.get("email", None)
            password = data.get("password", None)
            mfa = data.get("mfa", None)

            cleaned_email = clean_email(email)
            email_valid, email_error = validate_email(cleaned_email)
            if not email_valid:
                return email_error, 400

            if mfa is None:
                return "MFA is required.", 400
            elif not mfa.isdigit() or len(mfa) != 6:
                return "MFA is incorrect.", 400

            if password is None:
                return "Password is required.", 400
        
            user = session.query(User).filter(User.email==cleaned_email).first()

            if user is None: # User does not exist
                return utils.nachoneko(), 401
            elif user.status == 1: # Banned
                return utils.nachoneko(), 403

            if not utils.verify_otp(mfa, user.mfaSecret):
                return utils.nachoneko(), 401

            if not utils.verify_password_hash(user.hashPwd, password):
                return utils.nachoneko(), 401

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
    
# Check if user is authenticated
@user_bp.route("/authenticated", methods=["GET"])
def authenticated():
    with Session() as session:
        user, status = utils.check_authenticated(session, request)

        if user is None:
            if utils.is_debug_mode:
                return "Invalid session cookie.", status
            else:
                return utils.nachoneko(), status
            
        if user.status == 1: # Banned
            return utils.nachoneko(), 403

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "about": "" if user.about is None else user.about,
            "admin": user.roleId == 1,
        }), 200

@user_bp.route("/logout", methods=["GET"])
def logout():
    with Session() as session:
        try:
            user, status = utils.check_authenticated(session, request)
            if user is None:
                return utils.nachoneko(), status

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
