from pymongo import MongoClient
import os
from datetime import datetime

def test():
    client = MongoClient(os.getenv("COSMOS_MONGO_URL"))
    db = client["ecommerce_tracking"]
    db["user_events"].insert_one({
        "guest_id": "compass_verified",
        "event_type": "test_insert",
        "timestamp": datetime.utcnow()
    })
    print("Insert OK")
    client.close()

test()