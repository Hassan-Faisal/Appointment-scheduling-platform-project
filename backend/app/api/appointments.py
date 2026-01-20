from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.appointment import Appointment
from app.core.dependencies import get_current_user
from app.schemas.bookings import BookAppointmentSchema
from uuid import UUID 
from app.models.user import User
from app.core.dependencies import require_role
from app.models.patient import PatientProfile
from app.models.doctor import DoctorProfile
from app.services.slot_service import generate_slots , is_slot_available
from app.services.notification_service import send_booking_email, send_cancel_email
from app.core.scheduler import schedule_meeting_reminder

from app.utils.google_meets import create_google_meet

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("/my")
def get_my_appointments(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Appointment)\
        .filter(Appointment.patient_id == user.id)\
        .order_by(Appointment.date.desc())\
        .all()



# @router.post("/book")
# def book_appointment(
#     payload: dict,
#     db: Session = Depends(get_db),
#     user=Depends(require_role("patient"))
# ):
#     print("Received Payload:", payload)  # Log the incoming request payload

#     # ✅ Patient profile
#     patient = db.query(PatientProfile).filter(
#         PatientProfile.user_id == user.id
#     ).first()

#     if not patient:
#         raise HTTPException(status_code=400, detail="Patient profile not found")

#     # ✅ Doctor
#     doctor = db.query(DoctorProfile).filter(
#         DoctorProfile.id == payload["doctor_id"]
#     ).first()

#     if not doctor:
#         raise HTTPException(status_code=404, detail="Doctor not found")

#     # ⛔ Slot validation
#     if not is_slot_available(
#         db,
#         payload["doctor_id"],
#         payload["appointment_date"],
#         payload["start_time"],
#         payload["end_time"]
#     ):
#         raise HTTPException(status_code=409, detail="Slot already booked")
#     # ✅ Create appointment
#     appointment = Appointment(
#         patient_id=patient.id,
#         doctor_id=doctor.id,
#         appointment_date=payload["appointment_date"],
#         start_time=payload["start_time"],
#         end_time=payload["end_time"],
#         status="booked",
#     )

#     db.add(appointment)
#     db.commit()
#     db.refresh(appointment)

#     # 📧 SEND CONFIRMATION EMAIL
#     send_booking_email(
#         email=user.email,
#         doctor=doctor.full_name,
#         date=appointment.appointment_date,
#         time=appointment.start_time
#     )

#     return {
#         "message": "Appointment booked successfully",
#         "appointment_id": appointment.id
#     }

@router.post("/book")
def book_appointment(
    payload: dict,
    db: Session = Depends(get_db),
    user=Depends(require_role("patient"))
):
    print("Received Payload:", payload)

    # ✅ Patient profile
    patient = db.query(PatientProfile).filter(
        PatientProfile.user_id == user.id
    ).first()

    if not patient:
        raise HTTPException(status_code=400, detail="Patient profile not found")

    # ✅ Doctor
    doctor = db.query(DoctorProfile).filter(
        DoctorProfile.id == payload["doctor_id"]
    ).first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # ⛔ Slot validation
    if not is_slot_available(
        db,
        payload["doctor_id"],
        payload["appointment_date"],
        payload["start_time"],
        payload["end_time"]
    ):
        raise HTTPException(status_code=409, detail="Slot already booked")

    # ✅ Appointment type (default = physical)
    appointment_type = payload.get("appointment_type", "physical")

    # ✅ Create appointment (NO MEET LINK YET)
    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        appointment_date=payload["appointment_date"],
        start_time=payload["start_time"],
        end_time=payload["end_time"],
        status="booked",
        appointment_type=appointment_type,  # 👈 NEW
        meeting_link=None                  # 👈 explicitly null
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    # 📧 SEND CONFIRMATION EMAIL (simple for now)
    send_booking_email(
        email=user.email,
        doctor=doctor.full_name,
        date=appointment.appointment_date,
        time=appointment.start_time,
        appointment_type=appointment.appointment_type
    )

    return {
        "message": "Appointment booked successfully",
        "appointment_id": appointment.id,
        "appointment_type": appointment.appointment_type
    }


# # #
# @router.post("/book")
# def book_appointment(
#     payload: dict,
#     db: Session = Depends(get_db),
#     user=Depends(require_role("patient"))
# ):
#     patient = db.query(PatientProfile).filter(
#         PatientProfile.user_id == user.id
#     ).first()

#     if not patient:
#         raise HTTPException(status_code=400, detail="Patient profile not found")

#     doctor = db.query(DoctorProfile).filter(
#         DoctorProfile.id == payload["doctor_id"]
#     ).first()

#     if not doctor:
#         raise HTTPException(status_code=404, detail="Doctor not found")

#     # ✅ FETCH DOCTOR USER (EMAIL SOURCE)
#     doctor_user = db.query(User).filter(
#         User.id == doctor.user_id
#     ).first()

#     if not doctor_user:
#         raise HTTPException(status_code=404, detail="Doctor user account not found")

#     if not is_slot_available(
#         db,
#         payload["doctor_id"],
#         payload["appointment_date"],
#         payload["start_time"],
#         payload["end_time"]
#     ):
#         raise HTTPException(status_code=409, detail="Slot already booked")

#     meet_link = None
#     if payload["appointment_type"] == "online":
#         meet_link = create_google_meet(
#             summary=f"Appointment with Dr. {doctor.full_name}",
#             start_date=payload["appointment_date"],
#             start_time=payload["start_time"],
#             end_time=payload["end_time"],
#             attendees=[user.email, doctor_user.email]
#         )

#     appointment = Appointment(
#         patient_id=patient.id,
#         doctor_id=doctor.id,
#         appointment_date=payload["appointment_date"],
#         start_time=payload["start_time"],
#         end_time=payload["end_time"],
#         status="booked",
#         appointment_type=payload["appointment_type"],
#         meeting_link=meet_link
#     )

#     db.add(appointment)
#     db.commit()
#     db.refresh(appointment)

#     # ⏰ Schedule reminder
#     if appointment.appointment_type == "online":
#         schedule_meeting_reminder(appointment, doctor, patient)

#     # 📧 Confirmation emails
#     send_booking_email(
#         email=user.email,
#         doctor=doctor.full_name,
#         date=appointment.appointment_date,
#         time=appointment.start_time,
#         appointment_type=appointment.appointment_type,
#         meet_link=appointment.meeting_link
#     )

#     send_booking_email(
#         email=doctor_user.email,
#         doctor=doctor.full_name,
#         date=appointment.appointment_date,
#         time=appointment.start_time,
#         appointment_type=appointment.appointment_type,
#         meet_link=appointment.meeting_link
#     )

#     return {"message": "Appointment booked successfully"}


@router.patch("/cancel/{appointment_id}")
def cancel_appointment(
    appointment_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_role("patient"))
):
    patient = db.query(PatientProfile).filter(
        PatientProfile.user_id == user.id
    ).first()

    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.patient_id == patient.id
    ).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if appointment.status != "booked":
        raise HTTPException(status_code=400, detail="Cannot cancel this appointment")

    appointment.status = "cancelled"
    db.commit()

    # 📧 SEND CANCEL EMAIL
    send_cancel_email(
        email=user.email,
        date=appointment.appointment_date,
        time=appointment.start_time
    )

    return {"message": "Appointment cancelled successfully"}
