# migrate_questions.py
import json
from db import questions_collection

with open("./data/interview.json", "r") as f:
    data = json.load(f)

questions_collection.delete_many({})  # clear if re-running
questions_collection.insert_many(data)
print(f"Inserted {len(data)} questions")
