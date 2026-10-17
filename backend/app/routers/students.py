from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from math import ceil

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/students", tags=["students"])


@router.get("", response_model=schemas.StudentListResponse)
def list_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    course: Optional[str] = Query(None),
    year: Optional[int] = Query(None, ge=1, le=10),
    sort_by: str = Query("date_registered"),
    sort_order: str = Query("desc"),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * page_size
    students, total = crud.get_students(
        db,
        skip=skip,
        limit=page_size,
        search=search,
        gender=gender,
        course=course,
        year=year,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    total_pages = ceil(total / page_size) if total > 0 else 1
    return schemas.StudentListResponse(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        items=students,
    )


@router.get("/courses", response_model=list[str])
def list_courses(db: Session = Depends(get_db)):
    return crud.get_distinct_courses(db)


@router.get("/{student_id}", response_model=schemas.StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = crud.get_student(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )
    return student


@router.post("", response_model=schemas.StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    existing = crud.get_student_by_email(db, student.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this email already exists",
        )
    return crud.create_student(db, student)


@router.put("/{student_id}", response_model=schemas.StudentOut)
def update_student(
    student_id: int,
    student_update: schemas.StudentUpdate,
    db: Session = Depends(get_db),
):
    if student_update.email:
        existing = crud.get_student_by_email(db, student_update.email)
        if existing and existing.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A student with this email already exists",
            )
    updated = crud.update_student(db, student_id, student_update)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )
    return updated


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    success = crud.delete_student(db, student_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )
    return None
