# Initialise Firestore
from firebase_admin import credentials, firestore, initialize_app

class Firestore:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Firestore, cls).__new__(cls)
            cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
            initialize_app(cred)
        return firestore.client()

# Initialise MariaDB
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
engine = create_engine(os.getenv("SQLALCHEMY_DATABASE_URI"), echo=True)
Session = sessionmaker(bind=engine)

# Generate SQL schema
from models.__init__ import Base
from models.Album import Album
from models.AlbumMusic import AlbumMusic
from models.Genre import Genre
from models.Music import Music
from models.Playlist import Playlist
from models.PlaylistMusic import PlaylistMusic
from models.Role import Role
from models.User import User

Base.metadata.create_all(engine)

with Session() as session:
    # Seed role
    if session.query(Role).count() == 0:
        role_data = [
            {"role": "Admin"},
            {"role": "User"}
        ]

        for role in role_data:
            role_obj = Role(**role)
            session.add(role_obj)
            session.commit()

    # Seed user
    if session.query(User).count() == 0:
        user_data = [
            {"name": "Wang Tingwei", "email": "admin@example.com", "hashPwd": "admin", "banStatus": 0, "roleId": 1},
            {"name": "Prata Master", "email": "user@example.com", "hashPwd": "user", "banStatus": 0, "roleId": 2}    
        ]

        for user in user_data:
            user_obj = User(**user)
            session.add(user_obj)
            session.commit()

    # Seed genre
    if session.query(Genre).count() == 0:
        genre_data = [
            {"name": "Rock"},
            {"name": "Pop"},
            {"name": "Hip-Hop"}
        ]

        for genre in genre_data:
            genre_obj = Genre(**genre)
            session.add(genre_obj)
            session.commit()

    # Seed album
    if session.query(Album).count() == 0:
        from datetime import date
        album_data =  {"title": "The Power of Yo!", "releaseDate": date(2023, 1, 1), "ownerId": 2}
        album_obj = Album(**album_data)
        session.add(album_obj)
        session.commit()

    # Seed music
    if session.query(Music).count() == 0:
        music_data = {"title": "yo!", "filename": "yo!.mp3", "duration": 6, "genreId": 2, "ownerId": 2}
        music_obj = Music(**music_data)
        session.add(music_obj)
        session.commit()

    # Seed playlist
    if session.query(Playlist).count() == 0:
        from datetime import date
        playlist_data = {"ownerId": 2, "creationDate": date(2023, 3, 1), "title": "Clown", "description": "Ni Hao"}
        playlist_obj = Playlist(**playlist_data)
        session.add(playlist_obj)
        session.commit()

    # Seed album music
    if session.query(AlbumMusic).count() == 0:
        album_music_data = {"idAlbum": 1, "idMusic": 1}
        album_music_obj = AlbumMusic(**album_music_data)
        session.add(album_music_obj)
        session.commit()

    # Seed playlist music
    if session.query(PlaylistMusic).count() == 0:
        playlist_music_data = {"idPlaylist": 1, "idMusic": 1}
        playlist_music_obj = PlaylistMusic(**playlist_music_data)
        session.add(playlist_music_obj)
        session.commit()
