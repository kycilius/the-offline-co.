from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import bcrypt
import jwt
import hmac
import hashlib
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ---------- Setup ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
JWT_ALGORITHM = 'HS256'
JWT_EXP_HOURS = 24

app = FastAPI(title="The Ofline Co. API")
api_router = APIRouter(prefix="/api")
bearer_scheme = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXP_HOURS),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> dict:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ---------- Models ----------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class ApplicationCreate(BaseModel):
    alias: str = Field(..., min_length=1, max_length=80, description="Anonymous handle")
    email: EmailStr
    phone: Optional[str] = None
    age_range: Optional[str] = None
    city: Optional[str] = None
    why_offline: str = Field(..., min_length=10, max_length=2000)
    digital_overload_score: Optional[int] = Field(None, ge=1, le=10)
    preferred_window: Optional[str] = None

class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    alias: str
    email: str
    phone: Optional[str] = None
    age_range: Optional[str] = None
    city: Optional[str] = None
    why_offline: str
    digital_overload_score: Optional[int] = None
    preferred_window: Optional[str] = None
    status: Literal["pending", "selected", "waitlisted", "rejected"] = "pending"
    created_at: datetime

class ApplicationStatusUpdate(BaseModel):
    status: Literal["pending", "selected", "waitlisted", "rejected"]

class ExperienceCreate(BaseModel):
    slug: str = Field(..., min_length=2, max_length=80, pattern=r"^[a-z0-9-]+$")
    title: str
    region_hint: str = Field(..., description="Vague region — actual location revealed 24h before")
    cover_image: str
    duration: str = "48 hours"
    cohort_size: int = 12
    price_inr: int = 12000
    summary: str
    chapters: List[str] = []
    starts_at: Optional[datetime] = None
    published: bool = True

class Experience(ExperienceCreate):
    id: str
    created_at: datetime

class CountdownUpdate(BaseModel):
    next_reveal_at: datetime
    location_label: str = "Location revealed 24h before"
    seats_remaining: int = 12

class TestimonialCreate(BaseModel):
    quote: str
    attribution: str = "Anonymous participant"

class Testimonial(TestimonialCreate):
    id: str
    created_at: datetime

class RazorpayOrderRequest(BaseModel):
    experience_id: str
    alias: str
    email: EmailStr

class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    booking_id: str

# ---------- Helpers ----------
def _strip_id(doc: dict) -> dict:
    if doc is None:
        return doc
    doc.pop("_id", None)
    return doc

def _ser(doc: dict) -> dict:
    doc = _strip_id(dict(doc))
    for k, v in list(doc.items()):
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc

# ---------- Public API ----------
@api_router.get("/health")
async def health():
    return {"status": "ok", "service": "ofline-co"}

@api_router.post("/applications", status_code=201)
async def create_application(payload: ApplicationCreate):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.applications.insert_one(dict(doc))
    return _strip_id(doc)

