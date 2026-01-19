from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.patient import PatientProfile
from app.core.dependencies import get_current_user
from app.models.appointment import Appointment
from app.models.availability import DoctorAvailability
from app.models.doctor import DoctorProfile
from app.models.user import User
from uuid import UUID
from app.services.slot_service import generate_slots , is_slot_available
# from datetime import date
from datetime import timedelta, date

router = APIRouter( tags=["Patient"])


@router.get("/me")
def my_profile(user: User = Depends(require_role("patient")), db: Session = Depends(get_db)):
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
    if not profile:
        # Return empty profile structure if it doesn't exist yet, but include user's name
        return {
            "name": user.name,  # Name from user account (read-only)
            "full_name": None,
            "phone": None,
            "gender": None,
            "date_of_birth": None,
        }
    # Include user's name in the response
    result = {
        "name": user.name,  # Name from user account (read-only)
        "full_name": profile.full_name,
        "phone": profile.phone,
        "gender": profile.gender,
        "date_of_birth": profile.date_of_birth.isoformat() if profile.date_of_birth else None,
    }
    return result

@router.put("/me")
def update_my_profile(
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("patient"))
):
    from datetime import datetime
    
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
    
    # Parse date_of_birth if provided
    date_of_birth = None
    if payload.get("date_of_birth"):
        try:
            # Parse YYYY-MM-DD format
            date_of_birth = datetime.strptime(payload.get("date_of_birth"), "%Y-%m-%d").date()
        except (ValueError, TypeError):
            # If parsing fails, set to None
            date_of_birth = None
    
    if not profile:
        # Create new profile if it doesn't exist
        profile = PatientProfile(
            user_id=user.id,
            full_name=payload.get("full_name"),
            phone=payload.get("phone"),
            gender=payload.get("gender"),
            date_of_birth=date_of_birth
        )
        db.add(profile)
    else:
        # Update existing profile
        profile.full_name = payload.get("full_name")
        profile.phone = payload.get("phone")
        profile.gender = payload.get("gender")
        profile.date_of_birth = date_of_birth

    db.commit()
    db.refresh(profile)

    # Return profile with user's name included
    return {
        "name": user.name,  # Name from user account (read-only)
        "full_name": profile.full_name,
        "phone": profile.phone,
        "gender": profile.gender,
        "date_of_birth": profile.date_of_birth.isoformat() if profile.date_of_birth else None,
    }


@router.get("/stats")
def patient_stats(
    db: Session = Depends(get_db),
    user: User = Depends(require_role("patient"))
):
    # Ensure user is a User object, not a dict
    if not isinstance(user, User):
        raise HTTPException(status_code=500, detail="Invalid user object")
    
    # Get patient profile for the user
    patient_profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
    
    if not patient_profile:
        # Return empty stats if profile doesn't exist yet
        return {
            "upcoming": 0,
            "completed": 0,
            "cancelled": 0,
            "no_show": 0,
        }
    
    patient_id = patient_profile.id

    def count(status):
        return db.query(Appointment).filter(
            Appointment.patient_id == patient_id,
            Appointment.status == status
        ).count()

    return {
        "upcoming": count("booked"),
        "completed": count("completed"),
        "cancelled": count("cancelled"),
        "no_show": count("no_show"),
    }



@router.get("/doctors")
def list_doctors(db=Depends(get_db), user: User = Depends(require_role("patient"))):
    return db.query(DoctorProfile).all()


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


@router.get("/slots/{doctor_id}")
def get_slots(
    doctor_id: UUID,
    date: date,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("patient"))
):
    day = date.weekday()

    availability = db.query(DoctorAvailability).filter(
        DoctorAvailability.doctor_id == doctor_id,
        DoctorAvailability.day_of_week == day
    ).all()

    booked = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.appointment_date == date,
        Appointment.status == "booked"
    ).all()

    return generate_slots(availability, booked)



# @router.post("/appointments/book")
# def book_appointment(
#     payload: dict,
#     db: Session = Depends(get_db),
#     user = Depends(require_role("patient"))
# ):
#     patient = db.query(PatientProfile).filter(
#         PatientProfile.user_id == user.id
#     ).first()

#     if not patient:
#         raise HTTPException(status_code=400, detail="Patient profile missing")

#     # ⛔ SLOT VALIDATION
#     if not is_slot_available(
#         db,
#         payload["doctor_id"],
#         payload["appointment_date"],
#         payload["start_time"],
#         payload["end_time"]
#     ):
#         raise HTTPException(
#             status_code=status.HTTP_409_CONFLICT,
#             detail="Slot already booked"
#         )

#     appointment = Appointment(
#         patient_id=patient.id,
#         doctor_id=payload["doctor_id"],
#         appointment_date=payload["appointment_date"],
#         start_time=payload["start_time"],
#         end_time=payload["end_time"],
#         status="booked"
#     )

#     db.add(appointment)
#     db.commit()
#     db.refresh(appointment)

#     return {
#         "message": "Appointment booked successfully",
#         "appointment_id": appointment.id
#     }
