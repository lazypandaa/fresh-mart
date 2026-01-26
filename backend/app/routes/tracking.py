from fastapi import APIRouter
from app.schemas.tracking import UserBehaviorEvent
from app.core.database import get_database
from datetime import datetime

router = APIRouter()

@router.post("/track")
async def track_user_behavior(event: UserBehaviorEvent):
    db = get_database()
    
    event_data = {
        "user_id": event.user_id,
        "event_type": event.event_type,
        "product_id": event.product_id,
        "search_query": event.search_query,
        "metadata": event.metadata or {},
        "timestamp": datetime.utcnow(),
        "session_id": event.session_id
    }
    
    print(f"Tracking event: {event.event_type} for user {event.user_id}")
    
    await db.user_behavior.insert_one(event_data)
    return {"status": "tracked"}

@router.get("/recommendations/{user_id}")
async def get_recommendations(user_id: str, limit: int = 5):
    db = get_database()
    
    # Get user's recent behavior
    recent_behavior = await db.user_behavior.find(
        {"user_id": user_id}
    ).sort("timestamp", -1).limit(50).to_list(50)
    
    # Simple recommendation logic based on viewed/searched products
    viewed_products = []
    search_terms = []
    
    for event in recent_behavior:
        if event["event_type"] == "view" and event["product_id"]:
            viewed_products.append(event["product_id"])
        elif event["event_type"] == "search" and event["search_query"]:
            search_terms.extend(event["search_query"].lower().split())
    
    # Get products from same categories as viewed products
    recommendations = []
    if viewed_products:
        from bson import ObjectId
        try:
            viewed_product_docs = await db.productsnew.find(
                {"_id": {"$in": [ObjectId(pid) for pid in viewed_products[-5:]]}}
            ).to_list(5)
            
            departments = [p["department"] for p in viewed_product_docs]
            
            similar_products = await db.productsnew.find(
                {"department": {"$in": departments}, "_id": {"$nin": [ObjectId(pid) for pid in viewed_products]}}
            ).limit(limit).to_list(limit)
            
            for product in similar_products:
                product["id"] = str(product.pop("_id"))
                recommendations.append(product)
        except:
            pass
    
    return {"recommendations": recommendations}