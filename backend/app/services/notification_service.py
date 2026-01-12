from app.services.email_service import send_email

def send_booking_email(email, doctor, date, time):
    send_email(email, "Appointment Confirmed",
               f"Your appointment with Dr. {doctor} is confirmed on {date} at {time}")

def send_cancel_email(email, date, time):
    send_email(email, "Appointment Cancelled",
               f"Your appointment on {date} at {time} has been cancelled")

def send_reminder_email(email, date, time):
    send_email(email, "Appointment Reminder",
               f"You have an appointment tomorrow at {time} on {date}")
