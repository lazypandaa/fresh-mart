import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi

MONGODB_URL = "mongodb+srv://freshmart_user:eASMfdl5SXeGqOfx@hack.8syianl.mongodb.net/FreshMart?retryWrites=true&w=majority&appName=hack"

async def check_database():
    client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi('1'))
    db = client["FreshMart"]
    
    print("=== Checking FreshMart Database ===\n")
    
    # List all collections
    collections = await db.list_collection_names()
    print(f"Collections: {collections}\n")
    
    # Check products collection
    if "productsnew" in collections:
        count = await db.productsnew.count_documents({})
        print(f"Products count: {count}")
        
        # Get sample product
        sample = await db.productsnew.find_one()
        if sample:
            print("\nSample product structure:")
            for key, value in sample.items():
                print(f"  {key}: {type(value).__name__}")
    
    # Check users collection
    if "users" in collections:
        count = await db.users.count_documents({})
        print(f"\nUsers count: {count}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_database())
