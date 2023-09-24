from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.__init__ import Base

class Playlist(Base):
    __tablename__ = 'Playlist'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)
    ownerId: Mapped[str] = mapped_column(String(64), ForeignKey('User.id'), nullable=False)
    creationDate: Mapped[Date] = mapped_column(Date, nullable=False)
    title: Mapped[str] = mapped_column(String(45), nullable=False)
    description: Mapped[str] = mapped_column(String(45), nullable=True)

    relationship('PlaylistMusic', backref='Playlist')

    def __init__(self, ownerId, creationDate, title, description=None):
        self.ownerId = ownerId
        self.creationDate = creationDate
        self.title = title
        self.description = description
