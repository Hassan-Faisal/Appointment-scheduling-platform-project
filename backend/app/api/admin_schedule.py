from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.availability import DoctorAvailability

from app.schemas.availability import AvailabilityCreateSchema
from app.services.admin_service import add_availability_service
router = APIRouter()

# @router.post("/availability")
# def add_availability(
#     doctor_id: str,
#     day_of_week: str,
#     start_time: str,
#     end_time: str,
#     db: Session = Depends(get_db),
#     user=Depends(require_role("admin"))
# ):
#     record = DoctorAvailability(
#         doctor_id=doctor_id,
#         day_of_week=day_of_week,
#         start_time=start_time,
#         end_time=end_time
#     )
#     db.add(record)
#     db.commit()
#     return {"message": "Availability added"}

# @router.post("/availability", dependencies=[Depends(require_role("admin"))])
# def add_availability(payload: dict, db: Session = Depends(get_db)):
#     return create_availability(db, payload)


@router.post("/availability", dependencies=[Depends(require_role("admin"))])
def add_availability(
    payload: AvailabilityCreateSchema,
    db: Session = Depends(get_db)
):
    try:
        return add_availability_service(db, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add availability: {str(e)}")
