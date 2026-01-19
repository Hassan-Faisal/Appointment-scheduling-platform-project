from datetime import date, time
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class AdminAppointmentOut(BaseModel):
    id: UUID

    # Patient info
    patient_id: Optional[UUID] = None
    patient_name: Optional[str] = None

    # Doctor info
    doctor_id: Optional[UUID] = None
    doctor_name: Optional[str] = None

    # Appointment timing
    appointment_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

    # Status & metadata
    status: Optional[str] = None
    no_show_by: Optional[str] = None
    ai_score: Optional[str] = None

    class Config:
        from_attributes = True   # IMPORTANT for SQLAlchemy ORM
