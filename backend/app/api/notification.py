from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.appointment import Appointment
from app.models.doctor import DoctorProfile
from app.models.patient import PatientProfile
from app.services.appointment_email import send_reminder_email

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.post("/send-reminders")
def send_upcoming_reminders(db: Session = Depends(get_db)):
    now = datetime.now()

    appointments = db.query(Appointment).filter(
        Appointment.status == "booked",
        Appointment.reminder_sent == False
    ).all()

    sent = 0

    for appt in appointments:
        appointment_time = datetime.combine(
            appt.appointment_date,
            appt.start_time
        )

        reminder_time = appointment_time - timedelta(hours=1)

        # ⏰ Allow 5-minute window
        if reminder_time <= now <= reminder_time + timedelta(minutes=5):
            patient = db.query(PatientProfile).filter(
                PatientProfile.id == appt.patient_id
            ).first()

            doctor = db.query(DoctorProfile).filter(
                DoctorProfile.id == appt.doctor_id
            ).first()

            send_reminder_email(
                email=patient.user.email,
                doctor=doctor.full_name,
                date=appt.appointment_date,
                time=appt.start_time
            )

            # ✅ Mark reminder as sent
            appt.reminder_sent = True
            sent += 1

    db.commit()
    return {"message": f"{sent} reminder emails sent"}
