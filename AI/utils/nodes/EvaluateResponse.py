from utils.state import BaseMessages
from utils.llm import build_evaluation_prompt, structured_llm, EvaluationResult
from data.runnable import config
import json
import os

_answers_cache = None


def _load_answers():
    global _answers_cache
    if _answers_cache is None:
        path = os.path.join("./data/answers.json")
        with open(path, "r") as f:
            data = json.load(f)
        _answers_cache = {item["id"]: item for item in data}
    return _answers_cache


def _get_reference_answer(question_id: str):
    answers = _load_answers()
    entry = answers.get(question_id)

    if entry is None or entry.get("answer") is None or entry.get("status") == "error":
        return {
            "answer": "No reference answer available — evaluate based on general correctness and clarity.",
            "sources": [],
            "fetched": False,
        }

    return {
        "answer": entry["answer"],
        "sources": entry.get("sources", []),
        "fetched": True,
    }


def EvaluateResponse(state: BaseMessages) -> BaseMessages:
    question = state["current_question"]
    question_id = question["id"]

    reference_answer = _get_reference_answer(question_id)
    state["reference_answer"][question_id] = reference_answer

    messages = build_evaluation_prompt(
        question=question["question"],
        reference_answer=reference_answer["answer"],
        messages=state["messages"],
    )
    try:
        result = structured_llm.invoke(
            {
                "question": question["question"],
                "reference_answer": reference_answer["answer"],
                "messages": messages,
            },
            config,
        )
    except Exception:
        try:
            raw_llm = (
                getattr(structured_llm, "first", None)
                or getattr(structured_llm, "steps", [None])[0]
            )
            if raw_llm is not None:
                raw_llm.invoke(messages)
        except Exception:
            pass
        raise

    if isinstance(result, dict):
        result = EvaluationResult(**result)

    state["evaluation"] = result
    return state
