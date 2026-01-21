from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    department: str
    image_url: str

class ShippingAddress(BaseModel):
    name: str
    address: str
    city: str
    zipCode: str

class OrderCreate(BaseModel):
    user_email: str
    items: List[OrderItem]
    total: float
    shipping_address: ShippingAddress

class OrderResponse(BaseModel):
    id: str
    user_email: str
    items: List[OrderItem]
    total: float
    shipping_address: ShippingAddress
    status: str
    created_at: datetime