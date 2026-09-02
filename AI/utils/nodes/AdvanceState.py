from utils.state import BaseMessages
from langchain_core.messages import RemoveMessage


def AdvanceState(state: BaseMessages) -> BaseMessages:
    state["current_idx"] += 1
    state["followup_count"] = 0
    state["messages"] = [RemoveMessage(id=m.id) for m in state["messages"]]
    return state
