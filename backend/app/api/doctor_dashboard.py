from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.appointment import Appointment

router = APIRouter()

# @router.get("/today")
# def today(db: Session = Depends(get_db), user=Depends(require_role("doctor"))):
#     if not user.doctor_profile:
#         raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
#     return db.query(Appointment).filter(
#         Appointment.doctor_id == user.doctor_profile.id,
#         Appointment.appointment_date == date.today()
#     ).all()

# @router.get("/upcoming")
# def upcoming(db: Session = Depends(get_db), user=Depends(require_role("doctor"))):
#     if not user.doctor_profile:
#         raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
#     return db.query(Appointment).filter(
#         Appointment.doctor_id == user.doctor_profile.id,
#         Appointment.appointment_date > date.today()
#     ).all()
