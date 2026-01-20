# from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from app.services.email_service import send_email

# scheduler = BackgroundScheduler()
# scheduler.start()

# def schedule_meet_email(appointment):
#     send_time = appointment.start_time - timedelta(minutes=15)

#     scheduler.add_job(
#         send_email,
#         "date",
#         run_date=send_time,
#         args=[
#             appointment.patient.email,
#             appointment.doctor.email,
#             appointment.meeting_link
#         ],
#         id=f"appointment_{appointment.id}"
#     )

def send_meeting_reminder(email, doctor, patient, date, time, meet_link):
    body = f"""
⏰ Reminder: Your online appointment starts in 15 minutes.

👨‍⚕️ Doctor: Dr. {doctor}
🧑 Patient: {patient}
📅 Date: {date}
⏰ Time: {time}

💻 Join Google Meet:
{meet_link}
"""
    send_email(email, "Online Appointment Reminder", body)
