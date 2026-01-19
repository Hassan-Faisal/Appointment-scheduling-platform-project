from pydantic import BaseModel
from typing import Optional

class DoctorUpdateSchema(BaseModel):
    full_name: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    consultation_fee: Optional[float] = None
