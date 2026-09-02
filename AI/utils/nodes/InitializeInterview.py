from utils.state import BaseMessages


def InitializeInterview(state: BaseMessages) -> BaseMessages:
    # print(state["questions"])
    # print(state["current_idx"])
    idx = state["current_idx"]
    state["current_question"] = state["questions"][idx]
    return state
