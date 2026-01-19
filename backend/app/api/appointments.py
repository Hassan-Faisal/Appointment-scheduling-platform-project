from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.appointment import Appointment
from app.core.dependencies import get_current_user
from app.schemas.bookings import BookAppointmentSchema
from uuid import UUID 
from app.core.dependencies import require_role
from app.models.patient import PatientProfile
from app.models.doctor import DoctorProfile
from app.services.slot_service import generate_slots , is_slot_available
from app.services.notification_service import send_booking_email, send_cancel_email



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



@router.post("/book")
def book_appointment(
    payload: dict,
    db: Session = Depends(get_db),
    user=Depends(require_role("patient"))
):
    print("Received Payload:", payload)  # Log the incoming request payload

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

    # ✅ Create appointment
    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        appointment_date=payload["appointment_date"],
        start_time=payload["start_time"],
        end_time=payload["end_time"],
        status="booked"
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    # 📧 SEND CONFIRMATION EMAIL
    send_booking_email(
        email=user.email,
        doctor=doctor.full_name,
        date=appointment.appointment_date,
        time=appointment.start_time
    )

    return {
        "message": "Appointment booked successfully",
        "appointment_id": appointment.id
    }


# @router.post("/book")
# def book_appointment(
#     payload: dict,
#     db: Session = Depends(get_db),
#     user=Depends(require_role("patient"))
# ):
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
#         status="booked"
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

 # # # 

# @router.post("/book")
# def book_appointment(
#     payload: dict,
#     db: Session = Depends(get_db),
#     user = Depends(require_role("patient"))
# ):
#     # ✅ Fetch patient profile correctly (ORM)
#     patient = db.query(PatientProfile).filter(
#         PatientProfile.user_id == user.id
#     ).first()

#     if not patient:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Patient profile not found"
#         )

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

#     # ✅ Create appointment
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



# # @router.post("/patient/cancel/{appointment_id}")
# # def cancel_appointment(
# #     appointment_id: UUID,
# #     user=Depends(get_current_user),
# #     db=Depends(get_db)
# # ):
# #     db.execute("""
# #         UPDATE appointments
# #         SET status='cancelled', cancelled_by='patient'
# #         WHERE id=:id
# #     """, {"id": appointment_id})

# #     return {"message": "Appointment cancelled"}






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
