from flask import Blueprint, jsonify, request, make_response
from markupsafe import escape
from validation import clean_text, validate_desc, validate_email, validate_mfa, validate_name, validate_password

from .. import Session, User
import helpers

user_bp = Blueprint("user_bp", __name__)


# Retrieve all users (every normal user is an artist)
@user_bp.route("/", methods=["GET"])
def user_retrieve_all():
    with Session() as session:
        try:
            users = session.query(User).filter(User.roleId == 2).all()
            # Public user info
            result = [{
                "id": user.id,
                "name": user.name,
                "about": user.about,
            } for user in users]
            return jsonify(result), 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve all users with email and account status (for admin)
@user_bp.route("/full", methods=["GET"])
def user_retrieve_all_full():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status
            if user.roleId != 1: # only admin can query
                return helpers.nachoneko(), 403

            users = session.query(User).all()
            # Full user info
            result = [{
                "id": user.id,
                "name": user.name,
                "about": user.about,
                "email": user.email,
                "status": user.status,
                "admin": True if user.roleId == 1 else False,
            } for user in users]
            return jsonify(result), 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Retrieve user by id
@user_bp.route("/<int:id>", methods=["GET"])
def user_retrieve_by_id(id):
    with Session() as session:
        try:
            user = session.query(User).get(id)
            if user is None:
                return "Not found", 404
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
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Retrive top 3 users (artists)
@user_bp.route("/top3", methods=["GET"])
def user_retrieve_top3():
    with Session() as session:
        try:
            users = session.query(User).filter(User.roleId == 2).order_by(User.id.desc()).limit(3).all()
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
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Retrieve all users that matches (substring of) search by name
@user_bp.route("/search=<string:name>", methods=["GET"])
def user_search_by_name(name):
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status
            if user.roleId != 2: # only users can search
                return helpers.nachoneko(), 403
            name = clean_text(name)
            user_search_results = session.query(User).filter(User.name.ilike(f"{name}%"))
            if user_search_results:
                return jsonify([{
                    "id": user.id,
                    "name": user.name,
                    "about": user.about,
                } for user in user_search_results]), 200
            else:
                return 'Not found', 404
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Update user profile
@user_bp.route("/update", methods=["POST"])
def update():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status

            data = request.form
            name = data.get("name", None)
            about = data.get("about", None)
            old_password = data.get("password", None)
            new_password = data.get("newPassword", None)
            mfa = data.get("mfa", None)
            
            # Change name
            if name is not None and name != "":
                name = clean_text(name)
                name_valid, name_error = validate_name(name)
                if not name_valid:
                    return escape(name_error), 400
                user.name = name
            
            # Change about
            if about is not None and about != "":
                about = clean_text(about)
                about_valid, about_error = validate_desc(about)
                if not about_valid:
                    return escape(about_error), 400
                user.about = about
            
            # Change password
            if new_password is not None and new_password != "":
                if old_password is None or old_password == "":
                    return "Current password is required.", 400
                # Validate new password
                new_pwd_valid, new_pwd_error = validate_password(new_password)
                if not new_pwd_valid:
                    return escape(new_pwd_error), 400
                # Validate MFA
                mfa_valid, mfa_error = validate_mfa(mfa)
                if not mfa_valid:
                    return escape(mfa_error), 400
                
                # Verify MFA and old password are correct
                if not helpers.verify_otp(mfa, user.mfaSecret):
                    return helpers.nachoneko(), 401
                if not helpers.verify_password_hash(user.hashPwd, old_password):
                    return helpers.nachoneko(), 401
                
                # Update password
                user.hashPwd = helpers.hash_password(new_password)
            
            session.commit()
            return "ok!", 200
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Register a new user
@user_bp.route("/register", methods=["POST"])
def register():
    data = request.form
    name = data.get("name", None)
    email = data.get("email", None)
    password = data.get("password", None)
    
    # Validation
    name = clean_text(name)
    name_valid, name_error = validate_name(name)
    if not name_valid:
        return name_error, 400
    
    email_valid, email_error = validate_email(email)
    if not email_valid:
        return email_error, 400
    
    pwd_valid, pwd_error = validate_password(password)
    if not pwd_valid:
        return pwd_error, 400

    with Session() as session:
        try:
            user = session.Query(User).filter(User.email == email).first()
            if user is not None:
                return "Email is already taken.", 400
            
            # Fields are valid, proceed to generate user
            hashPwd = helpers.hash_password(password)
            newUser = User(name, email, hashPwd, status=2, roleId=2, mfaSecret=None, sessionId=None, sessionExpiry=None, about=None)

            session.add(newUser)
            session.commit()
            helpers.send_onboarding_email(name, email)
            return "Created", 201
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Verify email and setup MFA
@user_bp.route("/onboarding/<string:token>", methods=["GET"])
def onboarding(token):
    verifying_email = helpers.verify_onboarding_email(token)
    if verifying_email is None:
        return helpers.nachoneko(), 400

    with Session() as session:
        try:
            user = session.query(User).filter(User.email == verifying_email).first()
            if user.status != 2:
                return helpers.nachoneko(), 400
            user.status = 0
            user.mfaSecret = helpers.generate_otp_secret()
            session.commit()
            return helpers.generate_otp_qr_string(user.name, user.mfaSecret), 200
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Login with email, password and OTP
@user_bp.route("/login", methods=["POST"])
def login():
    with Session() as session:
        try:
            data = request.form
            email = data.get("email", None)
            password = data.get("password", None)
            mfa = data.get("mfa", None)
            
            email_valid, email_error = validate_email(email)
            if not email_valid:
                return email_error, 400

            pwd_valid, pwd_error = validate_password(password, check_complexity=False)
            if not pwd_valid:
                return pwd_error, 400
            
            mfa_valid, mfa_error = validate_mfa(mfa)
            if not mfa_valid:
                return mfa_error, 400
        
            user = session.query(User).filter(User.email==email).first()

            if user is None: # User does not exist
                return helpers.nachoneko(), 401
            elif user.status == 1: # Banned
                return helpers.nachoneko(), 403

            if not helpers.verify_otp(mfa, user.mfaSecret):
                return helpers.nachoneko(), 401

            if not helpers.verify_password_hash(user.hashPwd, password):
                return helpers.nachoneko(), 401

            # Generate session id and set cookie expiry
            sessionId = helpers.generate_session()
            cookie_expiry = helpers.set_cookie_expiry()

            # Store hashed session id and expiry in database
            user.sessionId = helpers.hash_session_id(sessionId)
            user.sessionExpiry = cookie_expiry
            session.commit()

            response = make_response("ok!")
            response.status = 200
            response.set_cookie("SESSIONID",
                                value=sessionId,
                                max_age=None,
                                expires=cookie_expiry,
                                secure=True,
                                httponly=True,
                                samesite=None,
                                domain="nisokkususu.com")

            return response

        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Check if user is authenticated
