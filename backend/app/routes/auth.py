from fastapi import APIRouter, HTTPException, status
from app.schemas.schemas import UserCreate, UserLogin, Token, UserResponse, GuestCreate
from app.core.database import get_database
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import datetime

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate):
    db = get_database()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_dict = {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "password": get_password_hash(user.password),
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    del user_dict["password"]
    
    return user_dict

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db = get_database()
    
    # Find user
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/guest-login", response_model=UserResponse)
async def guest_login(guest: GuestCreate):
    db = get_database()
    
    # Get the next guest ID
    last_guest = await db.users.find_one(
        {"email": {"$regex": "^guest_"}},
        sort=[("email", -1)]
    )
    
    if last_guest:
        # Extract number from last guest email (guest_0001@guest.com)
        last_num = int(last_guest["email"].split("_")[1].split("@")[0])
        next_num = last_num + 1
    else:
        next_num = 1
    
    guest_id = f"guest_{next_num:04d}"
    guest_email = f"{guest_id}@guest.com"
    
    # Create guest user
    guest_dict = {
        "name": guest.name,
        "email": guest_email,
        "phone": "",
        "password": get_password_hash("guest_password"),
        "created_at": datetime.utcnow(),
        "is_guest": True,
        "guest_id": guest_id
    }
    
    result = await db.users.insert_one(guest_dict)
    guest_dict["id"] = str(result.inserted_id)
    del guest_dict["password"]
    
    return guest_dict
