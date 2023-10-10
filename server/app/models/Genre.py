from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.__init__ import Base

class Genre(Base):
    __tablename__ = 'Genre'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name: Mapped[str] = mapped_column(String(45), nullable=False)

    relationship('Music', backref='Genre')

    def __init__(self, name):
        self.name = name
