from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.services.auth_service import create_user
from app.models.doctor import DoctorProfile

router = APIRouter()

@router.post("/create-doctor")
def create_doctor(email: str, password: str, full_name: str, specialization: str, db: Session = Depends(get_db), user=Depends(require_role("admin"))):
    user = create_user(db, email, password, "doctor")

    doctor = DoctorProfile(
        user_id=user.id,
        full_name=full_name,
        specialization=specialization
    )
    db.add(doctor)
    db.commit()

    return {"message": "Doctor created"}
