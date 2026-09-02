from utils.state import BaseMessages


def InterviewRouter(state: BaseMessages):
    if state["current_idx"] == len(state["questions"]) - 1 or state["current_idx"] == 4:
        return "end"
    return "continue"