@api_router.get("/experiences")
async def list_experiences(published_only: bool = True):
    query = {"published": True} if published_only else {}
    cursor = db.experiences.find(query, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(200)
    return items

@api_router.get("/experiences/{slug}")
async def get_experience(slug: str):
    item = await db.experiences.find_one({"slug": slug}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Experience not found")
    return item

@api_router.get("/countdown")
async def get_countdown():
    doc = await db.config.find_one({"key": "countdown"}, {"_id": 0})
    if not doc:
        # default: 30 days from now
        default = {
            "key": "countdown",
            "next_reveal_at": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
            "location_label": "Location revealed 24h before",
            "seats_remaining": 12,
        }
        await db.config.insert_one(dict(default))
        return _strip_id(default)
    return doc

@api_router.get("/testimonials")
async def list_testimonials():
    cursor = db.testimonials.find({}, {"_id": 0}).sort("created_at", 1)
    return await cursor.to_list(50)

# ---------- Auth ----------
@api_router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user["id"], user["email"])
    user_safe = {"id": user["id"], "email": user["email"], "role": user.get("role", "admin"), "name": user.get("name", "Admin")}
    return TokenResponse(access_token=token, user=user_safe)

@api_router.get("/auth/me")
async def me(admin = Depends(get_current_admin)):
    return admin

# ---------- Admin: applications ----------
@api_router.get("/admin/applications")
async def admin_list_applications(admin = Depends(get_current_admin), status_filter: Optional[str] = None):
    query = {}
    if status_filter:
        query["status"] = status_filter
    cursor = db.applications.find(query, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(1000)

@api_router.patch("/admin/applications/{app_id}")
async def admin_update_application(app_id: str, update: ApplicationStatusUpdate, admin = Depends(get_current_admin)):
    res = await db.applications.update_one({"id": app_id}, {"$set": {"status": update.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    item = await db.applications.find_one({"id": app_id}, {"_id": 0})
    return item

@api_router.delete("/admin/applications/{app_id}")
async def admin_delete_application(app_id: str, admin = Depends(get_current_admin)):
    res = await db.applications.delete_one({"id": app_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": True}

# ---------- Admin: experiences ----------
@api_router.post("/admin/experiences", status_code=201)
async def admin_create_experience(payload: ExperienceCreate, admin = Depends(get_current_admin)):
    existing = await db.experiences.find_one({"slug": payload.slug})
    if existing:
        raise HTTPException(status_code=409, detail="Slug already exists")
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    if doc.get("starts_at") and isinstance(doc["starts_at"], datetime):
        doc["starts_at"] = doc["starts_at"].isoformat()
    await db.experiences.insert_one(dict(doc))
    return _strip_id(doc)

@api_router.get("/admin/experiences")
async def admin_list_experiences(admin = Depends(get_current_admin)):
    cursor = db.experiences.find({}, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(500)

@api_router.patch("/admin/experiences/{exp_id}")
async def admin_update_experience(exp_id: str, payload: dict, admin = Depends(get_current_admin)):
    payload.pop("id", None)
    payload.pop("_id", None)
    payload.pop("created_at", None)
    if "starts_at" in payload and isinstance(payload["starts_at"], datetime):
        payload["starts_at"] = payload["starts_at"].isoformat()
    res = await db.experiences.update_one({"id": exp_id}, {"$set": payload})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return await db.experiences.find_one({"id": exp_id}, {"_id": 0})

@api_router.delete("/admin/experiences/{exp_id}")
async def admin_delete_experience(exp_id: str, admin = Depends(get_current_admin)):
    res = await db.experiences.delete_one({"id": exp_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": True}

# ---------- Admin: countdown ----------
@api_router.put("/admin/countdown")
async def admin_update_countdown(payload: CountdownUpdate, admin = Depends(get_current_admin)):
    doc = {
        "key": "countdown",
        "next_reveal_at": payload.next_reveal_at.isoformat(),
        "location_label": payload.location_label,
        "seats_remaining": payload.seats_remaining,
    }
    await db.config.update_one({"key": "countdown"}, {"$set": doc}, upsert=True)
    saved = await db.config.find_one({"key": "countdown"}, {"_id": 0})
    return saved

# ---------- Admin: testimonials ----------
@api_router.post("/admin/testimonials", status_code=201)
async def admin_create_testimonial(payload: TestimonialCreate, admin = Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.testimonials.insert_one(dict(doc))
    return _strip_id(doc)

@api_router.delete("/admin/testimonials/{tid}")
async def admin_delete_testimonial(tid: str, admin = Depends(get_current_admin)):
    res = await db.testimonials.delete_one({"id": tid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": True}

# ---------- Razorpay (placeholders if keys missing) ----------
@api_router.post("/payments/razorpay/order")
async def create_razorpay_order(payload: RazorpayOrderRequest):
    exp = await db.experiences.find_one({"id": payload.experience_id}, {"_id": 0})
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")

    key_id = os.environ.get("RAZORPAY_KEY_ID")
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
    booking_id = str(uuid.uuid4())
    amount_paise = int(exp["price_inr"]) * 100

    booking = {
        "id": booking_id,
        "experience_id": payload.experience_id,
        "alias": payload.alias,
        "email": payload.email,
        "amount_paise": amount_paise,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    if (not key_id) or (not key_secret):
        # No keys configured — fail fast with a clear message; don't persist orphan bookings
        raise HTTPException(
            status_code=503,
            detail="Payments are temporarily unavailable. Please apply via the application form — we'll reach out personally.",
        )

    try:
        import razorpay
        rz = razorpay.Client(auth=(key_id, key_secret))
        order = rz.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": booking_id[:40],
            "payment_capture": 1,
            "notes": {"experience_id": payload.experience_id, "alias": payload.alias},
        })
        booking["razorpay_order_id"] = order["id"]
        await db.bookings.insert_one(dict(booking))
        return {
            "booking_id": booking_id,
            "order_id": order["id"],
            "amount": amount_paise,
            "currency": "INR",
            "key_id": key_id,
            "experience_title": exp["title"],
        }
    except Exception as e:
        logger.exception("Razorpay order error")
        raise HTTPException(status_code=502, detail=f"Payment provider error: {str(e)}")

@api_router.post("/payments/razorpay/verify")
async def verify_razorpay(payload: RazorpayVerifyRequest):
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
    if not key_secret:
        raise HTTPException(status_code=503, detail="Payments unavailable")
    body = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode("utf-8")
    expected = hmac.new(key_secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, payload.razorpay_signature):
        await db.bookings.update_one({"id": payload.booking_id}, {"$set": {"status": "failed"}})
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    await db.bookings.update_one(
        {"id": payload.booking_id},
        {"$set": {
            "status": "paid",
            "razorpay_payment_id": payload.razorpay_payment_id,
            "paid_at": datetime.now(timezone.utc).isoformat(),
        }},
    )
    return {"status": "paid", "booking_id": payload.booking_id}

# ---------- App wiring ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Startup ----------
@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.applications.create_index("id", unique=True)
    await db.applications.create_index("created_at")
    await db.experiences.create_index("slug", unique=True)
    await db.experiences.create_index("id", unique=True)
    await db.bookings.create_index("id", unique=True)
    await db.config.create_index("key", unique=True)
    await db.testimonials.create_index("id", unique=True)

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@theofflineco.com").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Offline@2025")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "name": "Admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin user seeded: %s", admin_email)
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info("Admin password rotated for %s", admin_email)

    # Seed default countdown
    if not await db.config.find_one({"key": "countdown"}):
        await db.config.insert_one({
            "key": "countdown",
            "next_reveal_at": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
            "location_label": "Location revealed 24h before",
            "seats_remaining": 12,
        })

    # One-time cleanup: remove legacy seed experiences from earlier brand direction
    await db.experiences.delete_many({"slug": {"$in": ["first-light-himalayas", "long-table-coast"]}})

    # Seed sample experiences (Bengal & Odisha — offbeat, rooted)
    samples = [
        {
            "slug": "shantiniketan-mati",
            "title": "Mati",
            "region_hint": "A red-earth village near Shantiniketan, Birbhum",
            "cover_image": "https://static.prod-images.emergentagent.com/jobs/8233dccd-e10a-45ac-93c0-5e1ff12eeb81/images/ad52708b4197fa2c641d5ec311ef1555a5b05fc0692a51bf181899fb1e1927ba.png",
            "duration": "48 hours",
            "cohort_size": 12,
            "price_inr": 13000,
            "summary": "Two days in Tagore's red-earth country — Baul singers, mud-floor dinners, and the slow walk along the Khoai.",
            "chapters": [
                "Phone exchange at Bolpur station",
                "Khoai walk at dusk with a Baul",
                "Dinner with a Santhal family, mud floor and clay plates",
                "Sonajhuri haat at sunrise — no photos",
                "Letter beside the Kopai river",
            ],
            "starts_at": (datetime.now(timezone.utc) + timedelta(days=22)).isoformat(),
            "published": True,
        },
        {
            "slug": "dooars-wood-smoke",
            "title": "Wood Smoke",
            "region_hint": "Deep in a Dooars forest village near Gorumara, North Bengal",
            "cover_image": "https://static.prod-images.emergentagent.com/jobs/8233dccd-e10a-45ac-93c0-5e1ff12eeb81/images/a442b8b5c46dd5c0aba75a7f85fe0c41e8bcc4d39a1b435c00a324223d2b7479.png",
            "duration": "48 hours",
            "cohort_size": 12,
            "price_inr": 16000,
            "summary": "A weekend inside the Dooars — sal forests, tea-garden silence, and supper with a Lepcha family near Gorumara.",
            "chapters": [
                "Phone swap at the forest checkpoint",
                "Pre-dawn walk along the Murti river",
                "Tea-garden lunch with the pluckers",
                "Stories under sal trees, hurricane lamps only",
                "Slow farewell over wood smoke and rice beer",
            ],
            "starts_at": (datetime.now(timezone.utc) + timedelta(days=42)).isoformat(),
            "published": True,
        },
        {
            "slug": "daringbadi-pine-smoke",
            "title": "Pine Smoke",
            "region_hint": "A pine-and-coffee hamlet in Kandhamal, Odisha — locals call it the Kashmir of Odisha",
            "cover_image": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
            "duration": "48 hours",
            "cohort_size": 12,
            "price_inr": 15000,
            "summary": "Forty-eight hours in Daringbadi — pine woods, coffee estates, and Kondh tribal song around a single fire.",
            "chapters": [
                "Phone surrender at the coffee estate",
                "Hilltop lunch with a Kondh family",
                "Silent walk through the pine forest",
                "Bonfire and folk song at Lover's Point",
                "Letter at the Doluri river",
            ],
            "starts_at": (datetime.now(timezone.utc) + timedelta(days=58)).isoformat(),
            "published": True,
        },
        {
            "slug": "satkosia-river-hours",
            "title": "River Hours",
            "region_hint": "A riverside camp in the Satkosia gorge on the Mahanadi, Odisha",
            "cover_image": "https://images.pexels.com/photos/36729452/pexels-photo-36729452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400",
            "duration": "48 hours",
            "cohort_size": 12,
            "price_inr": 17000,
            "summary": "The Mahanadi cuts through forested hills here. No road noise, no signal — only the river, a dugout boat, and stars without LEDs.",
            "chapters": [
                "Phone swap at the ghat",
                "Dugout boat into the gorge at first light",
                "Cooking with the boatmen's family",
                "Stargazing without a single lamp",
                "Slow farewell on the water",
            ],
            "starts_at": (datetime.now(timezone.utc) + timedelta(days=78)).isoformat(),
            "published": True,
        },
    ]
    for s in samples:
        if not await db.experiences.find_one({"slug": s["slug"]}):
            doc = dict(s)
            doc["id"] = str(uuid.uuid4())
            doc["created_at"] = datetime.now(timezone.utc).isoformat()
            await db.experiences.insert_one(doc)

    # Seed testimonials
    if await db.testimonials.count_documents({}) == 0:
        seeds = [
            {"id": str(uuid.uuid4()), "quote": "I didn't realize how numb I had become until this weekend.", "attribution": "Founder, 34", "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "quote": "I came for a break. I left with perspective.", "attribution": "Designer, 29", "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "quote": "It felt like I met myself again after years.", "attribution": "Doctor, 41", "created_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.testimonials.insert_many([dict(s) for s in seeds])

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
