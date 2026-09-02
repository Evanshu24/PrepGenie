from langchain_core.messages import AIMessage
from utils.state import BaseMessages


def AskFollowup(state: BaseMessages):
    if state["evaluation"] is not None:
        followup = state["evaluation"].followup_question
    else:
        followup = "can you explain this again?"  # placeholder for now
    print(f"\nInterviewer: {followup}")

    return {
        "messages": [AIMessage(content=followup)],
        "followup_count": state["followup_count"] + 1,
    }
