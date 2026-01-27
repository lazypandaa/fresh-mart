from pymongo import MongoClient
import os

def check_cosmos_data():
    client = MongoClient(os.getenv("COSMOS_MONGO_URL"))
    db = client["ecommerce_tracking"]
    
    print("=== COSMOS DB DATA ===")
    
    # Check user_events
    user_events = list(db["user_events"].find().sort("timestamp", -1).limit(10))
    print(f"\nuser_events ({len(user_events)} recent):")
    for event in user_events:
        print(f"  {event.get('timestamp')} - {event.get('event_type')} - {event.get('data', {})}")
    
    # Check cart_events
    cart_events = list(db["cart_events"].find().sort("timestamp", -1).limit(10))
    print(f"\ncart_events ({len(cart_events)} recent):")
    for event in cart_events:
        print(f"  {event.get('timestamp')} - {event.get('action')} - {event.get('product_id')} - qty:{event.get('quantity')}")
    
    # Check user_sessions
    sessions = list(db["user_sessions"].find().sort("timestamp", -1).limit(10))
    print(f"\nuser_sessions ({len(sessions)} recent):")
    for event in sessions:
        print(f"  {event.get('timestamp')} - {event.get('action')} - {event.get('session_id')}")
    
    client.close()

if __name__ == "__main__":
    check_cosmos_data()