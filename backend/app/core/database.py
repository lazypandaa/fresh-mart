from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from app.core.settings import settings

client = None
database = None

async def connect_to_mongo():
    global client, database
    client = AsyncIOMotorClient(settings.mongodb_url, server_api=ServerApi('1'))
    database = client[settings.database_name]
    print(f"Connected to MongoDB: {settings.database_name}")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Closed MongoDB connection")

def get_database():
    return database
