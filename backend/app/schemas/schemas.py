from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class GuestCreate(BaseModel):
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class ProductResponse(BaseModel):
    id: str
    product_id: int
    name: str
    price: float
    department: str
    aisle: str
    image_url: Optional[str] = None
