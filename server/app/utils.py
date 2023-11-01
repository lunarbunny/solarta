from argon2 import PasswordHasher
import os
import re
import sendgrid
import pyotp
import time
from models.User import User
from sendgrid.helpers.mail import *
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv

load_dotenv()

is_debug_mode = True
argon_hasher = PasswordHasher()
sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
serializer = URLSafeTimedSerializer(secret_key=os.getenv("URL_SIGN_SECRET"))
import eyed3
import sys


def music_get_save_dir():
    dir = os.environ.get("MUSIC_ASSET_DIR")
    if dir is None:
        print("MUSIC_ASSET_DIR not set", file=sys.stderr)
        sys.exit(1)
    elif not os.path.isdir(dir):
        os.makedirs(dir, exist_ok=True)
        print(f"{dir} is not a directory", file=sys.stderr)
        sys.exit(1)
    return dir

def music_get_metadata(path):
    file = eyed3.load(path)
    if file is not None:
        return file.info.time_secs, file.info.size_bytes
    return None

def music_get_max_size():
    # 10 MB
    return 10 * 1024 * 1024


def hash_password(password):
    return argon_hasher.hash(password)


def check_needs_rehash(hash):
    return argon_hasher.check_needs_rehash(hash)


def verify_password_hash(hash, password):
    try:
        return argon_hasher.verify(hash, password)
    except:
        return False


def generate_onboarding_token(email):
    return serializer.dumps(email, salt=os.getenv("ONBOARDING_SALT"))


def send_onboarding_email(username, email):
    confirmation_link = (
        f"https://solarta.nisokkususu.com/onboarding/{generate_onboarding_token(email)}"
    )
    message = Mail(
        from_email="solarta@nisokkususu.com",
        to_emails=email,
        subject="[Solarta] Verify your email address",
        html_content=f"""
        <h3>Welcome to Solarta, {username}!</h3>
        <p>Use <a href={confirmation_link}>this link</a> to activate your account</p>
        <p>If that doesn't work, open the following link in your browser</p>
        <code>{confirmation_link}</code>
    """,
    )
    try:
        response = sg.send(message)
    except Exception as e:
        print(e.message)
    return response


def generate_resetting_token(email):
    return serializer.dumps(email, salt=os.getenv("RESETTING_SALT"))

def send_resetting_email(username, email):
    reset_link = (
        f"https://solarta.nisokkususu.com/reset/{generate_resetting_token(email)}"
    )
    message = Mail(
        from_email="solarta@nisokkususu.com",
        to_emails=email,
        subject="[Solarta] Reset your password",
        html_content=f"""
        <h3>Hello, {username}!</h3>
        <p>Use <a href={reset_link}>this link</a> to reset your password</p>
        <p>If that doesn't work, open the following link in your browser</p>
        <code>{reset_link}</code>
    """,
    )
    try:
        response = sg.send(message)
    except Exception as e:
        print(e.message)
    return response


def verify_resetting_email(token, expiration=15 * 60) -> str:
    verifying_email = ""
    try:
        verifying_email = serializer.loads(
            token, salt=os.environ.get("RESETTING_SALT"), max_age=expiration
        )
    except Exception as e:
        print(e.message)
        return verifying_email
    return verifying_email


def verify_onboarding_email(token, expiration=2 * 60 * 60) -> str:
    verifying_email = ""
    try:
        verifying_email = serializer.loads(
            token, salt=os.environ.get("ONBOARDING_SALT"), max_age=expiration
        )
    except Exception as e:
        print(e.message)
        return verifying_email
    return verifying_email


def generate_otp_secret() -> str:
    return pyotp.random_base32()


def generate_otp_qr_string(
    username: str, secret: str
) -> str:  # for frontend to generate QR code
    return pyotp.totp.TOTP(secret).provisioning_uri(
        name=username, issuer_name="Solarta"
    )


def verify_otp(token, secret) -> bool:
    return pyotp.totp.TOTP(secret).verify(token, valid_window=1)


def generate_session() -> str:
    return os.urandom(43).hex()


def set_cookie_expiry() -> int:
    return int(time.time()) + 60 * 60 * 24

# Check if user is authenticated, return (User | None, http status code)
def check_authenticated(db, request) -> tuple[User | None, int]:
    session_id = request.cookies.get("SESSIONID")
    if session_id is None:
        return None, 401

    user = db.query(User).filter(User.sessionId == session_id).first()

    if user is None:
        return None, 401
    if user.sessionExpiry < int(time.time()):
        user.sessionId = None
        user.sessionExpiry = None
        db.commit()
        return None, 401
    return user, 200

