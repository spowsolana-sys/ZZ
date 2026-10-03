from fastapi import FastAPI, APIRouter, Request, HTTPException, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import bcrypt
import jwt
import re
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Reward program config (modifiable)
REWARD_THRESHOLD = float(os.environ.get('REWARD_THRESHOLD', '1000'))
REWARD_COUPON = float(os.environ.get('REWARD_COUPON', '100'))

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = 'HS256'

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Helpers ----------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))


def now_utc():
    return datetime.now(timezone.utc)


def iso(dt):
    return dt.isoformat() if isinstance(dt, datetime) else dt


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": now_utc() + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": now_utc() + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    response.set_cookie(key="access_token", value=create_access_token(user_id, email),
                        httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=create_refresh_token(user_id),
                        httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token invalide")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        user["id"] = str(user.pop("_id"))
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")


from bson import ObjectId  # noqa: E402


def clean_doc(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    for k, v in doc.items():
        doc[k] = iso(v)
    return doc


# ---------- Models ----------

class RegisterInput(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def lower_email(cls, v):
        return v.lower().strip()


class LoginInput(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def lower_email(cls, v):
        return v.lower().strip()


class ForgotInput(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def lower_email(cls, v):
        return v.lower().strip()


class ResetInput(BaseModel):
    token: str
    password: str = Field(min_length=8, max_length=128)


class WishlistInput(BaseModel):
    product_id: str
    action: str  # "add" | "remove"

    @field_validator("action")
    @classmethod
    def valid_action(cls, v):
        if v not in ("add", "remove"):
            raise ValueError("action invalide")
        return v


class ReviewInput(BaseModel):
    product_id: str
    rating: int = Field(ge=1, le=5)
    text: str = Field(min_length=4, max_length=1000)


class QuestionInput(BaseModel):
    product_id: str
    question: str = Field(min_length=4, max_length=500)
    email: EmailStr

    @field_validator("email")
    @classmethod
    def lower_email(cls, v):
        return v.lower().strip()


class NewsletterInput(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def lower_email(cls, v):
        return v.lower().strip()


class ContactInput(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    message: str = Field(min_length=4, max_length=2000)

    @field_validator("email")
    @classmethod
    def lower_email(cls, v):
        return v.lower().strip()


class AddressInput(BaseModel):
    label: str = Field(default="Domicile", max_length=40)
    full_name: str = Field(min_length=1, max_length=80)
    line1: str = Field(min_length=1, max_length=120)
    line2: Optional[str] = Field(default=None, max_length=120)
    city: str = Field(min_length=1, max_length=80)
    zip: str = Field(min_length=1, max_length=20)
    country: str = Field(min_length=1, max_length=60)
    phone: Optional[str] = Field(default=None, max_length=30)


class ProfileInput(BaseModel):
    name: str = Field(min_length=1, max_length=80)


# ---------- Auth ----------

@api_router.post("/auth/register")
async def register(input: RegisterInput, request: Request, response: Response):
    existing = await db.users.find_one({"email": input.email})
    if existing:
        raise HTTPException(status_code=400, detail="Un compte existe déjà avec cet email")
    hashed = hash_password(input.password)
    doc = {"name": input.name.strip(), "email": input.email, "password_hash": hashed,
           "role": "customer", "created_at": now_utc()}
    result = await db.users.insert_one(doc)
    user_id = str(result.inserted_id)
    set_auth_cookies(response, user_id, input.email)
    return {"id": user_id, "name": doc["name"], "email": doc["email"], "role": doc["role"]}


@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request, response: Response):
    identifier = f"{request.client.host}:{input.email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until") and attempt["locked_until"] > now_utc():
        raise HTTPException(status_code=429, detail="Trop de tentatives. Réessayez dans 15 minutes.")

    user = await db.users.find_one({"email": input.email})
    if not user or not verify_password(input.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"failed": 1},
             "$set": {"updated_at": now_utc()},
             "$setOnInsert": {"created_at": now_utc()}},
            upsert=True)
        if attempt and attempt.get("failed", 0) + 1 >= 5:
            await db.login_attempts.update_one(
                {"identifier": identifier},
                {"$set": {"locked_until": now_utc() + timedelta(minutes=15)}})
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    await db.login_attempts.delete_one({"identifier": identifier})
    user_id = str(user["_id"])
    set_auth_cookies(response, user_id, input.email)
    return {"id": user_id, "name": user.get("name", ""), "email": user["email"], "role": user.get("role", "customer")}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def me(request: Request):
    return await get_current_user(request)


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Token invalide")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        set_auth_cookies(response, str(user["_id"]), user["email"])
        return {"ok": True}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")


@api_router.post("/auth/forgot-password")
async def forgot_password(input: ForgotInput):
    token = secrets.token_urlsafe(32)
    await db.password_reset_tokens.insert_one(
        {"email": input.email, "token": token, "used": False,
         "expires_at": now_utc() + timedelta(hours=1), "created_at": now_utc()})
    # Le lien réel sera envoyé par email via le service newsletter/email à connecter
    print(f"[RESET-LINK] /mot-de-passe-oublie?token={token}")
    return {"ok": True, "message": "Si un compte existe, un lien de réinitialisation a été envoyé."}


@api_router.post("/auth/reset-password")
async def reset_password(input: ResetInput, response: Response):
    rec = await db.password_reset_tokens.find_one({"token": input.token})
    if not rec or rec.get("used") or rec.get("expires_at", now_utc()) < now_utc():
        raise HTTPException(status_code=400, detail="Lien de réinitialisation invalide ou expiré")
    await db.users.update_one({"email": rec["email"]},
                              {"$set": {"password_hash": hash_password(input.password)}})
    await db.password_reset_tokens.update_one({"token": input.token}, {"$set": {"used": True}})
    return {"ok": True}


# ---------- Wishlist (compte requis) ----------

@api_router.get("/wishlist")
async def get_wishlist(request: Request):
    user = await get_current_user(request)
    rec = await db.wishlists.find_one({"user_id": user["id"]})
    return {"products": rec.get("product_ids", []) if rec else []}


@api_router.post("/wishlist")
async def toggle_wishlist(input: WishlistInput, request: Request):
    user = await get_current_user(request)
    rec = await db.wishlists.find_one({"user_id": user["id"]})
    ids = rec.get("product_ids", []) if rec else []
    if input.action == "add":
        if input.product_id not in ids:
            ids.append(input.product_id)
    else:
        ids = [i for i in ids if i != input.product_id]
    await db.wishlists.update_one({"user_id": user["id"]},
                                  {"$set": {"product_ids": ids, "updated_at": now_utc()}},
                                  upsert=True)
    return {"products": ids}


# ---------- Avis clients (aucun avis fictif) ----------

@api_router.get("/reviews")
async def get_reviews(request: Request, product_id: str):
    docs = await db.reviews.find({"product_id": product_id}).sort("created_at", -1).to_list(200)
    reviews = [clean_doc(d) for d in docs]
    count = len(reviews)
    avg = round(sum(r["rating"] for r in reviews) / count, 1) if count else None
    return {"reviews": reviews, "count": count, "average": avg}


@api_router.post("/reviews")
async def post_review(input: ReviewInput, request: Request):
    user = await get_current_user(request)
    doc = {"product_id": input.product_id, "rating": input.rating, "text": input.text.strip(),
           "author": user.get("name", "Client"), "user_id": user["id"], "created_at": now_utc()}
    await db.reviews.insert_one(doc)
    return clean_doc(doc)


# ---------- Questions / Réponses (aucune Q&R fictive) ----------

@api_router.get("/questions")
async def get_questions(request: Request, product_id: str):
    docs = await db.questions.find({"product_id": product_id}).sort("created_at", -1).to_list(200)
    return {"questions": [clean_doc(d) for d in docs]}


@api_router.post("/questions")
async def post_question(input: QuestionInput, request: Request):
    doc = {"product_id": input.product_id, "question": input.question.strip(),
           "email": input.email, "answer": None, "created_at": now_utc()}
    await db.questions.insert_one(doc)
    return clean_doc(doc)


# ---------- Newsletter / Contact ----------

@api_router.post("/newsletter")
async def newsletter(input: NewsletterInput):
    await db.newsletter.update_one({"email": input.email},
                                   {"$set": {"subscribed_at": now_utc()}}, upsert=True)
    return {"ok": True, "message": "Inscription enregistrée."}


@api_router.post("/contact")
async def contact(input: ContactInput):
    await db.contact_messages.insert_one(
        {"name": input.name, "email": input.email, "message": input.message, "created_at": now_utc()})
    return {"ok": True, "message": "Message reçu. Réponse à l'adresse indiquée."}


# ---------- Suivi de commande (structure prête, aucune fausse commande) ----------

@api_router.get("/orders/{number}")
async def track_order(number: str, email: str = ""):
    # À connecter à Shopify / transporteurs — aucune commande fictive
    return {"found": False, "number": number,
            "status": None,
            "message": "Commande introuvable. Structure prête pour la connexion du suivi réel."}


# ---------- Compte : récompense, adresses, profil ----------

@api_router.get("/account/rewards")
async def rewards(request: Request):
    user = await get_current_user(request)
    # Somme des achats confirmés associés au compte (structure prête pour Shopify)
    orders = await db.orders.find({"user_id": user["id"], "status": "confirmed"}).to_list(1000)
    spent = sum(float(o.get("total", 0)) for o in orders)
    return {"spent": spent, "threshold": REWARD_THRESHOLD, "coupon": REWARD_COUPON,
            "reached": spent >= REWARD_THRESHOLD,
            "guest_note": "Les achats en invité ne comptent pas tant qu'ils ne sont pas associés à un compte."}


@api_router.get("/account/addresses")
async def get_addresses(request: Request):
    user = await get_current_user(request)
    docs = await db.addresses.find({"user_id": user["id"]}).to_list(100)
    return {"addresses": [clean_doc(d) for d in docs]}


@api_router.post("/account/addresses")
async def add_address(input: AddressInput, request: Request):
    user = await get_current_user(request)
    doc = input.model_dump()
    doc["user_id"] = user["id"]
    doc["created_at"] = now_utc()
    res = await db.addresses.insert_one(doc)
    doc["_id"] = res.inserted_id
    return clean_doc(doc)


@api_router.delete("/account/addresses/{address_id}")
async def delete_address(address_id: str, request: Request):
    user = await get_current_user(request)
    await db.addresses.delete_one({"_id": ObjectId(address_id), "user_id": user["id"]})
    return {"ok": True}


@api_router.patch("/account/profile")
async def update_profile(input: ProfileInput, request: Request):
    user = await get_current_user(request)
    await db.users.update_one({"_id": ObjectId(user["id"])}, {"$set": {"name": input.name.strip()}})
    return {"id": user["id"], "name": input.name.strip(), "email": user["email"]}


@api_router.get("/reviews-summary")
async def reviews_summary():
    docs = await db.reviews.find().sort("created_at", -1).to_list(50)
    count = len(docs)
    avg = round(sum(r["rating"] for r in docs) / count, 1) if count else None
    return {"count": count, "average": avg, "latest": [clean_doc(d) for d in docs[:3]]}


# ---------- Legacy status ----------

@api_router.get("/")
async def root():
    return {"message": "ZEV SHOP API"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.login_attempts.create_index("identifier")
    await db.reviews.create_index("product_id")
    await db.questions.create_index("product_id")
    # Admin seed (idempotent — ne réécrase pas un mot de passe modifié dans l'app)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@zevshop.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "ZevAdmin2025!")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({"name": "Admin", "email": admin_email,
                                   "password_hash": hash_password(admin_password),
                                   "role": "admin", "created_at": now_utc()})
    logger.info("ZEV SHOP API démarrée")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
