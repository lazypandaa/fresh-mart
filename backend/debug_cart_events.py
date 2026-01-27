from app.core.tracking import tracker
import time

def test_cart_events():
    print("Testing cart event tracking...")
    
    # Test cart event
    tracker.track_cart_event(
        user_id="test_user_123",
        action="add",
        product_id="product_456",
        quantity=2,
        data={"test": "direct_cart_test"}
    )
    
    time.sleep(1)  # Wait for insert
    
    # Check if it was stored
    try:
        count = tracker.cart_events.count_documents({})
        print(f"Total cart events in collection: {count}")
        
        # Get the latest event
        latest = tracker.cart_events.find_one(sort=[("timestamp", -1)])
        if latest:
            print(f"Latest cart event: {latest}")
        else:
            print("No cart events found")
            
    except Exception as e:
        print(f"Error checking cart events: {e}")
    
    tracker.close()

if __name__ == "__main__":
    test_cart_events()