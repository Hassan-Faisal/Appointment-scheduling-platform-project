from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.user import User
from app.models.appointment import Appointment

router = APIRouter()

@router.get("/users")
def users(db: Session = Depends(get_db), user=Depends(require_role("admin"))):
    return db.query(User).all()

@router.get("/appointments")
def all_appointments(db: Session = Depends(get_db), user=Depends(require_role("admin"))):
    return db.query(Appointment).all()
