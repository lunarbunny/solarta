# Initialise Firestore
from firebase_admin import credentials, firestore
import firebase_admin

class Firestore:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Firestore, cls).__new__(cls)
            firebase_admin.initialize_app(credentials.Certificate("serviceAccountKey.json"))
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
