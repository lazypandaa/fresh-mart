from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb+srv://freshmart_user:eASMfdl5SXeGqOfx@hack.8syianl.mongodb.net/FreshMart"
    database_name: str = "FreshMart"
    
    # Cosmos DB
    cosmos_mongo_url: str = ""
    
    # JWT
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API
    api_host: str = "127.0.0.1"
    api_port: int = 8000
    debug: bool = True
    
    # CORS
    allowed_origins: str = "http://localhost:5173,http://localhost:5174,http://localhost:3000,http://127.0.0.1:5173"
    
    @property
    def origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()