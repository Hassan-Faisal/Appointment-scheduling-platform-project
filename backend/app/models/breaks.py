from sqlalchemy import Column, Time
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid

class DoctorBreak(Base):
    __tablename__ = "doctor_breaks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(UUID)
    break_start = Column(Time)
    break_end = Column(Time)
