from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auth_service import (
    create_user,
    authenticate,
    generate_reset_token,
    reset_password,
)
from app.services.email_service import send_email
from app.schemas.auth import SignupRequest, LoginRequest
from app.models.user import User

router = APIRouter()


@router.post("/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    user = create_user(
        db,
        name=payload.name,
        email=payload.email,
        password=payload.password,
        role="patient",
    )

    verification_link = (
        f"http://localhost:8000/auth/verify-email?token={user.email_verification_token}"
    )

    send_email(
        user.email,
        "Verify your email",
        f"Click to verify your account:\n{verification_link}",
    )

    return {"message": "Verification email sent"}


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token = authenticate(db, payload.email, payload.password)
    if not token:
        # Either invalid credentials or email not verified
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    return {
        "access_token": token,
        "token_type": "bearer",
    }

@router.post("/forgot-password")
def forgot(email: str, db: Session = Depends(get_db)):
    token = generate_reset_token(email)
    msg=f"http://localhost:5173/reset-password/{token}"
    send_email(email, "Reset Password", f"click this link: {msg}")
    return {"message": "Check email"}

# @router.post("/forgot-password")
# def forgot(email: str, db: Session = Depends(get_db)):
#     # Generate a token for password reset
#     token = generate_reset_token(email)

#     # Create the password reset link
#     reset_link = f"http://localhost:8000/auth/reset-password?token={token}"

#     # Send the reset link in the email
#     send_email(email, "Reset Password", f"Click here to reset your password: {reset_link}")

#     return {"message": "Check email"}

@router.post("/reset-password")
def reset(token: str, new_password: str, db: Session = Depends(get_db)):
    reset_password(db, token, new_password)
    return {"message": "Password updated"}

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.email_verification_token == token
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")

    user.is_email_verified = True
    user.email_verification_token = None
    db.commit()

    return {"message": "Email verified successfully"}

@router.post("/resend-verification")
def resend_verification(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or user.is_email_verified:
        raise HTTPException(status_code=400, detail="Invalid request")

    token = secrets.token_urlsafe(32)
    user.email_verification_token = token
    db.commit()

    link = f"http://localhost:5173/verify-email?token={token}"
    send_email(user.email, "Verify your email", f"Click to verify:\n{link}")

    return {"message": "Verification email resent"}
