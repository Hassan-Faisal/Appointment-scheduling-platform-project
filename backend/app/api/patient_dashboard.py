from sqlalchemy.orm import joinedload
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.appointment import Appointment
from app.models.patient import PatientProfile
from app.models.doctor import DoctorProfile
from app.models.user import User

router = APIRouter()

# @router.get("/my-upcoming")
# def my_upcoming(db: Session = Depends(get_db), user: User = Depends(require_role("patient"))):
#     # Get patient profile for the user
#     patient_profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
    
#     if not patient_profile:
#         return []
    
#     return db.query(Appointment).filter(
#         Appointment.patient_id == patient_profile.id,
#         Appointment.appointment_date >= date.today()
#     ).all()

# @router.get("/my-history")
# def my_history(db: Session = Depends(get_db), user: User = Depends(require_role("patient"))):
#     # Get patient profile for the user
#     patient_profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
    
#     if not patient_profile:
#         return []
    
#     return db.query(Appointment).filter(
#         Appointment.patient_id == patient_profile.id,
#         Appointment.appointment_date < date.today()
#     ).all()



@router.get("/my-upcoming")
def my_upcoming(db: Session = Depends(get_db), user: User = Depends(require_role("patient"))):
    # Get patient profile for the user
    patient_profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
    
    if not patient_profile:
        return []

    rows = (
        db.query(
            Appointment,
            DoctorProfile.full_name.label("doctor_name"),
            PatientProfile.full_name.label("patient_name")
        )
        .outerjoin(DoctorProfile, DoctorProfile.id == Appointment.doctor_id)
        .outerjoin(PatientProfile, PatientProfile.id == Appointment.patient_id)
        .filter(
            Appointment.patient_id == patient_profile.id,
            Appointment.appointment_date >= date.today()
        )
        .all()
    )

    result = [
        {
            "id": appt.id,
            "patient_id": appt.patient_id,
            "patient_name": patient_name,
            "doctor_id": appt.doctor_id,
            "doctor_name": doctor_name,
            "appointment_date": appt.appointment_date,
            "start_time": appt.start_time,
            "end_time": appt.end_time,
            "status": appt.status,
            "no_show_by": appt.no_show_by,
            "ai_score": appt.ai_score,
        }
        for appt, doctor_name, patient_name in rows
    ]

    return result



@router.get("/my-history")
def my_history(db: Session = Depends(get_db), user: User = Depends(require_role("patient"))):
    # Get patient profile for the user
    patient_profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()

    if not patient_profile:
        return []

    # Query for past appointments with doctor and patient details
    rows = (
        db.query(
            Appointment,
            DoctorProfile.full_name.label("doctor_name"),
            PatientProfile.full_name.label("patient_name")
        )
        .outerjoin(DoctorProfile, DoctorProfile.id == Appointment.doctor_id)
        .outerjoin(PatientProfile, PatientProfile.id == Appointment.patient_id)
        .filter(
            Appointment.patient_id == patient_profile.id,
            Appointment.appointment_date < date.today()  # Past appointments
        )
        .all()
    )

    # Build the result with doctor and patient names included
    result = [
        {
            "id": appt.id,
            "patient_id": appt.patient_id,
            "patient_name": patient_name,
            "doctor_id": appt.doctor_id,
            "doctor_name": doctor_name,
            "appointment_date": appt.appointment_date,
            "start_time": appt.start_time,
            "end_time": appt.end_time,
            "status": appt.status,
            "no_show_by": appt.no_show_by,
            "ai_score": appt.ai_score,
        }
        for appt, doctor_name, patient_name in rows
    ]

    return result

