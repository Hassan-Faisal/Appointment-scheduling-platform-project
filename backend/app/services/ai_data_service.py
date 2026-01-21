from sqlalchemy.orm import Session
from datetime import date
from app.models.doctor import DoctorProfile
from app.models.availability import DoctorAvailability
from app.models.appointment import Appointment

def fetch_doctors(db: Session):
    doctors = db.query(DoctorProfile).all()
    return [
        {
            "doctor_id": str(d.id),
            "doctor_name": d.full_name,
            "specialization": d.specialization
        }
        for d in doctors
    ]


def fetch_doctor_availability(db: Session, appointment_date: date):
    day_index = appointment_date.weekday()
    SLOT_MINUTES = 30

    response = []

    doctors = db.query(DoctorProfile).all()

    for doctor in doctors:
        availabilities = db.query(DoctorAvailability).filter(
            DoctorAvailability.doctor_id == doctor.id,
            DoctorAvailability.day_of_week == day_index
        ).all()

        slots = []

        for av in availabilities:
            current = av.start_time
            while True:
                end_time = (
                    datetime.combine(appointment_date, current)
                    + timedelta(minutes=SLOT_MINUTES)
                ).time()

                if end_time > av.end_time:
                    break

                booked = db.query(Appointment).filter(
                    Appointment.doctor_id == doctor.id,
                    Appointment.appointment_date == appointment_date,
                    Appointment.start_time == current,
                    Appointment.status == "booked"
                ).first()

                if not booked:
                    slots.append({
                        "start_time": str(current),
                        "end_time": str(end_time)
                    })

                current = end_time

        if slots:
            response.append({
                "doctor_id": str(doctor.id),
                "doctor_name": doctor.full_name,
                "specialization": doctor.specialization,
                "slots": slots
            })

    return response
