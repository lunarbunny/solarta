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
        role_data = [{"role": "Admin"}, {"role": "User"}]

        for role in role_data:
            role_obj = Role(**role)
            session.add(role_obj)
            session.commit()

    # Seed user
    if session.query(User).count() == 0:
        user_data = [
            {
                "name": "Admin1",
                "email": "admin1@example.com",
                "hashPwd": "admin1",
                "status": 0,
                "roleId": 1,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "I am the admin",
            },
            {
                "name": "Admin2",
                "email": "admin2@example.com",
                "hashPwd": "admin2",
                "status": 0,
                "roleId": 1,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "I am the admin",
            },
            {
                "name": "Pixabay",
                "email": "user1@example.com",
                "hashPwd": "user1",
                "status": 0,
                "roleId": 2,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "Hi, I am Pixabay!",
            },
            {
                "name": "Jazz Collective",
                "email": "user2@example.com",
                "hashPwd": "user2",
                "status": 0,
                "roleId": 2,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "Hi, I am Jazz Collective!",
            },
            {
                "name": "Old School Cool",
                "email": "user3@example.com",
                "hashPwd": "user3",
                "status": 0,
                "roleId": 2,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "Hi, I am Old School Cool!",
            },
            {
                "name": "Neon Nights",
                "email": "user4@example.com",
                "hashPwd": "user4",
                "status": 0,
                "roleId": 2,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "Hi, I am Neon Nights!",
            },
            {
                "name": "Velvet",
                "email": "user5@example.com",
                "hashPwd": "user5",
                "status": 0,
                "roleId": 2,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "Hi, I am Velvet!",
            },
            {
                "name": "Angry Octopus",
                "email": "user6@example.com",
                "hashPwd": "user6",
                "status": 0,
                "roleId": 2,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "Hi, I am Angry Octopus!",
            },
            {
                "name": "Midnight Muses",
                "email": "user7@example.com",
                "hashPwd": "user7",
                "status": 0,
                "roleId": 2,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "Hi, I am Midnight Muses!",
            },
            {
                "name": "Velocity",
                "email": "user8@example.com",
                "hashPwd": "user8",
                "status": 0,
                "roleId": 2,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "Hi, I am Velocity!",
            },
            {
                "name": "Nightcore",
                "email": "user9@example.com",
                "hashPwd": "user9",
                "status": 0,
                "roleId": 2,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "Hi, I am Nightcore!",
            },
            {
                "name": "Take 3",
                "email": "user10@example.com",
                "hashPwd": "user10",
                "status": 0,
                "roleId": 2,
                "mfaSecret": None,
                "sessionId": None,
                "sessionExpiry": None,
                "about": "Hi, I am Take 3!",
            },
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
            {"name": "Hip-Hop"},
            {"name": "Jazz"},
            {"name": "Country"},
            {"name": "EDM"},
            {"name": "R&B"},
            {"name": "Classical"},
            {"name": "Indie"},
            {"name": "Reggae"},
        ]

        for genre in genre_data:
            genre_obj = Genre(**genre)
            session.add(genre_obj)
            session.commit()

    # Seed album
    if session.query(Album).count() == 0:
        from datetime import date

        album_data = [
            {"title": "Best Of 2023", "releaseDate": date(2023, 1, 1), "ownerId": 3},
            {"title": "Rock Solid", "releaseDate": date(2023, 2, 2), "ownerId": 3},
            {"title": "Calm Dreams", "releaseDate": date(2023, 2, 2), "ownerId": 3},
            {"title": "Infinite Sea", "releaseDate": date(2023, 2, 2), "ownerId": 3},
            {
                "title": "The Power of Yo!",
                "releaseDate": date(2023, 2, 2),
                "ownerId": 4,
            },
            {"title": "Mental State 0", "releaseDate": date(2023, 2, 2), "ownerId": 4},
            {"title": "Me And You Under The Wisdom Tree", "releaseDate": date(2023, 2, 2), "ownerId": 4},
            {"title": "Together, We Eat Apples", "releaseDate": date(2023, 2, 2), "ownerId": 5},
            {"title": "Together, We Meow Meow Meow", "releaseDate": date(2023, 2, 2), "ownerId": 5},
            {"title": "Emei Mountain's Hei Du She", "releaseDate": date(2023, 2, 2), "ownerId": 6},
        ]

        for album in album_data:
            album_obj = Album(**album)
            session.add(album_obj)
            session.commit()

    # Seed music
    if session.query(Music).count() == 0:
        music_data = [
            {
                "title": "yo!",
                "filename": "yo!.mp3",
                "duration": 6,
                "genreId": 2,
                "ownerId": 3,
            },
            {
                "title": "Titanium by Alisha_Studio",
                "filename": "titanium-170190.mp3",
                "duration": 106,
                "genreId": 2,
                "ownerId": 3,
            },
            {
                "title": "Science Documentary by Lexin_Music",
                "filename": "science-documentary-169621.mp3",
                "duration": 127,
                "genreId": 2,
                "ownerId": 3,
            },
            {
                "title": "Baby Mandala by prazkhanal",
                "filename": "baby-mandala-169039.mp3",
                "duration": 191,
                "genreId": 2,
                "ownerId": 3,
            },
            {
                "title": "Once In Paris by Pumpupthemind",
                "filename": "once-in-paris-168895.mp3",
                "duration": 132,
                "genreId": 2,
                "ownerId": 3,
            },
            {
                "title": "Glossy by Coma-Media",
                "filename": "glossy-168156.mp3",
                "duration": 93,
                "genreId": 2,
                "ownerId": 3,
            },
            {
                "title": "Abstract Future Bass by QubeSounds",
                "filename": "abstract-future-bass-162604.mp3",
                "duration": 91,
                "genreId": 2,
                "ownerId": 4,
            },
            {
                "title": "A Long Way by SergePavkinMusic",
                "filename": "a-long-way-166385.mp3",
                "duration": 273,
                "genreId": 2,
                "ownerId": 4,
            },
            {
                "title": "Good Night by FASSounds",
                "filename": "good-night-160166.mp3",
                "duration": 147,
                "genreId": 2,
                "ownerId": 4,
            },
            {
                "title": "Inside You by lemonmusicstudio",
                "filename": "inside-you-162760.mp3",
                "duration": 129,
                "genreId": 2,
                "ownerId": 4,
            },
        ]

        for music in music_data:
            music_obj = Music(**music)
            session.add(music_obj)
            session.commit()

    # Seed playlist
    if session.query(Playlist).count() == 0:
        from datetime import date

        playlist_data = {
            "ownerId": 2,
            "creationDate": date(2023, 3, 1),
            "title": "Clown",
            "description": "Ni Hao",
        }
        playlist_obj = Playlist(**playlist_data)
        session.add(playlist_obj)
        session.commit()

    # Seed album music
    if session.query(AlbumMusic).count() == 0:
        album_music_data = [
            {"idAlbum": 1, "idMusic": 1},
            {"idAlbum": 1, "idMusic": 2},
            {"idAlbum": 1, "idMusic": 3},
            {"idAlbum": 1, "idMusic": 4},
            {"idAlbum": 1, "idMusic": 5},
            {"idAlbum": 2, "idMusic": 6},
            {"idAlbum": 2, "idMusic": 7},
            {"idAlbum": 2, "idMusic": 8},
            {"idAlbum": 2, "idMusic": 9},
            {"idAlbum": 2, "idMusic": 10},
        ]

        for album_music in album_music_data:
            album_music_obj = AlbumMusic(**album_music)
            session.add(album_music_obj)
            session.commit()

    # Seed playlist music
    if session.query(PlaylistMusic).count() == 0:
        playlist_music_data = {"idPlaylist": 1, "idMusic": 1}
        playlist_music_obj = PlaylistMusic(**playlist_music_data)
        session.add(playlist_music_obj)
        session.commit()
