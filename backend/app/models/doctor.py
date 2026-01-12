from sqlalchemy import Column, String, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID)
    full_name = Column(String)
    specialization = Column(String)
    experience_years = Column(Integer)
    consultation_fee = Column(Numeric)
