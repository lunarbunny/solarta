from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.__init__ import Base

class Music(Base):
    __tablename__ = 'Music'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)
    title: Mapped[str] = mapped_column(String(64), nullable=False)
    filename: Mapped[str] = mapped_column(String(45), nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    genreId: Mapped[int] = mapped_column(Integer, ForeignKey('Genre.id'), nullable=False)
    ownerId: Mapped[int] = mapped_column(Integer, ForeignKey('User.id'), nullable=False)

    # If a music is deleted, it is disassociated from all albums and playlists
    albums = relationship('AlbumMusic', backref='Music', cascade='all, delete-orphan') # Disassociate Music from Album when deleted
    playlists = relationship('PlaylistMusic', backref='Music', cascade='all, delete-orphan') # Disassociate Music from Playlist when deleted

    def __init__(self, title, filename, duration, genreId, ownerId):
        self.title = title
        self.filename = filename
        self.duration = duration
        self.genreId = genreId
        self.ownerId = ownerId
