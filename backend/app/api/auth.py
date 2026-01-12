from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auth_service import create_user, authenticate, generate_reset_token, reset_password
from app.services.email_service import send_email

router = APIRouter()

@router.post("/signup")
def signup(email: str, password: str, db: Session = Depends(get_db)):
    return create_user(db, email, password, "patient")

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    return authenticate(db, email, password)

@router.post("/forgot-password")
def forgot(email: str):
    token = generate_reset_token(email)
    send_email(email, "Reset Password", f"Use this token: {token}")
    return {"message": "Check email"}

@router.post("/reset-password")
def reset(token: str, new_password: str, db: Session = Depends(get_db)):
    reset_password(db, token, new_password)
    return {"message": "Password updated"}
