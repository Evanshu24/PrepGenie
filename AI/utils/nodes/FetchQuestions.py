from utils.state import BaseMessages, Question
from typing import List
from db import questions_collection


def get_question_count(duration: int) -> int:
    """
    Calculate number of questions based on interview duration.

    15 min = 2 questions
    30 min = 4 questions
    45 min = 6 questions
    60 min = 8 questions
    """
    try:
        minutes = int(duration)
    except (ValueError, TypeError):
        minutes = 30

    return max(minutes // 15, 1) * 2


def Questions_Fetcher(
    keywords: List[str],
    role: str,
    difficulty: str,
    duration: int,
) -> List[Question]:

    keywords = [k.lower() for k in keywords]
    role = role.lower()
    difficulty = (difficulty or "").lower()

    limit = get_question_count(duration)

    question_bank_data = list(
        questions_collection.find(
            {
                "role": {
                    "$regex": f"^{role}$",
                    "$options": "i",
                }
            }
        )
    )

    store = []

    for i in question_bank_data:
        tags = i.get("tags", [])

        keywords_match = sum(1 for t in tags if t.lower() in keywords)

        keywords_match /= len(tags) if tags else 1

        roles = i.get("role", [])

        # Handle role stored as string or list
        if isinstance(roles, str):
            roles = [roles]

        role_match = sum(1 for r in roles if r.lower() == role)

        role_match /= len(roles) if roles else 1

        difficulty_match = 1.0 if i.get("difficulty", "").lower() == difficulty else 0.0

        if role_match > 0:
            store.append(
                [
                    role_match,
                    keywords_match,
                    difficulty_match,
                    i,
                ]
            )

    store.sort(
        key=lambda x: (
            x[0] + x[1] + x[2],
            x[2],
            x[1],
        ),
        reverse=True,
    )

    questions_store = []

    for item in store[:limit]:
        q = item[3]

        questions_store.append(
            {
                "id": q["id"],
                "question": q["question"],
                "difficulty": q["difficulty"],
            }
        )

    return questions_store


def FetchQuestions(state: BaseMessages) -> BaseMessages:

    state["questions"] = Questions_Fetcher(
        state["keywords"],
        state["role"],
        state.get("difficulty", ""),
        state.get("duration", 30),
    )

    return state
