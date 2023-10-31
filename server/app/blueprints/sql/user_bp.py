from flask import Blueprint, jsonify, request, make_response
from markupsafe import escape
from validation import clean_alphanum, clean_email, clean_num_only, clean_text

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
            id = clean_num_only(str(id))
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
            users = session.query(User).filter(User.roleId != 1).limit(3).all()
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

            if len(name) > 64:
                return escape("Name is too long, must be <= 64 characters."), 400

            if not utils.is_email_valid(email):
                return "Email is invalid.", 400

            # if confirmPassword != password:
            #    return "Check that you entered both passwords correctly.", 400

            # Fields are valid, proceed to generate user
            hashPwd = utils.hash_password(password)
            newUser = User(
                name,
                email,
                hashPwd,
                status=2,
                roleId=2,
                mfaSecret=None,
                sessionId=None,
                sessionExpiry=None,
                about=None,
            )
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

            if email is None:
                return "Email is required.", 400
            elif not utils.is_email_valid(email):
                return "Email is invalid.", 400

            cleaned_email = clean_email(email)

            if mfa is None:
                return "MFA is required.", 400
            elif not mfa.isdigit() or len(mfa) != 6:
                return "MFA is incorrect.", 400

            if password is None:
                return "Password is required.", 400

            user = session.query(User).filter(User.email == cleaned_email).first()

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
            response.set_cookie(
                "SESSIONID",
                value=user.sessionId,
                max_age=None,
                expires=cookie_expiry,
                secure=False,
                httponly=True,
                samesite=None,
                domain="nisokkususu.com",
            )

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
                    "about": user.about,
                    "admin": user.roleId == 1,
                }
            ),
            200,
        )


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
            id = clean_num_only(str(id))
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
            id = clean_num_only(str(id))
            user = session.get(User, id)
            if user is None:
                return utils.nachoneko(), 400
            user.status = 0
            session.commit()
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

            print(password)
            print(confirmPwd)
            print(mfa)

            if password is None or confirmPwd is None or mfa is None:
                return "Require all details.", 400
            
            if password != confirmPwd:
                return "Password don't match.", 400
            
            if not utils.verify_otp(mfa, user.mfaSecret):
                return utils.nachoneko(), 400
            
            if user.status != 1 and utils.verify_password_hash(user.hashPwd, password):
                session.delete(user)
                session.commit()
            else: # avoid deleting banned users, etc.
                return utils.nachoneko(), 405
        except Exception as e:
            if utils.is_debug_mode:
                return str(e), 400
            return utils.nachoneko(), 400
        