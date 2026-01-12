from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.appointment import Appointment

router = APIRouter()

@router.get("/my-upcoming")
def my_upcoming(db: Session = Depends(get_db), user=Depends(require_role("patient"))):
    return db.query(Appointment).filter(
        Appointment.patient_id == user["sub"],
        Appointment.appointment_date >= date.today()
    ).all()

@router.get("/my-history")
def my_history(db: Session = Depends(get_db), user=Depends(require_role("patient"))):
    return db.query(Appointment).filter(
        Appointment.patient_id == user["sub"],
        Appointment.appointment_date < date.today()
    ).all()
