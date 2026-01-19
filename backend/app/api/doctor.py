# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from app.core.database import get_db
# from app.core.dependencies import require_role
# from app.models.appointment import Appointment
# from app.models.doctor import DoctorProfile

# router = APIRouter()

# @router.get("/appointments")
# def my_appointments(user=Depends(require_role("doctor")), db: Session = Depends(get_db)):
#     return db.query(Appointment).filter(Appointment.doctor_id == user["sub"]).all()


# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from app.core.database import get_db


# @router.get("/doctors_list")
# def list_doctors(db: Session = Depends(get_db)):
#     return db.query(DoctorProfile).all()

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.appointment import Appointment
from app.services.doctor_service import doctor_dashboard_stats
from typing import List

from sqlalchemy.orm import joinedload
from app.models.doctor import DoctorProfile 
from app.models.patient import PatientProfile
from app.schemas.appointment import AdminAppointmentOut





router = APIRouter(prefix="/doctor", tags=["Doctor"])


@router.get("/dashboard-stats")
def dashboard_stats(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.doctor_profile:
        raise HTTPException(
            status_code=400, 
            detail="Doctor profile not found. Please complete your profile setup."
        )
    return doctor_dashboard_stats(db, user.doctor_profile.id)


# @router.get("/today")
# def today_appointments(
#     db: Session = Depends(get_db),
#     user=Depends(get_current_user)
# ):
#     if not user.doctor_profile:
#         raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
#     return db.query(Appointment).filter(
#         Appointment.doctor_id == user.doctor_profile.id,
#         Appointment.appointment_date == date.today()
#     ).all()


# @router.get("/upcoming")
# def upcoming_appointments(
#     db: Session = Depends(get_db),
#     user=Depends(get_current_user)
# ):
#     if not user.doctor_profile:
#         raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
#     return db.query(Appointment).filter(
#         Appointment.doctor_id == user.doctor_profile.id,
#         Appointment.appointment_date > date.today(),
#         Appointment.status == "booked"
#     ).all()

# @router.get("/history")
# def history(
#     db: Session = Depends(get_db),
#     user=Depends(get_current_user)
# ):
#     if not user.doctor_profile:
#         raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
#     return db.query(Appointment).filter(
#         Appointment.doctor_id == user.doctor_profile.id,
#         Appointment.status.in_(["completed", "cancelled", "no_show"])
#     ).order_by(Appointment.appointment_date.desc()).all()



# Today appointments
@router.get("/today", response_model=List[AdminAppointmentOut])
def today_appointments(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
    
    rows = (
        db.query(
            Appointment,
            DoctorProfile.full_name.label("doctor_name"),
            PatientProfile.full_name.label("patient_name")
        )
        .outerjoin(DoctorProfile, DoctorProfile.id == Appointment.doctor_id)
        .outerjoin(PatientProfile, PatientProfile.id == Appointment.patient_id)
        .filter(
            Appointment.doctor_id == user.doctor_profile.id,
            Appointment.appointment_date == date.today()
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


# Upcoming appointments
@router.get("/upcoming", response_model=List[AdminAppointmentOut])
def upcoming_appointments(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
    
    rows = (
        db.query(
            Appointment,
            DoctorProfile.full_name.label("doctor_name"),
            PatientProfile.full_name.label("patient_name")
        )
        .outerjoin(DoctorProfile, DoctorProfile.id == Appointment.doctor_id)
        .outerjoin(PatientProfile, PatientProfile.id == Appointment.patient_id)
        .filter(
            Appointment.doctor_id == user.doctor_profile.id,
            Appointment.appointment_date > date.today(),
            Appointment.status == "booked"
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


# History (completed, cancelled, no-show)
@router.get("/history", response_model=List[AdminAppointmentOut])
def history_appointments(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
    
    rows = (
        db.query(
            Appointment,
            DoctorProfile.full_name.label("doctor_name"),
            PatientProfile.full_name.label("patient_name")
        )
        .outerjoin(DoctorProfile, DoctorProfile.id == Appointment.doctor_id)
        .outerjoin(PatientProfile, PatientProfile.id == Appointment.patient_id)
        .filter(
            Appointment.doctor_id == user.doctor_profile.id,
            Appointment.status.in_(["completed", "cancelled", "no_show"])
        )
        .order_by(Appointment.appointment_date.desc())
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


@router.post("/complete/{appointment_id}")
def mark_completed(
    appointment_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
    appt = db.query(Appointment).get(appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "completed"
    db.commit()
    return {"message": "Appointment completed"}


@router.post("/no-show/{appointment_id}")
def mark_no_show(
    appointment_id: str,
    no_show_by: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
    appt = db.query(Appointment).get(appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "no_show"
    appt.no_show_by = no_show_by
    db.commit()
    return {"message": "No-show recorded"}


@router.post("/cancel/{appointment_id}")
def cancel_appointment(
    appointment_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found. Please complete your profile setup.")
    appt = db.query(Appointment).get(appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "cancelled"
    db.commit()
    return {"message": "Appointment cancelled"}
