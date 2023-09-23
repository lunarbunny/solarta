from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.__init__ import Base

class User(Base):
    __tablename__ = 'User'

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    roleId: Mapped[int] = mapped_column(Integer, ForeignKey('Role.id'), nullable=False)

    relationship('Album', backref='User')
    relationship('Playlist', backref='User')
