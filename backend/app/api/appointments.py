from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.appointment import Appointment
from app.core.dependencies import get_current_user
from app.schemas.bookings import BookAppointmentSchema
from uuid import UUID 
from app.core.dependencies import require_role
from app.models.patient import PatientProfile
from app.services.slot_service import generate_slots , is_slot_available

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


# @router.post("/{appointment_id}/cancel")
# def cancel_appointment(
#     appointment_id: int,
#     db: Session = Depends(get_db),
#     user=Depends(get_current_user)
# ):
#     appointment = db.query(Appointment).filter(
#         Appointment.id == appointment_id,
#         Appointment.patient_id == user.id
#     ).first()

#     if not appointment:
#         raise HTTPException(status_code=404, detail="Appointment not found")

#     appointment.status = "cancelled"
#     db.commit()
#     return {"message": "Appointment cancelled"}


# @router.post("/appointments/book")
# def book_appointment(
#     payload: BookAppointmentSchema,
#     user=Depends(get_current_user),
#     db=Depends(get_db)
# ):
#     if user.role != "patient":
#         raise HTTPException(403, "Only patients can book")

#     patient = db.get_one("""
#         SELECT id FROM patient_profiles WHERE user_id = :uid
#     """, {"uid": user.id})

#     # Prevent double booking
#     exists = db.get_one("""
#         SELECT id FROM appointments
#         WHERE doctor_id = :doc
#         AND appointment_date = :date
#         AND start_time = :start
#         AND status = 'booked'
#     """, payload.dict())

#     if exists:
#         raise HTTPException(400, "Slot already booked")

#     db.execute("""
#         INSERT INTO appointments
#         (patient_id, doctor_id, appointment_date, start_time, end_time, status)
#         VALUES (:patient, :doctor, :date, :start, :end, 'booked')
#     """, {
#         "patient": patient.id,
#         "doctor": payload.doctor_id,
#         "date": payload.appointment_date,
#         "start": payload.start_time,
#         "end": payload.end_time
#     })

#     return {"message": "Appointment booked successfully"}




@router.post("/appointments/book")
def book_appointment(
    payload: dict,
    db: Session = Depends(get_db),
    user = Depends(require_role("patient"))
):
    # ✅ Fetch patient profile correctly (ORM)
    patient = db.query(PatientProfile).filter(
        PatientProfile.user_id == user.id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient profile not found"
        )

    # ⛔ SLOT VALIDATION
    if not is_slot_available(
        db,
        payload["doctor_id"],
        payload["appointment_date"],
        payload["start_time"],
        payload["end_time"]
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Slot already booked"
        )

    # ✅ Create appointment
    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=payload["doctor_id"],
        appointment_date=payload["appointment_date"],
        start_time=payload["start_time"],
        end_time=payload["end_time"],
        status="booked"
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return {
        "message": "Appointment booked successfully",
        "appointment_id": appointment.id
    }



@router.post("/patient/cancel/{appointment_id}")
def cancel_appointment(
    appointment_id: UUID,
    user=Depends(get_current_user),
    db=Depends(get_db)
):
    db.execute("""
        UPDATE appointments
        SET status='cancelled', cancelled_by='patient'
        WHERE id=:id
    """, {"id": appointment_id})

    return {"message": "Appointment cancelled"}
