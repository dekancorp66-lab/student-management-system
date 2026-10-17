from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from datetime import date, datetime
from typing import Optional, List
from enum import Enum


class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class StudentBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150, examples=["Jane Doe"])
    gender: GenderEnum
    date_of_birth: date
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=30, examples=["+1234567890"])
    course: str = Field(..., min_length=2, max_length=120, examples=["Computer Science"])
    year_of_study: int = Field(..., ge=1, le=10, examples=[1])
    address: str = Field(..., min_length=5, max_length=500)

    @field_validator("full_name", "course", "address", "phone")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, v: date) -> date:
        today = date.today()
        if v > today:
            raise ValueError("Date of birth cannot be in the future")
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 10 or age > 100:
            raise ValueError("Student age must be between 10 and 100 years")
        return v


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=150)
    gender: Optional[GenderEnum] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=7, max_length=30)
    course: Optional[str] = Field(None, min_length=2, max_length=120)
    year_of_study: Optional[int] = Field(None, ge=1, le=10)
    address: Optional[str] = Field(None, min_length=5, max_length=500)

    @field_validator("full_name", "course", "address", "phone")
    @classmethod
    def strip_whitespace(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v is not None else v

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, v: Optional[date]) -> Optional[date]:
        if v is None:
            return v
        today = date.today()
        if v > today:
            raise ValueError("Date of birth cannot be in the future")
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 10 or age > 100:
            raise ValueError("Student age must be between 10 and 100 years")
        return v


class StudentOut(StudentBase):
    id: int
    date_registered: datetime

    model_config = ConfigDict(from_attributes=True)


class StudentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    items: List[StudentOut]


class DashboardStats(BaseModel):
    total_students: int
    male_count: int
    female_count: int
    other_count: int
    recent_students: List[StudentOut]
