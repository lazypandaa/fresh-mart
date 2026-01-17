from fastapi import APIRouter
from app.schemas.events import UserEvent, CartEvent, UserSession
from app.core.database import get_database
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/events/track")
async def track_user_event(event: UserEvent):
    db = get_database()
    
    event_data = {
        "user_id": event.user_id,
        "session_id": event.session_id,
        "event_type": event.event_type,
        "timestamp": event.timestamp or datetime.utcnow(),
        "product_id": event.product_id,
        "data": event.data or {},
        "created_at": datetime.utcnow()
    }
    
    result = await db.user_events.insert_one(event_data)
    print(f"User event tracked: {event.event_type} - ID: {result.inserted_id}")
    
    # Update session
    await update_session(db, event.session_id, event.user_id, event.event_type, event.product_id)
    
    return {"status": "tracked"}

@router.post("/events/cart")
async def track_cart_event(event: CartEvent):
    db = get_database()
    
    print(f"Cart event received: {event.action} for product {event.product_id}")
    
    cart_data = {
        "user_id": event.user_id,
        "session_id": event.session_id,
        "action": event.action,
        "product_id": event.product_id,
        "quantity": event.quantity,
        "timestamp": event.timestamp or datetime.utcnow(),
        "cart_total_items": event.cart_total_items,
        "cart_total_value": event.cart_total_value
    }
    
    result = await db.cart_events.insert_one(cart_data)
    print(f"Cart event inserted with ID: {result.inserted_id}")
    
    # Update session cart stats
    if event.action == "add":
        await db.user_sessions.update_one(
            {"session_id": event.session_id},
            {"$inc": {"cart_items_added": 1}},
            upsert=True
        )
    
    return {"status": "tracked", "id": str(result.inserted_id)}

async def update_session(db, session_id: str, user_id: str, event_type: str, product_id = None):
    session_update = {
        "$inc": {"page_views": 1},
        "$set": {"user_id": user_id}
    }
    
    if event_type == "product_view" and product_id:
        try:
            product_id_int = int(product_id) if product_id else None
            if product_id_int:
                session_update["$addToSet"] = {"products_viewed": product_id_int}
        except:
            pass
    
    await db.user_sessions.update_one(
        {"session_id": session_id},
        session_update,
        upsert=True
    )

@router.get("/analytics/user/{user_id}")
async def get_user_analytics(user_id: str):
    db = get_database()
    
    # Get recent events
    events = await db.user_events.find(
        {"user_id": user_id}
    ).sort("timestamp", -1).limit(100).to_list(100)
    
    # Get cart events
    cart_events = await db.cart_events.find(
        {"user_id": user_id}
    ).sort("timestamp", -1).limit(50).to_list(50)
    
    return {
        "user_id": user_id,
        "recent_events": events,
        "cart_events": cart_events
    }