@user_bp.route("/authenticated", methods=["GET"])
def authenticated():
    with Session() as session:
        user, status = helpers.check_authenticated(session, request)

        if user is None:
            if helpers.is_debug_mode:
                return "Invalid session cookie.", status
            else:
                return helpers.nachoneko(), status
            
        data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "about": "" if user.about is None else user.about,
        }

        if user.roleId == 1:
            data["admin"] = True

        return jsonify(data), 200


# Request password reset email
@user_bp.route("/reset", methods=["POST"])
def request_reset_password():
    with Session() as session:
        try:
            data = request.form
            email = data.get("email", None)

            email_valid, email_error = validate_email(email)
            if not email_valid:
                return email_error, 400

            user = session.query(User).filter(User.email == email).first()

            if user is None:
                return "ok!", 200 # Don't tell user that email is not found
            
            helpers.send_resetting_email(user.name, email)
            return "ok!", 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Reset password and MFA
@user_bp.route("/reset/<string:token>", methods=["POST"])
def reset_password(token):
    with Session() as session:
        try:
            verify_reset_email = helpers.verify_resetting_email(token)
            if verify_reset_email is None:
                return helpers.nachoneko(), 400
            
            # Check if user exists and is active (status == 0)
            user = session.query(User).filter(User.email == verify_reset_email).first()
            if user is None or user.status != 0:
                return helpers.nachoneko(), 400

            data = request.form
            password = data.get("newPassword", None)

            if password is None:
                return "Password is required.", 400

            user.hashPwd = helpers.hash_password(password)
            
            # Reset MFA
            user.mfaSecret = helpers.generate_otp_secret()

            session.commit()
            return helpers.generate_otp_qr_string(user.name, user.mfaSecret), 200
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Log out from application
@user_bp.route("/logout", methods=["GET"])
def logout():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                return helpers.nachoneko(), status

            user.sessionId = None
            user.sessionExpiry = None
            session.commit()

            response = make_response("ok")
            response.set_cookie("SESSIONID", value="", expires=0, httponly=True, secure=True)

            return response
        except Exception as e:
            session.rollback()
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500


# Allow admin to ban an account
@user_bp.route("/<int:id>/ban", methods=["PUT"])
def user_ban_by_id(id):
    with Session() as session:
        try:
            user = session.get(User, id)
            if user is None:
                return helpers.nachoneko(), 400
            user.status = 1
            session.commit()
            return "OK", 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Allow admin to unban an account
@user_bp.route("/<int:id>/unban", methods=["PUT"])
def user_unban_by_id(id):
    with Session() as session:
        try:
            user = session.get(User, id)
            if user is None:
                return helpers.nachoneko(), 400
            # If a user do not have mfa secret, they are not verified yet
            if user.mfaSecret is None:
                user.status = 2 # Unverified
            else:
                user.status = 0 # Active
            session.commit()
            return "OK", 200
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500

# Allow user to delete their own account
@user_bp.route('/delete', methods=["DELETE"])
def user_delete():
    with Session() as session:
        try:
            user, status = helpers.check_authenticated(session, request)
            if user is None:
                if helpers.is_debug_mode:
                    return 'Invalid session cookie.', status
                return helpers.nachoneko(), 400
            
            data = request.form
            password = data.get("password", None)
            confirmPwd = data.get("cfmPassword", None)
            mfa = data.get("mfa", None)

            if password is None or confirmPwd is None or mfa is None:
                return "Require all details.", 400
            
            if password != confirmPwd:
                return "Password don't match.", 400
            
            if not helpers.verify_otp(mfa, user.mfaSecret):
                return helpers.nachoneko(), 400
            
            if user.status != 1 and helpers.verify_password_hash(user.hashPwd, password):
                session.delete(user)
                session.commit()
                return "OK", 200
            else: # avoid deleting banned users, etc.
                return helpers.nachoneko(), 405
        except Exception as e:
            if helpers.is_debug_mode:
                return str(e), 500
            return helpers.nachoneko(), 500
        
