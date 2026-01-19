from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.services.admin_service import *
from app.models.user import User
from app.models.appointment import Appointment
from typing import List
from app.models.doctor import DoctorProfile
from app.models.patient import PatientProfile
from app.schemas.appointment import AdminAppointmentOut


router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/create-doctor", dependencies=[Depends(require_role("admin"))])
def create_doctor_api(payload: dict, db: Session = Depends(get_db)):
    return create_doctor(db, payload)

@router.patch("/user/{user_id}/block", dependencies=[Depends(require_role("admin"))])
def block_user(user_id: str, db: Session = Depends(get_db)):
    toggle_user(db, user_id, False)
    return {"message": "User blocked"}

@router.patch("/user/{user_id}/unblock", dependencies=[Depends(require_role("admin"))])
def unblock_user(user_id: str, db: Session = Depends(get_db)):
    toggle_user(db, user_id, True)
    return {"message": "User unblocked"}

@router.get("/users", dependencies=[Depends(require_role("admin"))])
def list_users(role: str, db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == role).all()

# @router.get("/appointments", dependencies=[Depends(require_role("admin"))])
# def all_appointments(db: Session = Depends(get_db)):
#     return db.query(Appointment).all()


@router.get("/appointments", response_model=List[AdminAppointmentOut], dependencies=[Depends(require_role("admin"))])
def all_appointments(db: Session = Depends(get_db)):

    rows = (
        db.query(
            Appointment,
            DoctorProfile.full_name.label("doctor_name"),
            PatientProfile.full_name.label("patient_name"),
        )
        .outerjoin(DoctorProfile, DoctorProfile.id == Appointment.doctor_id)
        .outerjoin(PatientProfile, PatientProfile.id == Appointment.patient_id)
        .order_by(Appointment.appointment_date.desc(), Appointment.start_time.desc())
        .all()
    )

    # Convert into response objects (dicts)
    result = []
    for appt, doctor_name, patient_name in rows:
        result.append({
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
        })

    return result

@router.patch("/appointment/{id}/reschedule", dependencies=[Depends(require_role("admin"))])
def force_reschedule(id: str, payload: dict, db: Session = Depends(get_db)):
    reschedule(db, id, payload)
    return {"message": "Rescheduled"}

@router.get("/dashboard-stats", dependencies=[Depends(require_role("admin"))])
def dashboard(db: Session = Depends(get_db)):
    return admin_stats(db)
