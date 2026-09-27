import json
from db import questions_collection, allowed_collection, required_skills

with open("./data/interview.json", "r") as f:
    data = json.load(f)

questions_collection.delete_many({})
questions_collection.insert_many(data)
print(f"Inserted {len(data)} questions")

roles = set()
keywords = set()
role_data = {}

for item in data:
    for role in item["role"]:
        roles.add(role)

        if role not in role_data:
            role_data[role] = []

        for keyword in item["tags"]:
            role_data[role].append(keyword)
            keywords.add(keyword)

        for keyword in item["expected_topics"]:
            role_data[role].append(keyword)
            keywords.add(keyword)


for role in roles:
    print(f"The role: {role} contains {len(role_data[role])} keywords")

allowed_data = {"roles": list(roles), "keywords": list(keywords)}

allowed_collection.delete_many({})
allowed_collection.insert_one(allowed_data)

# print(roles)
#
# print(keywords)
#
# print(role_data)

required_skills_docs = [
    {"role": role, "skills": list(set(skills))} for role, skills in role_data.items()
]

required_skills.delete_many({})
if required_skills_docs:
    required_skills.insert_many(required_skills_docs)

print(
    f"Inserted {len(allowed_data['roles'])} roles and {len(allowed_data['keywords'])} keywords"
)

print(f"Inserted {len(required_skills_docs)} roles and skills required for them")
