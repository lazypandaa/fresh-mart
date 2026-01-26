from fastapi import APIRouter, HTTPException
from app.core.database import get_database
from typing import List, Optional
from bson import ObjectId

router = APIRouter()

@router.get("/products")
async def get_products(department: str = None, aisle: str = None, search: str = None, limit: int = 20, skip: int = 0):
    try:
        db = get_database()
        
        query = {}
        if department:
            # Find department_id by department name
            dept_doc = await db.departments.find_one({"department": department})
            if dept_doc:
                query["department_id"] = dept_doc["department_id"]
        if aisle:
            query["aisle"] = aisle
        if search:
            query["product_name"] = {"$regex": search, "$options": "i"}
        
        cursor = db.productsnew.find(query).skip(skip).limit(limit)
        products = await cursor.to_list(length=limit)
        
        # Get total count for pagination
        total = await db.productsnew.count_documents(query)
        
        # Get all departments for lookup
        departments = await db.departments.find({}).to_list(100)
        dept_lookup = {d["department_id"]: d["department"] for d in departments}
        dept_image_lookup = {d["department_id"]: d.get("image_url", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center") for d in departments}
        
        # Transform products to match expected format
        result = []
        for product in products:
            dept_id = product.get("department_id")
            result.append({
                "id": str(product["_id"]),
                "product_id": product.get("product_id", 0),
                "name": product.get("product_name", "Unknown Product"),
                "price": float(product.get("price", 0) or 0),
                "department": dept_lookup.get(dept_id, "Unknown"),
                "aisle": product.get("aisle", "Unknown"),
                "image_url": dept_image_lookup.get(dept_id, "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center")
            })
        
        return {
            "products": result,
            "total": total,
            "has_more": skip + limit < total
        }
    except Exception as e:
        print(f"Error fetching products: {e}")
        return {"products": [], "total": 0, "has_more": False}

@router.get("/products/{product_id}")
async def get_product(product_id: str):
    try:
        db = get_database()
        
        try:
            product = await db.productsnew.find_one({"_id": ObjectId(product_id)})
        except:
            raise HTTPException(status_code=400, detail="Invalid product ID")
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get department info for image
        dept_id = product.get("department_id")
        department = await db.departments.find_one({"department_id": dept_id})
        dept_name = department.get("department", "Unknown") if department else "Unknown"
        dept_image = department.get("image_url", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center") if department else "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center"
        
        return {
            "id": str(product["_id"]),
            "product_id": product.get("product_id", 0),
            "name": product.get("product_name", "Unknown Product"),
            "price": float(product.get("price", 0) or 0),
            "department": dept_name,
            "aisle": product.get("aisle", "Unknown"),
            "image_url": dept_image
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching product: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/departments")
async def get_departments():
    try:
        db = get_database()
        departments = await db.departments.find({}).to_list(100)
        return {"departments": [{
            "id": dept["department_id"],
            "name": dept["department"],
            "image_url": dept.get("image_url")
        } for dept in departments]}
    except Exception as e:
        print(f"Error fetching departments: {e}")
        return {"departments": []}

@router.get("/aisles")
async def get_aisles():
    try:
        db = get_database()
        aisles = await db.productsnew.distinct("aisle")
        return {"aisles": [a for a in aisles if a]}
    except Exception as e:
        print(f"Error fetching aisles: {e}")
        return {"aisles": []}
