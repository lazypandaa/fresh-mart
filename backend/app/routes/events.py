from fastapi import APIRouter
from app.schemas.events import UserEvent, CartEvent, UserSession
from app.core.database import get_database
from app.core.tracking import tracker
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/events/track")
async def track_user_event(event: UserEvent):
    # Store in Cosmos DB via tracker
    event_data = {
        "session_id": event.session_id,
        "product_id": event.product_id,
        "timestamp": event.timestamp or datetime.utcnow(),
        **(event.data or {})
    }
    
    tracker.track_event(event.user_id, event.event_type, event_data)
    print(f"User event tracked to Cosmos: {event.event_type} for user {event.user_id}")
    
    return {"status": "tracked"}

@router.post("/events/cart")
async def track_cart_event(event: CartEvent):
    print(f"Cart event received: {event.action} for product {event.product_id} by user {event.user_id}")
    
    # Store in Cosmos DB via tracker
    cart_data = {
        "session_id": event.session_id,
        "cart_total_items": event.cart_total_items,
        "cart_total_value": event.cart_total_value,
        "timestamp": event.timestamp or datetime.utcnow()
    }
    
    tracker.track_cart_event(event.user_id, event.action, event.product_id, event.quantity, cart_data)
    print(f"Cart event tracked to Cosmos for user {event.user_id}")
    
    return {"status": "tracked"}

@router.get("/analytics/user/{user_id}")
async def get_user_analytics(user_id: str):
    # This would need to query Cosmos DB directly
    return {"message": "Analytics moved to Cosmos DB"}