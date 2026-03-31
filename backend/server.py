from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: int
    gender: str
    email: str
    avatar_face: int = 0
    avatar_hair: int = 0
    avatar_clothes: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    total_checkins: int = 0
    last_checkin_date: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserProfileCreate(BaseModel):
    name: str
    age: int
    gender: str
    email: str

class AvatarUpdate(BaseModel):
    avatar_face: int
    avatar_hair: int
    avatar_clothes: int

class MoodCheckin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    mood_score: int  # 1-5 scale
    mood_emoji: str
    is_bothered: bool = False
    is_sad: bool = False
    notes: Optional[str] = None
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).date().isoformat())
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MoodCheckinCreate(BaseModel):
    user_id: str
    mood_score: int
    mood_emoji: str
    is_bothered: bool = False
    is_sad: bool = False
    notes: Optional[str] = None

class GoodDeed(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    deed_id: str
    completed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class GoodDeedComplete(BaseModel):
    user_id: str
    deed_id: str

class EmotionalAnalysis(BaseModel):
    overall_score: float
    trend: str  # "improving", "stable", "needs_attention"
    alerts: List[str]
    positive_days: int
    total_days: int

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "theFRIEND API is running!"}

# User Profile Routes
@api_router.post("/users", response_model=UserProfile)
async def create_user(input: UserProfileCreate):
    # Check if email already exists
    existing = await db.users.find_one({"email": input.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = UserProfile(**input.model_dump())
    doc = user.model_dump()
    await db.users.insert_one(doc)
    return user

@api_router.get("/users/{user_id}", response_model=UserProfile)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.get("/users/email/{email}", response_model=UserProfile)
async def get_user_by_email(email: str):
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.patch("/users/{user_id}/avatar", response_model=UserProfile)
async def update_avatar(user_id: str, avatar: AvatarUpdate):
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": avatar.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    return user

# Mood Check-in Routes
@api_router.post("/checkins", response_model=MoodCheckin)
async def create_checkin(input: MoodCheckinCreate):
    # Get user
    user = await db.users.find_one({"id": input.user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    today = datetime.now(timezone.utc).date().isoformat()
    
    # Check if already checked in today
    existing = await db.checkins.find_one(
        {"user_id": input.user_id, "date": today},
        {"_id": 0}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Already checked in today")
    
    # Create checkin
    checkin = MoodCheckin(**input.model_dump())
    doc = checkin.model_dump()
    await db.checkins.insert_one(doc)
    
    # Update streak
    yesterday = (datetime.now(timezone.utc).date() - timedelta(days=1)).isoformat()
    last_checkin = user.get("last_checkin_date")
    
    new_streak = 1
    if last_checkin == yesterday:
        new_streak = user.get("current_streak", 0) + 1
    elif last_checkin == today:
        new_streak = user.get("current_streak", 1)
    
    longest_streak = max(user.get("longest_streak", 0), new_streak)
    total_checkins = user.get("total_checkins", 0) + 1
    
    await db.users.update_one(
        {"id": input.user_id},
        {"$set": {
            "current_streak": new_streak,
            "longest_streak": longest_streak,
            "total_checkins": total_checkins,
            "last_checkin_date": today
        }}
    )
    
    return checkin

@api_router.get("/checkins/{user_id}", response_model=List[MoodCheckin])
async def get_user_checkins(user_id: str, limit: int = 30):
    checkins = await db.checkins.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    return checkins

@api_router.get("/checkins/{user_id}/today")
async def get_today_checkin(user_id: str):
    today = datetime.now(timezone.utc).date().isoformat()
    checkin = await db.checkins.find_one(
        {"user_id": user_id, "date": today},
        {"_id": 0}
    )
    return {"checked_in": checkin is not None, "checkin": checkin}

# Good Deeds Routes
@api_router.post("/deeds", response_model=GoodDeed)
async def complete_deed(input: GoodDeedComplete):
    deed = GoodDeed(**input.model_dump())
    doc = deed.model_dump()
    await db.deeds.insert_one(doc)
    return deed

@api_router.get("/deeds/{user_id}", response_model=List[GoodDeed])
async def get_user_deeds(user_id: str, limit: int = 50):
    deeds = await db.deeds.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("completed_at", -1).limit(limit).to_list(limit)
    return deeds

# Analysis Routes
@api_router.get("/analysis/{user_id}", response_model=EmotionalAnalysis)
async def get_emotional_analysis(user_id: str):
    # Get last 7 days of check-ins
    checkins = await db.checkins.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).limit(7).to_list(7)
    
    if not checkins:
        return EmotionalAnalysis(
            overall_score=0,
            trend="stable",
            alerts=[],
            positive_days=0,
            total_days=0
        )
    
    # Calculate scores
    mood_scores = [c["mood_score"] for c in checkins]
    overall_score = sum(mood_scores) / len(mood_scores) if mood_scores else 0
    
    # Check for concerning patterns
    alerts = []
    bothered_count = sum(1 for c in checkins if c.get("is_bothered", False))
    sad_count = sum(1 for c in checkins if c.get("is_sad", False))
    
    if bothered_count >= 3:
        alerts.append("feeling_bothered")
    if sad_count >= 3:
        alerts.append("feeling_sad")
    if overall_score < 2.5:
        alerts.append("low_mood")
    
    # Determine trend
    trend = "stable"
    if len(mood_scores) >= 3:
        recent = sum(mood_scores[:3]) / 3
        older = sum(mood_scores[-3:]) / 3
        if recent - older > 0.5:
            trend = "improving"
        elif older - recent > 0.5:
            trend = "needs_attention"
    
    positive_days = sum(1 for s in mood_scores if s >= 4)
    
    return EmotionalAnalysis(
        overall_score=round(overall_score, 1),
        trend=trend,
        alerts=alerts,
        positive_days=positive_days,
        total_days=len(checkins)
    )

# Static Content Routes
@api_router.get("/content/supportive-messages")
async def get_supportive_messages():
    messages = [
        {"id": "1", "text": "You are amazing just the way you are! ✨", "category": "encouragement"},
        {"id": "2", "text": "It's okay to feel your feelings. They are valid!", "category": "validation"},
        {"id": "3", "text": "You are stronger than you think!", "category": "strength"},
        {"id": "4", "text": "Every day is a fresh start. You've got this!", "category": "motivation"},
        {"id": "5", "text": "You matter and the world is better with you in it!", "category": "belonging"},
        {"id": "6", "text": "Be kind to yourself today. You deserve it!", "category": "self-care"},
        {"id": "7", "text": "Your smile can brighten someone's day!", "category": "positivity"},
        {"id": "8", "text": "Making mistakes is how we learn and grow!", "category": "growth"},
        {"id": "9", "text": "You are braver than you believe!", "category": "courage"},
        {"id": "10", "text": "Friends come in all shapes and sizes!", "category": "friendship"},
    ]
    return messages

@api_router.get("/content/good-deeds")
async def get_good_deeds():
    deeds = [
        {"id": "1", "title": "Say something nice to someone", "description": "Give a compliment to a friend or family member!", "points": 10},
        {"id": "2", "title": "Help with a chore", "description": "Help someone with a task without being asked!", "points": 15},
        {"id": "3", "title": "Share your snack", "description": "Share something yummy with a friend!", "points": 10},
        {"id": "4", "title": "Write a thank you note", "description": "Say thank you to someone who helped you!", "points": 15},
        {"id": "5", "title": "Include someone new", "description": "Invite someone to play who looks lonely!", "points": 20},
        {"id": "6", "title": "Pick up litter", "description": "Help keep your neighborhood clean!", "points": 10},
        {"id": "7", "title": "Draw a picture for someone", "description": "Make art to brighten someone's day!", "points": 15},
        {"id": "8", "title": "Listen to a friend", "description": "Be a good listener when someone talks to you!", "points": 15},
        {"id": "9", "title": "Help a younger kid", "description": "Be a helpful big kid to someone smaller!", "points": 20},
        {"id": "10", "title": "Read to someone", "description": "Share a story with a sibling or pet!", "points": 15},
    ]
    return deeds

@api_router.get("/content/daily-questions")
async def get_daily_questions():
    questions = [
        {"id": "mood", "question": "How are you feeling today?", "type": "emoji"},
        {"id": "bothered", "question": "Is anyone bothering you at school?", "type": "yesno"},
        {"id": "sad", "question": "Did you feel sad today?", "type": "yesno"},
    ]
    return questions

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
