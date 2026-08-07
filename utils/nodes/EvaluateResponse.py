from utils.state import BaseMessages
from utils.managers import answer_manager
from utils.llm import build_evaluation_prompt, structured_llm, EvaluationResult
from data.runnable import config


def EvaluateResponse(state: BaseMessages) -> BaseMessages:
    question = state["current_question"]
    question_id = question["id"]

    reference_answer = answer_manager.get(question_id)
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
