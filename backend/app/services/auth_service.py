from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
import secrets

reset_tokens = {}

def create_user(db: Session, email, password, role):
    user = User(
        email=email,
        password_hash=hash_password(password),
        role=role
    )
    db.add(user)
    db.commit()
    return user

def authenticate(db: Session, email, password):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return None
    return create_access_token({"sub": str(user.id), "role": user.role})

def generate_reset_token(email):
    token = secrets.token_urlsafe(32)
    reset_tokens[token] = email
    return token

def reset_password(db, token, new_password):
    email = reset_tokens.get(token)
    user = db.query(User).filter(User.email == email).first()
    user.password_hash = hash_password(new_password)
    db.commit()
