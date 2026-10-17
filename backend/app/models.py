from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, Text, func
from sqlalchemy.orm import validates
import enum
from .database import Base


class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False, index=True)
    gender = Column(Enum(GenderEnum), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(30), nullable=False)
    course = Column(String(120), nullable=False, index=True)
    year_of_study = Column(Integer, nullable=False)
    address = Column(Text, nullable=False)
    date_registered = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    @validates("email")
    def validate_email(self, key, email):
        if not email or "@" not in email:
            raise ValueError("Invalid email address")
        return email.lower().strip()

    def __repr__(self):
        return f"<Student(id={self.id}, name='{self.full_name}', email='{self.email}')>"
