from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.appointment import Appointment

router = APIRouter()

@router.get("/appointments")
def my_appointments(user=Depends(require_role("doctor")), db: Session = Depends(get_db)):
    return db.query(Appointment).filter(Appointment.doctor_id == user["sub"]).all()
