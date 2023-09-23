from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from models.__init__ import Base

class PlaylistMusic(Base):
    __tablename__ = 'PlaylistMusic'

    idPlaylist: Mapped[int] = mapped_column(Integer, ForeignKey('Playlist.id'), primary_key=True)
    idMusic: Mapped[int] = mapped_column(Integer, ForeignKey('Music.id'), nullable=False)
