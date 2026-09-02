from utils.state import BaseMessages
from langchain_core.messages import AIMessage


def AskQuestion(state: BaseMessages):
    question = state["current_question"]["question"]

    print(f"\nInterviewer: {question}")
    return {"messages": [AIMessage(content=question)]}
