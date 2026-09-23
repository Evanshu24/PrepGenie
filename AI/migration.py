import json
from db import questions_collection, allowed_collection

with open("./data/interview.json", "r") as f:
    data = json.load(f)

questions_collection.delete_many({})
questions_collection.insert_many(data)
print(f"Inserted {len(data)} questions")

roles = set()
keywords = set()

for item in data:
    for name in item["role"]:
        roles.add(name)

    for keyword in item["tags"]:
        keywords.add(keyword)

    for keyword in item["expected_topics"]:
        keywords.add(keyword)

allowed_data = {"roles": list(roles), "keywords": list(keywords)}

allowed_collection.delete_many({})
allowed_collection.insert_one(allowed_data)  # Changed insert_many to insert_one

print(
    f"Inserted {len(allowed_data['roles'])} roles and {len(allowed_data['keywords'])} keywords"
)
