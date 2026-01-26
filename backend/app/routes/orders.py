from fastapi import APIRouter, HTTPException
from app.schemas.orders import OrderCreate, OrderResponse
from app.core.database import get_database
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    try:
        db = get_database()
        
        order_data = {
            "user_email": order.user_email,
            "items": [item.dict() for item in order.items],
            "total": order.total,
            "shipping_address": order.shipping_address.dict(),
            "status": "confirmed",
            "created_at": datetime.utcnow()
        }
        
        result = await db.orders.insert_one(order_data)
        order_data["id"] = str(result.inserted_id)
        
        return order_data
    except Exception as e:
        print(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Failed to create order")

@router.get("/orders/{user_email}")
async def get_user_orders(user_email: str):
    try:
        db = get_database()
        
        cursor = db.orders.find({"user_email": user_email}).sort("created_at", -1)
        orders = await cursor.to_list(length=100)
        
        result = []
        for order in orders:
            result.append({
                "id": str(order["_id"]),
                "user_email": order["user_email"],
                "items": order["items"],
                "total": order["total"],
                "shipping_address": order["shipping_address"],
                "status": order["status"],
                "created_at": order["created_at"]
            })
        
        return {"orders": result}
    except Exception as e:
        print(f"Error fetching orders: {e}")
        return {"orders": []}