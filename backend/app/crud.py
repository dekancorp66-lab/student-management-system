from sqlalchemy.orm import Session
from sqlalchemy import or_, func, desc, asc
from typing import Optional, Tuple, List
from . import models, schemas
from datetime import date


def get_student(db: Session, student_id: int) -> Optional[models.Student]:
    return db.query(models.Student).filter(models.Student.id == student_id).first()


def get_student_by_email(db: Session, email: str) -> Optional[models.Student]:
    return db.query(models.Student).filter(models.Student.email == email.lower()).first()


def get_students(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None,
    gender: Optional[str] = None,
    course: Optional[str] = None,
    year: Optional[int] = None,
    sort_by: str = "date_registered",
    sort_order: str = "desc",
) -> Tuple[List[models.Student], int]:
    query = db.query(models.Student)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                models.Student.full_name.ilike(search_term),
                models.Student.email.ilike(search_term),
                models.Student.phone.ilike(search_term),
                models.Student.course.ilike(search_term),
                models.Student.address.ilike(search_term),
            )
        )

    if gender:
        query = query.filter(models.Student.gender == gender)

    if course:
        query = query.filter(models.Student.course.ilike(f"%{course.strip()}%"))

    if year is not None:
        query = query.filter(models.Student.year_of_study == year)

    total = query.count()

    allowed_sort = {
        "id": models.Student.id,
        "full_name": models.Student.full_name,
        "gender": models.Student.gender,
        "date_of_birth": models.Student.date_of_birth,
        "email": models.Student.email,
        "course": models.Student.course,
        "year_of_study": models.Student.year_of_study,
        "date_registered": models.Student.date_registered,
    }
    sort_column = allowed_sort.get(sort_by, models.Student.date_registered)
    order_func = desc if sort_order.lower() == "desc" else asc
    query = query.order_by(order_func(sort_column))

    students = query.offset(skip).limit(limit).all()
    return students, total


def create_student(db: Session, student: schemas.StudentCreate) -> models.Student:
    db_student = models.Student(
        full_name=student.full_name,
        gender=student.gender,
        date_of_birth=student.date_of_birth,
        email=student.email.lower(),
        phone=student.phone,
        course=student.course,
        year_of_study=student.year_of_study,
        address=student.address,
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


def update_student(
    db: Session, student_id: int, student_update: schemas.StudentUpdate
) -> Optional[models.Student]:
    db_student = get_student(db, student_id)
    if not db_student:
        return None

    update_data = student_update.model_dump(exclude_unset=True)
    if "email" in update_data and update_data["email"]:
        update_data["email"] = update_data["email"].lower()

    for field, value in update_data.items():
        setattr(db_student, field, value)

    db.commit()
    db.refresh(db_student)
    return db_student


def delete_student(db: Session, student_id: int) -> bool:
    db_student = get_student(db, student_id)
    if not db_student:
        return False
    db.delete(db_student)
    db.commit()
    return True


def get_dashboard_stats(db: Session) -> schemas.DashboardStats:
    total = db.query(func.count(models.Student.id)).scalar() or 0
    male = (
        db.query(func.count(models.Student.id))
        .filter(models.Student.gender == models.GenderEnum.male)
        .scalar()
        or 0
    )
    female = (
        db.query(func.count(models.Student.id))
        .filter(models.Student.gender == models.GenderEnum.female)
        .scalar()
        or 0
    )
    other = (
        db.query(func.count(models.Student.id))
        .filter(models.Student.gender == models.GenderEnum.other)
        .scalar()
        or 0
    )
    recent = (
        db.query(models.Student)
        .order_by(desc(models.Student.date_registered))
        .limit(5)
        .all()
    )
    return schemas.DashboardStats(
        total_students=total,
        male_count=male,
        female_count=female,
        other_count=other,
        recent_students=recent,
    )


def get_distinct_courses(db: Session) -> List[str]:
    results = (
        db.query(models.Student.course)
        .distinct()
        .order_by(models.Student.course)
        .all()
    )
    return [r[0] for r in results if r[0]]
