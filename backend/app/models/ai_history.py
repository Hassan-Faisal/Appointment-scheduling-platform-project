from sqlalchemy import Column, String, Date, Time
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid

class AIHistory(Base):
    __tablename__ = "ai_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID)
    doctor_id = Column(UUID)
    appointment_date = Column(Date)
    appointment_time = Column(Time)
    outcome = Column(String)   # completed / no_show / cancelled
