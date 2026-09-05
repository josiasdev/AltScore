from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, WalletLogin, WalletRegister
from app.utils.crypto import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    existing_cpf = db.query(User).filter(User.cpf == data.cpf).first()
    if existing_cpf:
        raise HTTPException(status_code=400, detail="CPF já cadastrado")

    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        full_name=data.full_name,
        cpf=data.cpf,
        role=data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/register-wallet", response_model=TokenResponse)
def register_wallet(data: WalletRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.solana_public_key == data.public_key).first()
    if existing:
        raise HTTPException(status_code=400, detail="Wallet já cadastrada")

    user = User(
        email=f"wallet-{data.public_key[:8]}@altscore.app",
        hashed_password=get_password_hash(data.public_key),
        full_name=f"Usuário {data.public_key[:6]}",
        role=data.role,
        solana_public_key=data.public_key,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login-wallet", response_model=TokenResponse)
def login_wallet(data: WalletLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.solana_public_key == data.public_key).first()
    if not user:
        raise HTTPException(status_code=401, detail="Wallet não encontrada. Faça o cadastro primeiro.")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
