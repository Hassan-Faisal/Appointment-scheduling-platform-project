from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.appointment import Appointment

router = APIRouter()

@router.get("/today")
def today(db: Session = Depends(get_db), user=Depends(require_role("doctor"))):
    return db.query(Appointment).filter(
        Appointment.doctor_id == user["sub"],
        Appointment.appointment_date == date.today()
    ).all()

@router.get("/upcoming")
def upcoming(db: Session = Depends(get_db), user=Depends(require_role("doctor"))):
    return db.query(Appointment).filter(
        Appointment.doctor_id == user["sub"],
        Appointment.appointment_date > date.today()
    ).all()
