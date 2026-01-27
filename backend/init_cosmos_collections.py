from pymongo import MongoClient
import os
from datetime import datetime

def create_collections():
    client = MongoClient(os.getenv("COSMOS_MONGO_URL"))
    db = client["ecommerce_tracking"]
    
    # Create user_events collection
    db["user_events"].insert_one({
        "user_id": "test_user",
        "event_type": "init_collection",
        "data": {"collection": "user_events"},
        "timestamp": datetime.utcnow()
    })
    print("user_events collection created")
    
    # Create cart_events collection
    db["cart_events"].insert_one({
        "user_id": "test_user",
        "action": "add",
        "product_id": "test_product",
        "quantity": 1,
        "data": {"collection": "cart_events"},
        "timestamp": datetime.utcnow()
    })
    print("cart_events collection created")
    
    # Create user_sessions collection
    db["user_sessions"].insert_one({
        "user_id": "test_user",
        "session_id": "test_session",
        "action": "start",
        "data": {"collection": "user_sessions"},
        "timestamp": datetime.utcnow()
    })
    print("user_sessions collection created")
    
    client.close()
    print("All collections initialized")

create_collections()