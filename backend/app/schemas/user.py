from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    cpf: str
    role: str = "tenant"


class UserLogin(BaseModel):
    email: str
    password: str


class WalletLogin(BaseModel):
    public_key: str


class WalletRegister(BaseModel):
    public_key: str
    role: str = "tenant"


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    cpf: str | None = None
    role: str
    solana_public_key: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
