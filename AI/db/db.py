from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
try:
    client.admin.command("ping")
    print("Connection established")
except Exception as e:
    print(e)

db = client["prepgenie"]
questions_collection = db["questions"]
