from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.__init__ import Base

class Music(Base):
    __tablename__ = 'Music'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)
    title: Mapped[str] = mapped_column(String(45), nullable=False)
    filename: Mapped[str] = mapped_column(String(45), nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    genreId: Mapped[int] = mapped_column(Integer, ForeignKey('Genre.id'), nullable=False)

    relationship('AlbumMusic', backref='Music')
    relationship('PlaylistMusic', backref='Music')

    def __init__(self, title, filename, duration, genreId):
        self.title = title
        self.filename = filename
        self.duration = duration
        self.genreId = genreId
