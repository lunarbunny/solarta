from argon2 import PasswordHasher
import os
import re

email_regex = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")
argon_hasher = PasswordHasher()

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