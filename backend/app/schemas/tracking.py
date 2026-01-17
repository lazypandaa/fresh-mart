from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class UserBehaviorEvent(BaseModel):
    user_id: str
    event_type: str  # 'view', 'search', 'cart_add', 'cart_remove', 'click', 'purchase'
    product_id: Optional[str] = None
    search_query: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: datetime = datetime.utcnow()
    session_id: Optional[str] = None