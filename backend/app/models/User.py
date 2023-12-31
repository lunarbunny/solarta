from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.__init__ import Base

class User(Base):
    __tablename__ = 'User'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashPwd: Mapped[str] = mapped_column(String(128), nullable=False)
    status: Mapped[bool] = mapped_column(Integer, nullable=False)
    roleId: Mapped[int] = mapped_column(Integer, ForeignKey('Role.id'), nullable=False)
    mfaSecret: Mapped[str] = mapped_column(String(255), nullable=True)
    sessionId: Mapped[str] = mapped_column(String(86), nullable=True)
    sessionExpiry: Mapped[int] = mapped_column(Integer, nullable=True)
    about: Mapped[str] = mapped_column(String(255), nullable=True)
    lastLoginAttempt: Mapped[int] = mapped_column(Integer, nullable=True)
    loginAttempts: Mapped[int] = mapped_column(Integer, nullable=False)
    lastResetAttempt: Mapped[int] = mapped_column(Integer, nullable=True)
    resetAttempts: Mapped[int] = mapped_column(Integer, nullable=False)

    albums = relationship('Album', backref='User')
    musics = relationship('Music', backref='User')
    playlists = relationship('Playlist', backref='User')

    def __init__(self, name, email, hashPwd, status, roleId, mfaSecret, sessionId, sessionExpiry, about, lastLoginAttempt=None, loginAttempts=0, lastResetAttempt=None, resetAttempts=0):
        self.name = name
        self.email = email
        self.hashPwd = hashPwd
        self.status = status
        self.roleId = roleId
        self.mfaSecret = mfaSecret
        self.sessionId = sessionId
        self.sessionExpiry = sessionExpiry
        self.about = about
        self.lastLoginAttempt = lastLoginAttempt
        self.loginAttempts = loginAttempts
        self.lastResetAttempt = lastResetAttempt
        self.resetAttempts = resetAttempts
