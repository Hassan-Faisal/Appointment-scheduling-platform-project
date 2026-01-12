from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.appointment import Appointment

router = APIRouter()

@router.post("/book")
def book_appointment(
    doctor_id: str,
    appointment_date: date,
    start_time: str,
    end_time: str,
    db: Session = Depends(get_db),
    user=Depends(require_role("patient"))
):
    appointment = Appointment(
        patient_id=user["sub"],
        doctor_id=doctor_id,
        appointment_date=appointment_date,
        start_time=start_time,
        end_time=end_time,
        status="booked"
    )

    db.add(appointment)
    db.commit()
    return {"message": "Appointment booked"}
