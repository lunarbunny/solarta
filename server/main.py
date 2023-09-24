# Create Flask app
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Initialise Firestore
from firebase_admin import credentials, firestore
import firebase_admin

firebase_admin.initialize_app(credentials.Certificate("serviceAccountKey.json"))
nosql = firestore.client()

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

# MariaDB endpoints
@app.route("/api/role/delete/<int:id>", methods=["DELETE"])
def role_delete(id):
    with Session() as session:
        role = session.get(Role, id)
        if role:
            session.delete(role)
            session.commit()
            return '', 200
        else:
            session.rollback()
            return '', 400

@app.route("/api/role/create", methods=["POST"])
def role_create():
    with Session() as session:
        try:
            data = request.get_json()
            session.add(Role(data["role"]))
            session.commit()
            return '', 200
        except:
            session.rollback()
            return '', 400
            
@app.route("/api/role/<string:role>", methods=["GET"])
def role_retrieve_id(role):
    with Session() as session:
        role = session.query(Role).filter(Role.role==role).first()
        if role:
            return jsonify({"id": role.id}), 200
        else:
            session.rollback()
            return '', 404
        
@app.route("/api/role", methods=["GET"])
def role_retrieve_all():
    with Session() as session:
        roles = session.query(Role).all()
        return jsonify([{"role": role.role} for role in roles]), 200
        
# Firestore endpoints
@app.route("/api/music", methods=["GET"])
def music_retrieve_all():
    try:
        music_ref = nosql.collection("music")
        musics = music_ref.stream()
        return jsonify([music.to_dict() for music in musics]), 200
    except:
        return '', 404

# Base endpoints
@app.route("/")
def default():
    return "ICT3103 Secured Software Development"

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
