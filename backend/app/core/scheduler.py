from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from app.services.scheduling import send_meeting_reminder

scheduler = BackgroundScheduler()
scheduler.start()

def schedule_meeting_reminder(appointment, doctor, patient):
    run_time = datetime.combine(
        appointment.appointment_date,
        appointment.start_time
    ) - timedelta(minutes=15)

    scheduler.add_job(
        send_meeting_reminder,
        trigger="date",
        run_date=run_time,
        args=[
            patient.email,
            doctor.full_name,
            patient.full_name,
            appointment.appointment_date,
            appointment.start_time,
            appointment.meeting_link
        ]
    )

    scheduler.add_job(
        send_meeting_reminder,
        trigger="date",
        run_date=run_time,
        args=[
            doctor.email,
            doctor.full_name,
            patient.full_name,
            appointment.appointment_date,
            appointment.start_time,
            appointment.meeting_link
        ]
    )
