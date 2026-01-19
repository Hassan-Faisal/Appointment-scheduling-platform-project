from pydantic import BaseModel
from datetime import time

class AvailabilityCreateSchema(BaseModel):
    doctor_id: str
    day_of_week: int
    start_time: time
    end_time: time
