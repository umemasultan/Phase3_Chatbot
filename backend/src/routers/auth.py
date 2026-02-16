from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta
try:
    # Try relative imports first (when run as a module)
    from ..models.user import User, UserCreate, UserLogin, UserRead
    from ..db.database import get_session
    from ..auth.jwt_handler import get_password_hash, verify_password, create_access_token, get_current_user, get_current_user_email
    from ..core.config import settings
except ImportError:
    # Fall back to absolute imports (when run directly)
    from models.user import User, UserCreate, UserLogin, UserRead
    from db.database import get_session
    from auth.jwt_handler import get_password_hash, verify_password, create_access_token, get_current_user
    from core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserRead)
def register(user: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = get_password_hash(user.password)

    # Create the user
    db_user = User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user

@router.post("/login")
def login(user_credentials: UserLogin, session: Session = Depends(get_session)):
    # Find user by email
    user = session.exec(select(User).where(User.email == user_credentials.email)).first()

    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token with both email and user ID
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    # Return the current user directly since get_current_user already returns the User object
    return current_user