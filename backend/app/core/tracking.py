from pymongo import MongoClient
import os
from datetime import datetime
from typing import Optional, Dict, Any
import uuid
from app.core.settings import settings

class UserTracker:
    def __init__(self):
        cosmos_url = os.getenv("COSMOS_MONGO_URL") or settings.cosmos_mongo_url
        self.client = MongoClient(cosmos_url)
        self.db = self.client["ecommerce_tracking"]
        self.user_events = self.db["user_events"]
        self.cart_events = self.db["cart_events"]
        self.user_sessions = self.db["user_sessions"]
    
    def track_event(self, user_id: Optional[str], event_type: str, data: Dict[str, Any] = None):
        event = {
            "user_id": user_id,
            "guest_id": str(uuid.uuid4()) if not user_id else None,
            "event_type": event_type,
            "data": data or {},
            "timestamp": datetime.utcnow()
        }
        self.user_events.insert_one(event)
    
    def track_cart_event(self, user_id: Optional[str], action: str, product_id: str, quantity: int = 1, data: Dict[str, Any] = None):
        try:
            event = {
                "user_id": user_id,
                "guest_id": str(uuid.uuid4()) if not user_id else None,
                "action": action,
                "product_id": product_id,
                "quantity": quantity,
                "data": data or {},
                "timestamp": datetime.utcnow()
            }
            print(f"Inserting cart event: {event}")
            result = self.cart_events.insert_one(event)
            print(f"Cart event inserted with ID: {result.inserted_id}")
            
            # Verify insertion
            count = self.cart_events.count_documents({})
            print(f"Total cart events after insert: {count}")
            
        except Exception as e:
            print(f"Cart tracking error: {e}")
            import traceback
            traceback.print_exc()
    
    def track_session(self, user_id: Optional[str], session_id: str, action: str, data: Dict[str, Any] = None):
        event = {
            "user_id": user_id,
            "guest_id": str(uuid.uuid4()) if not user_id else None,
            "session_id": session_id,
            "action": action,  # start, end, heartbeat
            "data": data or {},
            "timestamp": datetime.utcnow()
        }
        self.user_sessions.insert_one(event)
    
    def close(self):
        self.client.close()

tracker = UserTracker()