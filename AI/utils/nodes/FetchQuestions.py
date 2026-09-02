from utils.state import BaseMessages, Question
from typing import List
from db import questions_collection


def Questions_Fetcher(keywords: List[str], role: str) -> List[Question]:
    keywords = [k.lower() for k in keywords]
    role = role.lower()

    question_bank_data = list(
        questions_collection.find({"role": {"$regex": f"^{role}$", "$options": "i"}})
    )

    store = []
    for i in question_bank_data:
        keywords_match = 0.0
        for word in i["tags"]:
            if word.lower() in keywords:
                keywords_match += 1
        keywords_match /= len(i["tags"]) if i["tags"] else 1

        role_match = 0.0
        for each_role in i["role"]:
            if each_role.lower() == role:
                role_match += 1
        role_match /= len(i["role"]) if i["role"] else 1

        if role_match > 0:
            store.append([role_match, keywords_match, i])

    store.sort(key=lambda x: (x[0] + x[1], x[1]), reverse=True)

    questions_store = []
    for i in store:
        if len(questions_store) >= 5:
            break
        questions_store.append(
            {
                "id": i[2]["id"],
                "question": i[2]["question"],
                "difficulty": i[2]["difficulty"],
            }
        )
    return questions_store


def FetchQuestions(state: BaseMessages) -> BaseMessages:
    state["questions"] = Questions_Fetcher(state["keywords"], state["role"])
    return state
