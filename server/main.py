# Create Flask app
from flask import Flask
app = Flask(__name__)

# Initialise Firestore
from firebase_admin import credentials, firestore
import firebase_admin

firebase_admin.initialize_app(credentials.Certificate("serviceAccountKey.json"))
nosql = firestore.client()

# Initialise MariaDB
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()
engine = create_engine(os.getenv("SQLALCHEMY_DATABASE_URI"), echo=True)

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

# Base endpoints
@app.route("/")
def default():
    return "ICT3103 Secured Software Development"

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
