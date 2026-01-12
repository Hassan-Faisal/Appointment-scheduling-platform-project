from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.appointment import Appointment
from app.models.ai_history import AIHistory

router = APIRouter()

@router.post("/complete/{appointment_id}")
def complete(appointment_id: str, db: Session = Depends(get_db), user=Depends(require_role("doctor"))):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    appt.status = "completed"

    ai = AIHistory(
        patient_id=appt.patient_id,
        doctor_id=appt.doctor_id,
        appointment_date=appt.appointment_date,
        appointment_time=appt.start_time,
        outcome="completed"
    )

    db.add(ai)
    db.commit()

    return {"message": "Marked as completed"}
