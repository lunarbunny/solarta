from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.__init__ import Base

class Role(Base):
    __tablename__ = 'Role'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    role: Mapped[str] = mapped_column(String(45), nullable=False)

    relationship('User', backref='Role')
