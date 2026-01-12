from datetime import datetime, timedelta

def generate_slots(start, end, break_start, break_end, slot_minutes=30):
    slots = []
    current = datetime.combine(datetime.today(), start)
    end_dt = datetime.combine(datetime.today(), end)

    while current + timedelta(minutes=slot_minutes) <= end_dt:
        slot_end = current + timedelta(minutes=slot_minutes)

        if not (break_start <= current.time() < break_end):
            slots.append((current.time(), slot_end.time()))

        current = slot_end

    return slots
