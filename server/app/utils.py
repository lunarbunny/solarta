from argon2 import PasswordHasher
import os
import re
import hashlib
import sendgrid
from sendgrid.helpers.mail import *
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv
load_dotenv()

is_debug_mode = True
email_regex = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")
argon_hasher = PasswordHasher()
sg = sendgrid.SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))
serializer = URLSafeTimedSerializer(secret_key=os.getenv('URL_SIGN_SECRET'))

def music_get_path(music_filename):
    return os.path.join("assets/music", music_filename)

def music_save(music_file):
    music_file.save(music_get_path(music_file.filename))

def music_get_duration(music_filename):
    import eyed3
    file = eyed3.load(music_get_path(music_filename))
    if file is not None:
        duration = file.info.time_secs
        return duration

def is_email_valid(email):
    return re.match(email_regex, email)

def hash_password(password):
    return argon_hasher.hash(password)

def check_needs_rehash(hash):
    return argon_hasher.check_needs_rehash(hash)

def verify_password_hash(hash, password):
    return argon_hasher.verify(hash, password)

def generate_onboarding_token(email):
    return serializer.dumps(email, salt=os.getenv('ONBOARDING_SALT'))

def send_onboarding_email(username, email):
    confirmation_link = f"https://solarta.nisokkususu.com/api/user/onboarding/{generate_onboarding_token(email)}"
    message = Mail(
    from_email='solarta@nisokkususu.com',
    to_emails=email,
    subject='[Solarta] Verify your email address',
    html_content=f"""
        <h3>Welcome to Solarta, {username}!</h3>
        <p>Use <a href={confirmation_link}>this link</a> to activate your account</p>
        <p>If that doesn't work, open the following link in your browser</p>
        <code>{confirmation_link}</code>
    """)
    try:
        response = sg.send(message)
    except Exception as e:
        print(e.message)
    return response

def verify_onboarding_email(token, expiration=300):
    verifying_email = None
    try:
        verifying_email = serializer.loads(
            token,
            salt=os.environ.get('ONBOARDING_SALT'),
            max_age=expiration
        )
    except Exception as e:
        print(e.message)
        return verifying_email
    return verifying_email
