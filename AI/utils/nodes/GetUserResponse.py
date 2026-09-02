from langchain_core.messages import HumanMessage
from utils.state import BaseMessages
from langgraph.types import interrupt


def GetUserResponse(state: BaseMessages):
    response = interrupt({"prompt": "awaiting_user_response"})
    return {"messages": [HumanMessage(content=response)]}
