from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, products, events

app = FastAPI(title="FreshMart API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "FreshMart API is running"}

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api", tags=["Products"])
app.include_router(events.router, prefix="/api", tags=["Events"])
