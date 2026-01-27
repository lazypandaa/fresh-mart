from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.core.tracking import tracker

router = APIRouter()

class TrackEventRequest(BaseModel):
    event_type: str
    data: Optional[Dict[str, Any]] = None

class TrackProductViewRequest(BaseModel):
    product_id: str
    session_id: str
    source: str  # card_click, detail_page, quick_view
    data: Optional[Dict[str, Any]] = None

class TrackCartRequest(BaseModel):
    action: str  # add, remove, update, clear
    product_id: str
    quantity: int = 1
    data: Optional[Dict[str, Any]] = None

class TrackSessionRequest(BaseModel):
    user_id: Optional[str] = None
    session_id: str
    action: str  # start, end, heartbeat
    data: Optional[Dict[str, Any]] = None

class TrackImpressionRequest(BaseModel):
    impressions: list[Dict[str, Any]]  # [{product_id, duration, visibility}]
    session_id: str

@router.post("/track")
async def track_event(request: TrackEventRequest, user_id: Optional[str] = None):
    tracker.track_event(user_id, request.event_type, request.data)
    return {"status": "tracked"}

@router.post("/track/product-view")
async def track_product_view(request: TrackProductViewRequest, user_id: Optional[str] = None):
    event_data = {
        "product_id": request.product_id,
        "session_id": request.session_id,
        "source": request.source,
        **(request.data or {})
    }
    tracker.track_event(user_id, "product_view", event_data)
    return {"status": "product_view_tracked"}

@router.post("/track/impressions")
async def track_impressions(request: TrackImpressionRequest, user_id: Optional[str] = None):
    event_data = {
        "impressions": request.impressions,
        "session_id": request.session_id,
        "count": len(request.impressions)
    }
    tracker.track_event(user_id, "product_impressions", event_data)
    return {"status": "impressions_tracked"}

@router.post("/track/cart")
async def track_cart(request: TrackCartRequest, user_id: Optional[str] = None):
    tracker.track_cart_event(user_id, request.action, request.product_id, request.quantity, request.data)
    return {"status": "cart_tracked"}

@router.post("/track/session")
async def track_session(request: TrackSessionRequest, user_id: Optional[str] = None):
    # Use user_id from request body if provided, otherwise from query param
    final_user_id = getattr(request, 'user_id', None) or user_id
    tracker.track_session(final_user_id, request.session_id, request.action, request.data)
    return {"status": "session_tracked"}