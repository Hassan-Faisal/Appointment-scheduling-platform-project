from app.services.email_service import send_email

# def send_booking_email(email, doctor, date, time):
#     send_email(email, "Appointment Confirmed",
#                f"Your appointment with Dr. {doctor} is confirmed on {date} at {time}")

# # # # #
# def send_booking_email(email, doctor, date, time, appointment_type, meet_link=None):
#     body = f"""
#         Your appointment with Dr. {doctor} is confirmed.

#         📅 Date: {date}
#         ⏰ Time: {time}
#         🏥 Type: {appointment_type.upper()}
#         """

#     # if appointment_type == "online":
#     #     body += f"\n💻 Google Meet Link:\n{meet_link}"

#     send_email(email, "Appointment Confirmed", body)


def send_booking_email(email, doctor, date, time, appointment_type):
    location = (
        "Online (Google Meet link will be shared)"
        if appointment_type == "online"
        else "Physical (Clinic visit)"
    )

    body = f"""
    📅 Appointment Confirmed

    👨‍⚕️ Doctor: Dr. {doctor}
    📅 Date: {date}
    ⏰ Time: {time}
     📍 Type: {location}
     """

    send_email(email, "Appointment Confirmed", body)


def send_cancel_email(email, date, time):
    send_email(email, "Appointment Cancelled",
               f"Your appointment on {date} at {time} has been cancelled")

def send_reminder_email(email, date, time):
    send_email(email, "Appointment Reminder",
               f"You have an appointment tomorrow at {time} on {date}")
