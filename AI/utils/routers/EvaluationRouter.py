from utils.state import BaseMessages

MAX_FOLLOWUPS = 3


def EvaluationRouter(state: BaseMessages):
    evaluation = state["evaluation"]

    if evaluation is None:
        return "end"

    if evaluation.status == "complete":
        return "next_question"

    if evaluation.status == "skip":
        return "next_question"
    if evaluation.status == "followup" and state["followup_count"] < MAX_FOLLOWUPS:
        return "followup"
    return "next_question"
