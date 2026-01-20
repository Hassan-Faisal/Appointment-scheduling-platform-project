from sqlalchemy import Column, Date, Time, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
# from sqlalchemy.orm import relationship
import uuid

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID, ForeignKey("patient_profiles.id"))
    doctor_id = Column(UUID, ForeignKey("doctor_profiles.id"))

    appointment_date = Column(Date)
    start_time = Column(Time)
    end_time = Column(Time)

    status = Column(String)

    appointment_type = Column(String)   # online / physical
    meeting_link = Column(String)    
    no_show_by = Column(String)  # patient / doctor

    ai_score = Column(String)


        # Relationship with Doctor model
    # doctor = relationship("Doctor", back_populates="appointments")

    # # Relationship with PatientProfile model
    # patient = relationship("PatientProfile", back_populates="appointments")
