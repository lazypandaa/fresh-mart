from pymongo import MongoClient
import os
from datetime import datetime

def test_cart_tracking():
    client = MongoClient(os.getenv("COSMOS_MONGO_URL"))
    db = client["ecommerce_tracking"]
    
    # Test cart event insert
    try:
        result = db["cart_events"].insert_one({
            "user_id": "debug_user",
            "guest_id": None,
            "action": "add",
            "product_id": "test_product_123",
            "quantity": 2,
            "data": {"test": "cart_debug"},
            "timestamp": datetime.utcnow()
        })
        print(f"Cart event inserted with ID: {result.inserted_id}")
        
        # Verify it was inserted
        count = db["cart_events"].count_documents({})
        print(f"Total cart events: {count}")
        
    except Exception as e:
        print(f"Error: {e}")
    
    client.close()

test_cart_tracking()