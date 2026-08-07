from langchain_core.messages import HumanMessage
from utils.state import BaseMessages


def GetUserResponse(state: BaseMessages):
    response = input("You: ")

    return {"messages": [HumanMessage(content=response)]}
