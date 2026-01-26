from fastapi import APIRouter, HTTPException
from typing import List
from app.core.database import get_database
from app.schemas.bundles import BundleResponse, ProductInBundle

router = APIRouter()

@router.get("/bundles", response_model=List[BundleResponse])
async def get_bundles(page: int = 1, limit: int = 12):
    """Get bundles with pagination and product details from productsnew"""
    try:
        db = get_database()
        bundles_collection = db.bundles
        products_collection = db.productsnew
        
        # Calculate skip value for pagination
        skip = (page - 1) * limit
        
        # Fetch bundles with pagination, sorted by bundle_rank
        bundles_cursor = bundles_collection.find().sort("bundle_rank", 1).skip(skip).limit(limit)
        bundles = await bundles_cursor.to_list(length=None)
        
        # Get all unique product IDs from current page bundles
        all_product_ids = set()
        for bundle in bundles:
            product_ids = [int(pid.strip()) for pid in bundle["product_ids"].split(",")]
            all_product_ids.update(product_ids)
        
        # Fetch all products in one query
        products_cursor = products_collection.find({"product_id": {"$in": list(all_product_ids)}})
        products = await products_cursor.to_list(length=None)
        products_dict = {p["product_id"]: p for p in products}
        
        # Convert MongoDB documents to response format
        bundle_list = []
        for bundle in bundles:
            product_ids = [int(pid.strip()) for pid in bundle["product_ids"].split(",")]
            
            # Create product list with details
            product_details = []
            for pid in product_ids:
                if pid in products_dict:
                    product = products_dict[pid]
                    product_details.append(ProductInBundle(
                        product_id=product["product_id"],
                        name=product["product_name"],
                        image_url="https://images.unsplash.com/photo-1506617420156-8e4536971650?w=100&h=100&fit=crop"
                    ))
                else:
                    product_details.append(ProductInBundle(
                        product_id=pid,
                        name=f"Product {pid}",
                        image_url="https://images.unsplash.com/photo-1506617420156-8e4536971650?w=100&h=100&fit=crop"
                    ))
            
            bundle_list.append(BundleResponse(
                id=str(bundle["_id"]),
                bundle_id=bundle["bundle_id"],
                bundle_rank=bundle["bundle_rank"],
                products=product_details,
                num_products=bundle["num_products"],
                support=bundle["support"],
                confidence=bundle["confidence"],
                lift=bundle["lift"]
            ))
        
        return bundle_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching bundles: {str(e)}")