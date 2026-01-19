import secrets
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.doctor import DoctorProfile
from app.models.appointment import Appointment
from app.models.availability import DoctorAvailability
from app.services.email_service import send_email
from app.core.security import hash_password

def create_doctor(db: Session, payload):
    token = secrets.token_urlsafe(32)

    user = User(
        name=payload["full_name"],
        email=payload["email"],
        password_hash=hash_password(payload["password"]),
        role="doctor",
        email_verification_token=token
    )

    db.add(user)
    db.flush()

    doctor = DoctorProfile(
        user_id=user.id,
        full_name=payload["full_name"],
        specialization=payload["specialization"],
        experience_years=payload["experience_years"],
        consultation_fee=payload["consultation_fee"]
    )

    db.add(doctor)
    db.commit()

    send_email(
        user.email,
        "Verify Your Doctor Account",
        # f"Verification Token: {token}"
        f"http://localhost:3000/verify-email?token={token}"
    )

    return {"message": "Doctor created & verification email sent"}

def toggle_user(db: Session, user_id: str, active: bool):
    user = db.query(User).get(user_id)
    user.is_active = active
    db.commit()


def admin_stats(db: Session):
    return {
        "patients": db.query(User).filter(User.role == "patient").count(),
        "doctors": db.query(User).filter(User.role == "doctor").count(),
        "appointments": db.query(Appointment).count(),
        "cancelled": db.query(Appointment).filter(Appointment.status == "cancelled").count(),
        "missed": db.query(Appointment).filter(Appointment.status == "no_show").count(),
    }

def reschedule(db: Session, appointment_id, payload):
    appt = db.query(Appointment).get(appointment_id)
    appt.appointment_date = payload["date"]
    appt.start_time = payload["start_time"]
    appt.end_time = payload["end_time"]
    appt.status = "booked"
    db.commit()



def add_availability_service(db, payload):
    # The payload.doctor_id might be a user_id, so we need to find the doctor_profile
    # First, try to find doctor profile by ID (in case it's already a doctor_profile.id)
    doctor_profile = db.query(DoctorProfile).filter(DoctorProfile.id == payload.doctor_id).first()
    
    # If not found, try to find by user_id (in case it's a user.id)
    if not doctor_profile:
        doctor_profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == payload.doctor_id).first()
    
    if not doctor_profile:
        raise ValueError(f"Doctor profile not found for ID: {payload.doctor_id}")
    
    availability = DoctorAvailability(
        doctor_id=doctor_profile.id,  # Use the doctor_profile.id, not user.id
        day_of_week=str(payload.day_of_week),  # Convert int to string as per model
        start_time=payload.start_time,
        end_time=payload.end_time
    )

    db.add(availability)
    db.commit()
    db.refresh(availability)

    return {
        "message": "Availability added successfully",
        "availability_id": str(availability.id)
    }
