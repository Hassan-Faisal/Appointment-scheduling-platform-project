# from datetime import datetime, timedelta

# def generate_slots(availability, booked, slot_minutes=30):
#     slots = []

#     # Convert booked appointments into time ranges
#     booked_ranges = []
#     for b in booked:
#         booked_ranges.append((b.start_time, b.end_time))

#     for avail in availability:
#         start = datetime.combine(datetime.today(), avail.start_time)
#         end = datetime.combine(datetime.today(), avail.end_time)

#         while start + timedelta(minutes=slot_minutes) <= end:
#             slot_start = start.time()
#             slot_end = (start + timedelta(minutes=slot_minutes)).time()

#             # Check if slot is already booked
#             is_booked = any(
#                 slot_start < b_end and slot_end > b_start
#                 for b_start, b_end in booked_ranges
#             )

#             slots.append({
#                 "start_time": slot_start.strftime("%H:%M"),
#                 "end_time": slot_end.strftime("%H:%M"),
#                 "available": not is_booked
#             })

#             start += timedelta(minutes=slot_minutes)

#     return slots

from datetime import datetime, timedelta
from app.models.appointment import Appointment
def generate_slots(availability, booked, slot_minutes=30):
    slots = []

    booked_ranges = [
        (b.start_time, b.end_time) for b in booked
    ]

    for avail in availability:
        # 🚨 SAFETY CHECK
        if avail.start_time >= avail.end_time:
            continue

        start = datetime.combine(datetime.today(), avail.start_time)
        end = datetime.combine(datetime.today(), avail.end_time)

        while start + timedelta(minutes=slot_minutes) <= end:
            slot_start = start.time()
            slot_end = (start + timedelta(minutes=slot_minutes)).time()

            is_booked = any(
                slot_start < b_end and slot_end > b_start
                for b_start, b_end in booked_ranges
            )

            slots.append({
                "start_time": slot_start.strftime("%H:%M"),
                "end_time": slot_end.strftime("%H:%M"),
                "available": not is_booked
            })

            start += timedelta(minutes=slot_minutes)

    return slots



def is_slot_available(db, doctor_id, date, start_time, end_time):
    # Check overlapping bookings
    overlapping = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.appointment_date == date,
        Appointment.status == "booked",
        Appointment.start_time < end_time,
        Appointment.end_time > start_time
    ).first()

    return overlapping is None
