from pathlib import Path
import sys
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, File, HTTPException, UploadFile, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from predict import load_model, predict_pil_image
from dotenv import load_dotenv
import os

PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.append(str(BACKEND_DIR))


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

app = FastAPI(title="Plant Disease Prediction API")
app.add_middleware(
    CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://192.168.100.110:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
users_collection = db["users"]
metrics = db["metrics"]
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Metrics(BaseModel):
    epoch: int
    train_acc: float
    train_loss: float
    val_acc: float
    val_loss: float
    val_precision: float
    val_recall: float
    val_f1: float

model = None
classes = None

@app.on_event("startup")
def startup_event():
    global model, classes
    model, classes = load_model()

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=60))
    to_encode.update({"exp": expire})
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Plant disease prediction API is running"}

@app.get("/metrics", response_model=list[Metrics])
def get_metrics():
    print("Fetching training metrics from MongoDB...")
    return list(metrics.find({}, {"_id": 0}).sort("epoch", 1))
@app.post("/register")
def register(user: UserRegister):
    print(f"Register request received: username={user.username}, email={user.email}")
    if users_collection.find_one({"username": user.username}):
        print("Register failed: username exists", user.username)
        raise HTTPException(status_code=400, detail="Username already exists")
    if users_collection.find_one({"email": user.email}):
        print("Register failed: email exists", user.email)
        raise HTTPException(status_code=400, detail="Email already registered")
    try:
        users_collection.insert_one({
            "username": user.username,
            "email": user.email,
            "password": hash_password(user.password),
            "created_at": datetime.utcnow()
        })
    except Exception as exc:
        print("Register error inserting user:", exc)
        raise HTTPException(status_code=500, detail="Internal server error")
    print("User registered:", user.username)
    return {"message": "Account created successfully"}

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"Login attempt for: {form_data.username}")
    user = users_collection.find_one({"username": form_data.username})
    print("User record found:", bool(user))
    if user:
        stored = user.get("password", "")
        print("Stored password hash preview:", stored[:30])
        ok = verify_password(form_data.password, stored)
        print("Password verify result:", ok)
        if not ok:
            raise HTTPException(status_code=401, detail="Incorrect username or password")
    else:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_token({"sub": user["username"]}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}


@app.get("/debug/users")
def debug_users():
    """Development helper: list all users (no _id)"""
    try:
        return list(users_collection.find({}, {"_id": 0}))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    if model is None or classes is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid image file")
    try:
        from PIL import Image
        from io import BytesIO
        contents = await file.read()
        image = Image.open(BytesIO(contents)).convert("RGB")
        predictions = predict_pil_image(image, model=model, classes=classes, top_k=3)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not process image: {exc}")
    best = predictions[0]
    return {
        "prediction": best["class_name"],
        "confidence": round(best["confidence"], 4),
        "top_predictions": predictions,
    }