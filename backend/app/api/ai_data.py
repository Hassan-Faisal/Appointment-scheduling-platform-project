from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
import calendar

from app.core.database import get_db
from app.models.doctor import DoctorProfile
from app.models.availability import DoctorAvailability
from app.models.appointment import Appointment

# from datetime import datetime, timedelta

from datetime import datetime, timedelta
from typing import List
# from app.models import DoctorProfile, DoctorAvailability, Appointment



router = APIRouter(prefix="/ai", tags=["AI Public Data"])


def get_day_index(d: date) -> int:
    return d.weekday()  # 0 = Monday, 6 = Sunday


@router.get("/doctors")
def get_doctors_for_ai(db: Session = Depends(get_db)):
    doctors = db.query(DoctorProfile).all()

    return [
        {
            "doctor_id": d.id,
            "full_name": d.full_name,
            "specialization": d.specialization,
            "experience_years": d.experience_years,
            "consultation_fee": float(d.consultation_fee),
        }
        for d in doctors
    ]


# Function to check if a specific slot is available
def is_slot_available(db, doctor_id, appointment_date, start_time, end_time):
    overlapping = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.appointment_date == appointment_date,
        Appointment.status == "booked",
        Appointment.start_time < end_time,
        Appointment.end_time > start_time
    ).first()

    return overlapping is None


@router.get("/availability")
def get_doctor_availability_for_ai(
    appointment_date: date = Query(...),
    db: Session = Depends(get_db),
):
    day_index = appointment_date.weekday()  # Get the day of the week index (0 = Monday, 6 = Sunday)

    doctors = db.query(DoctorProfile).all()
    response = []

    for doctor in doctors:
        # Fetch all available time slots for the given doctor and day of the week
        availabilities = db.query(DoctorAvailability).filter(
            DoctorAvailability.doctor_id == doctor.id,
            DoctorAvailability.day_of_week == day_index
        ).all()

        available_slots = []

        for slot in availabilities:
            # Start and end time for each slot
            start_time = slot.start_time
            end_time = slot.end_time

            # Check availability for each individual slot in the range
            current_start_time = datetime.combine(appointment_date, start_time)
            current_end_time = datetime.combine(appointment_date, end_time)

            # Split the time range into smaller intervals, e.g., 15 minutes
            while current_start_time < current_end_time:
                next_start_time = current_start_time + timedelta(minutes=30)
                next_end_time = current_start_time + timedelta(minutes=30)

                # Check if this 15-minute slot is available
                if is_slot_available(db, doctor.id, appointment_date, current_start_time.time(), next_end_time.time()):
                    available_slots.append({
                        "start_time": current_start_time.time(),
                        "end_time": next_end_time.time()
                    })

                # Move to the next 15-minute interval
                current_start_time = next_start_time

        if available_slots:
            response.append({
                "doctor_id": doctor.id,
                "doctor_name": doctor.full_name,
                "specialization": doctor.specialization,
                "slots": available_slots
            })

    return response