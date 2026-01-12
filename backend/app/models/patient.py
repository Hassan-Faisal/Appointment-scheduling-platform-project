from sqlalchemy import Column, String, Date
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID)
    full_name = Column(String)
    phone = Column(String)
    date_of_birth = Column(Date)
