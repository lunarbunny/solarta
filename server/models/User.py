from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.__init__ import Base

class User(Base):
    __tablename__ = 'User'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashPwd: Mapped[str] = mapped_column(String(128), nullable=False)
    banStatus: Mapped[bool] = mapped_column(Boolean, nullable=False)
    roleId: Mapped[int] = mapped_column(Integer, ForeignKey('Role.id'), nullable=False)

    relationship('Album', backref='User')
    relationship('Playlist', backref='User')

    def __init__(self, id, name, email, hashPwd, banStatus, roleId):
        self.id = id
        self.name = name
        self.email = email
        self.hashPwd = hashPwd
        self.banStatus = banStatus
        self.roleId = roleId
