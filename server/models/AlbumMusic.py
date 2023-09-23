from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from models.__init__ import Base

class AlbumMusic(Base):
    __tablename__ = 'AlbumMusic'

    idAlbum: Mapped[int] = mapped_column(Integer, ForeignKey('Album.id'), primary_key=True, nullable=False)
    idMusic: Mapped[int] = mapped_column(Integer, ForeignKey('Music.id'), primary_key=True, nullable=False)
