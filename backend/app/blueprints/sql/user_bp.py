from flask import Blueprint, jsonify, request, make_response
from markupsafe import escape
from validation import clean_email, clean_text, validate_about, validate_email, validate_mfa, validate_name, validate_password

from .. import Session, User, Role
import utils

user_bp = Blueprint("user_bp", __name__)


# Retrieve all users
@user_bp.route("/", methods=["GET"])
def user_retrieve_all():
    with Session() as session:
        try:
            users = session.query(User).join(Role).filter(User.roleId != 1).all()
            return (
                jsonify(
                    [
                        {
                            "id": user.id,
                            "name": user.name,
                            "about": user.about,
                            "email": user.email,
                            "status": user.status,
                        }
                        for user in users
                    ]
                ),
                200,
            )
        except:
            return "", 400


# Retrieve user by id
@user_bp.route("/<int:id>", methods=["GET"])
def user_retrieve_by_id(id):
    with Session() as session:
        try:
            user = session.query(User).filter(User.id == id).first()
            if user is None:
                return "", 404
            return (
                jsonify(
                    {
                        "id": user.id,
                        "name": user.name,
                        "about": user.about,
                    }
                ),
                200,
            )
        except:
            return "", 400


# Retrive top 3 users (artists)
@user_bp.route("/top3", methods=["GET"])
def user_retrieve_top3():
    with Session() as session:
        try:
            users = session.query(User).filter(User.roleId != 1).order_by(User.id.desc()).limit(3).all()
            return (
                jsonify(
                    [
                        {
                            "id": user.id,
                            "name": user.name,
                            "about": user.about,
                        }
                        for user in users[:3]
                    ]
                ),
                200,
            )
        except:
            return "", 400


# Retrieve all users that matches (substring of) search by name
@user_bp.route("/search=<string:name>", methods=["GET"])
def user_search_by_name(name):
    with Session() as session:
        try:
            user, status = utils.check_authenticated(session, request)
            if user.roleId != 1: # check if admin
                return utils.nachoneko(), status
            name = clean_text(name)
            user_search_results = session.query(User).filter(User.name.ilike(f"{name}%"))
            if user_search_results:
                return jsonify([{
                    "id": user.id,
                    "name": user.name,
                    "about": user.about,
                    "email": user.email,
                    "status": user.status,
                } for user in user_search_results]), 200
            else:
                return 'Not found', 404
        except Exception as e:
            if utils.is_debug_mode:
                return str(e), 400
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
                user.hashPwd = utils.hash_password(newPassword)
            
            session.commit()
            return "ok!", 200
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return utils.nachoneko(), 400


# Register a new user
@user_bp.route("/register", methods=["POST"])
def register():
    with Session() as session:
        try:
            data = request.form
            name = data.get("name", None)
            email = data.get("email", None)
            password = data.get("password", None)
            
            # Validation
            name = clean_text(name)
            name_valid, name_error = validate_name(name)
            if not name_valid:
                return name_error, 400
            
            email = clean_email(email)
            email_valid, email_error = validate_email(email)
            if not email_valid:
                return email_error, 400
            
            pwd_valid, pwd_error = validate_password(password)
            if not pwd_valid:
                return pwd_error, 400
            
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

# Verify email and setup MFA
@user_bp.route("/onboarding/<string:token>", methods=["GET"])
def onboarding(token):
    with Session() as session:
        try:
            verifying_email = utils.verify_onboarding_email(token)
            if verifying_email is None:
                return utils.nachoneko(), 400
            user = session.query(User).filter(User.email == verifying_email).first()
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
            
            email = clean_email(email)
            email_valid, email_error = validate_email(email)
            if not email_valid:
                return email_error, 400

            pwd_valid, pwd_error = validate_password(password)
            if not pwd_valid:
                return pwd_error, 400
            
            mfa_valid, mfa_error = validate_mfa(mfa)
            if not mfa_valid:
                return mfa_error, 400
        
            user = session.query(User).filter(User.email==email).first()

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

        return (
            jsonify(
                {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "about": "" if user.about is None else user.about,
                    "admin": user.roleId == 1,
                }
            ),
            200,
        )


# Request password reset email
@user_bp.route("/reset", methods=["POST"])
def request_reset_password():
    with Session() as session:
        try:
            data = request.form
            email = data.get("email", None)

            if email is None:
                return "Email is required.", 400

            email = clean_email(email)

            user = session.query(User).filter(User.email == email).first()

            if user is None:
                return "ok!", 200 # Don't tell user that email is not found
            
            utils.send_resetting_email(user.name, email)
            return "ok!", 200
        except Exception as e:
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return utils.nachoneko(), 400


# Reset password and MFA
@user_bp.route("/reset/<string:token>", methods=["POST"])
def reset_password(token):
    with Session() as session:
        try:
            verify_reset_email = utils.verify_resetting_email(token)
            if verify_reset_email is None:
                return utils.nachoneko(), 400
            
            # Check if user exists and is active (status == 0)
            user = session.query(User).filter(User.email == verify_reset_email).first()
            if user is None or user.status != 0:
                return utils.nachoneko(), 400

            data = request.form
            password = data.get("newPassword", None)

            if password is None:
                return "Password is required.", 400

            user.hashPwd = utils.hash_password(password)
            
            # Reset MFA
            user.mfaSecret = utils.generate_otp_secret()

            session.commit()
            return utils.generate_otp_qr_string(user.name, user.mfaSecret), 200
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return utils.nachoneko(), 400

# Log out from application
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
            response.set_cookie("SESSIONID", value="", expires=0)

            return response
        except Exception as e:
            session.rollback()
            if utils.is_debug_mode:
                return str(e), 400
            else:
                return utils.nachoneko(), 400


# Allow admin to ban an account
@user_bp.route("/<int:id>/ban", methods=["PUT"])
def user_ban_by_id(id):
    with Session() as session:
        try:
            user = session.get(User, id)
            if user is None:
                return utils.nachoneko(), 400
            user.status = 1
            session.commit()
            return "OK", 200
        except Exception as e:
            if utils.is_debug_mode:
                return str(e), 400
            return utils.nachoneko(), 400

# Allow admin to unban an account
@user_bp.route("/<int:id>/unban", methods=["PUT"])
def user_unban_by_id(id):
    with Session() as session:
        try:
            user = session.get(User, id)
            if user is None:
                return utils.nachoneko(), 400
            user.status = 0
            session.commit()
            return "OK", 200
        except Exception as e:
            if utils.is_debug_mode:
                return str(e), 400
            return utils.nachoneko(), 400

# Allow user to delete their own account
@user_bp.route('/delete', methods=["DELETE"])
def user_delete():
    with Session() as session:
        try:
            user, status = utils.check_authenticated(session, request)
            if user is None:
                if utils.is_debug_mode:
                    return 'Invalid session cookie.', status
                return utils.nachoneko(), 400
            
            data = request.form
            password = data.get("password", None)
            confirmPwd = data.get("cfmPassword", None)
            mfa = data.get("mfa", None)

            if password is None or confirmPwd is None or mfa is None:
                return "Require all details.", 400
            
            if password != confirmPwd:
                return "Password don't match.", 400
            
            if not utils.verify_otp(mfa, user.mfaSecret):
                return utils.nachoneko(), 400
            
            if user.status != 1 and utils.verify_password_hash(user.hashPwd, password):
                session.delete(user)
                session.commit()
                return "OK", 200
            else: # avoid deleting banned users, etc.
                return utils.nachoneko(), 405
        except Exception as e:
            if utils.is_debug_mode:
                return str(e), 400
            return utils.nachoneko(), 400
        
