from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.appointment import Appointment
from app.models.ai_history import AIHistory

router = APIRouter()

# @router.post("/cancel/{appointment_id}")
# def cancel_appointment(appointment_id: str, db: Session = Depends(get_db), user=Depends(require_role("patient"))):
#     appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
#     appt.status = "cancelled"

#     ai = AIHistory(
#         patient_id=appt.patient_id,
#         doctor_id=appt.doctor_id,
#         appointment_date=appt.appointment_date,
#         appointment_time=appt.start_time,
#         outcome="cancelled"
#     )

#     db.add(ai)
#     db.commit()

#     return {"message": "Appointment cancelled"}
