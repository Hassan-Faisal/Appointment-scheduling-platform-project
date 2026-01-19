from pydantic import BaseModel
from datetime import date, time
from uuid import UUID

class BookAppointmentSchema(BaseModel):
    doctor_id: UUID
    appointment_date: date
    start_time: time
    end_time: time
