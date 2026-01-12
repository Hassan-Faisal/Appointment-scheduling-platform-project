from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.availability import DoctorAvailability

router = APIRouter()

@router.post("/availability")
def add_availability(
    doctor_id: str,
    day_of_week: str,
    start_time: str,
    end_time: str,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    record = DoctorAvailability(
        doctor_id=doctor_id,
        day_of_week=day_of_week,
        start_time=start_time,
        end_time=end_time
    )
    db.add(record)
    db.commit()
    return {"message": "Availability added"}
