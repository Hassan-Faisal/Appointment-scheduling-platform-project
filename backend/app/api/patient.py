from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.patient import PatientProfile

router = APIRouter()

@router.get("/me")
def my_profile(user=Depends(require_role("patient")), db: Session = Depends(get_db)):
    return db.query(PatientProfile).filter(PatientProfile.user_id == user["sub"]).first()
