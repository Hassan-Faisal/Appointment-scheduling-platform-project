from sqlalchemy import Column, String, Time
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid

class DoctorAvailability(Base):
    __tablename__ = "doctor_availability"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(UUID)
    day_of_week = Column(String)  # Monday, Tuesday...
    start_time = Column(Time)
    end_time = Column(Time)


    