from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List, Union

class UserEvent(BaseModel):
    user_id: str
    session_id: str
    event_type: str
    timestamp: Optional[datetime] = None
    product_id: Optional[Union[int, str]] = None
    data: Optional[Dict[str, Any]] = None

class CartEvent(BaseModel):
    user_id: str
    session_id: str
    action: str
    product_id: Union[int, str]
    quantity: int = 1
    timestamp: Optional[datetime] = None
    cart_total_items: int = 0
    cart_total_value: float = 0.0

class UserSession(BaseModel):
    session_id: str
    user_id: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    page_views: int = 0
    products_viewed: List[int] = []
    cart_items_added: int = 0
    purchase_completed: bool = False