def nachoneko() -> str:
    return "<br>".join(
        [
            '<div style="font-family: monospace;white-space: pre-wrap;">',
            "nachonekodayo                                                       nachonekodayo",
            "a               ##**%#                                                          y",
            "c              %%(((( %%%%                                                      a",
            "h              %#((((((,%%%%%,                #%/                               d",
            "o             %%(((((((( %%%%%%%%%%%%%%%%%%%%%%%(,                              o",
            "n             %%(((((((((.%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*.                       k",
            "e            .%#((((((/.%%%%%%%%@@@@@%%%%%%%%%%%%%%%%%%%%%#     .,****,.        e",
            "k            *%#((((*(%%%%%%%%%%%%%%%%%%@@@@%%%%%%%%%%%%%%%%%@&@@%@@%%%%%%%%%%% n",
            "o            *%%#((#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%@@@&@@%%# *((((#% o",
            "d            .%%#(%%%%%%%%,%%%%%%%%*.%%%%%%%%%%%%%%%%%%%%.%%%%%%%# ,(((((((((%  h",
            "a            .%%%%%%%%%%,%%%%%%%% (.%%%%%%%%%%%%/%%%,%%%%%/%%%%%%(/(((((((((%(  c",
            "y            *%%%%%%%%##%%%%%%% &@.%%%%%%%%%%%%.%%%, %%%%%#%%%%%%%%(((((((#%%   a",
            "o           .%%%%%#%%/%%%%%**.%@@.%%%%%%%%%%,%/%%%#@ %%%%%% %%%%%%%*(((((%%%    n",
            "            %%%%%/%%,%%%%%%%(@@@@ %%%%%%%%#%%#%% @@@% %%%%%,%%%%%%%%*(((%%#      ",
            "            %%%%%/%%,%%%%%%%(@@@@ %%%%%%%%#%%#%% @@@% %%%%%,%%%%%%%%*(((%%#      ",
            "          .%%%%%#,@.&@@@@@ ., &@,%%%.%%%/%%#%%.@@@@@@@*/%%%(%%%%%%%%#%%%         ",
            "          %%%%%.&&(@@@@@@   .(@*,%%%.%%#%%/%(*@@( ,&@@@@.%#, ,.( ,%%%%.          ",
            "          %/ %%(@&#@@@@@@@@@@@%#%#%%,%,%%,%(@ &@@@@@%#%@@/%&,*,%* %%%%%          ",
            "         *%%%%  &@@# &@@@@@@@ @@@@@@@@@@@@@@.@@@@@(.*   @ &,.,(*&    %%          ",
            "         #%%*%&&&&&&@@@@@@@@@@@@@@@@@@@@@@@@,@@@@@@@@@@&,/%.,*  %%%#/.#          ",
            "o        %% &&&&&&&&&@@@@@@@@@@@@@@@@@@@@@@@@,*@@@@@@@.@@ %%%%%%%%%%%%/         n",
            "y        %% %&&&&&&%@@@@@/(((((((/,,%@@@@@@@@@@@@@@@@@@@@.%%%%%%%%%%%%          a",
            "a        #%%# @@@@@@@@@@&*#%%%%%%%%%%%%#( @@@@@@@&&%         ,(%%%%%%%          c",
            "d        *%%%% / @@@@@@@@@# #%%%%%%%%%%%% @@@@@@@&&&&&&&.%%%%%%/%%%%%    @@@@   h",
            "o         %%%% %%%%( @@@@@@@@@@@@@&#(* /& @@@@@@@@  *&&%#%%%%%%,%%%%*  @@@@@@.  o",
            "k        /%%%%*%%%%%%%%%%.*@@@@@@@@@@@@  @@@@@@@@@@@@&.   %%%%%%%%%(  &@@@@@@   n",
            "e        % %%%/%%%%%%%%%%* .,,,*,&@@*....,,..         *..%%.*.*%%%(   @@@@@@    e",
            "n       #%%*%%.%%%#%%%%..,,,,,(/@@@@@@@@, ,,,,,         %%%%,.%%%/    %%%%%#    k",
            "o       %%%%.%.%%% %%%%, ,,,,,, %#%.#%#%.,,,,,,,       ,%%%*,%%%%*    #%%%%%    o",
            "h      %%% %%%..%. #%%% ,,,,,,  ./*.%,,...  .,,        %%%,*%%%%%#    *%%%%%    d",
            "c     %*   (%%%%%   %% ,,,,,,, ,  / ,,, ,,,,,,,,      #%%.%%%%% %%    %%%%%%    a",
            "a           %%%%/   %(.,,,,,,,.,,,.,,,,.,,,,,,,,.   .%% %%%%%%%      %%%%%%*    y",
            "nachonekodayo                                                       nachonekodayo"
            "</div>",
        ]
    )
