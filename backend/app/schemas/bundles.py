from pydantic import BaseModel
from typing import List

class ProductInBundle(BaseModel):
    product_id: int
    name: str
    image_url: str

class BundleResponse(BaseModel):
    id: str
    bundle_id: int
    bundle_rank: int
    products: List[ProductInBundle]
    num_products: int
    support: float
    confidence: float
    lift: float