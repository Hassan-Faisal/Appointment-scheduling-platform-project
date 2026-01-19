from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.availability import DoctorAvailability
from app.models.breaks import DoctorBreak
from app.services.slot_service import generate_slots
from uuid import UUID 
router = APIRouter()

# @router.get("/{doctor_id}")
# def get_slots(doctor_id: str, day: str, db: Session = Depends(get_db), user=Depends(require_role("patient"))):
#     availability = db.query(DoctorAvailability).filter_by(doctor_id=doctor_id, day_of_week=day).first()
#     breaks = db.query(DoctorBreak).filter_by(doctor_id=doctor_id).all()

#     if not availability:
#         return []

#     break_start = breaks[0].break_start if breaks else None
#     break_end = breaks[0].break_end if breaks else None

#     return generate_slots(availability.start_time, availability.end_time, break_start, break_end)


# @router.get("/slots/{doctor_id}")
# def get_slots(doctor_id: UUID, date: date, db=Depends(get_db)):
#     day = date.weekday()

#     availability = db.fetch_all("""
#         SELECT start_time, end_time
#         FROM doctor_availability
#         WHERE doctor_id = :doctor_id
#         AND day_of_week = :day
#     """, {"doctor_id": doctor_id, "day": day})

#     booked = db.fetch_all("""
#         SELECT start_time, end_time
#         FROM appointments
#         WHERE doctor_id = :doctor_id
#         AND appointment_date = :date
#         AND status = 'booked'
#     """, {"doctor_id": doctor_id, "date": date})

#     # Generate slots (e.g. 30 mins)
#     slots = generate_slots(availability, booked)
#     return slots
