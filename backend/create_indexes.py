from app.core.database import get_database
import asyncio

async def create_indexes():
    db = get_database()
    
    # User Events Collection Indexes
    await db.user_events.create_index([("user_id", 1), ("timestamp", -1)])
    await db.user_events.create_index([("event_type", 1), ("timestamp", -1)])
    await db.user_events.create_index([("product_id", 1)])
    await db.user_events.create_index([("session_id", 1)])
    
    # Cart Events Collection Indexes
    await db.cart_events.create_index([("user_id", 1), ("timestamp", -1)])
    await db.cart_events.create_index([("session_id", 1)])
    await db.cart_events.create_index([("product_id", 1)])
    
    # User Sessions Collection Indexes
    await db.user_sessions.create_index([("session_id", 1)], unique=True)
    await db.user_sessions.create_index([("user_id", 1)])
    
    print("Indexes created successfully!")

if __name__ == "__main__":
    asyncio.run(create_indexes())