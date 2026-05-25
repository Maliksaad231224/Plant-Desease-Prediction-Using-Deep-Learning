from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
metrics = db["metrics"]

def seed_metrics():
    with open("history.json", "r") as f:
        history = json.load(f)
        
    metrics.insert_many(history)

seed_metrics()