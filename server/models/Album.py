from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.__init__ import Base

class Album(Base):
    __tablename__ = 'Album'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)
    title: Mapped[str] = mapped_column(String(45), nullable=False)
    imageUrl: Mapped[str] = mapped_column(String(45), nullable=True)
    releaseDate: Mapped[Date] = mapped_column(Date, nullable=False)
    ownerId: Mapped[str] = mapped_column(String(45), ForeignKey('User.id'), nullable=False)
    description: Mapped[str] = mapped_column(String(45), nullable=True)

    relationship('AlbumMusic', backref='Album')

    def __init__(self, title, releaseDate, ownerId, imageUrl=None, description=None):
        self.title = title
        self.imageUrl = imageUrl
        self.releaseDate = releaseDate
        self.ownerId = ownerId
        self.description = description
