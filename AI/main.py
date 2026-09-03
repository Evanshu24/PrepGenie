from fastapi import FastAPI
from langgraph.types import Command
from pydantic import BaseModel
from typing import List
import uuid
from app import graph
from utils.state import BaseMessages
from langchain_core.runnables import RunnableConfig

app = FastAPI()


class StartRequest(BaseModel):
    role: str
    keywords: List[str] = []


class ResponsRequest(BaseModel):
    thread_id: str
    answer: str


@app.post("/interview/start")
def start_interview(payload: StartRequest):
    thread_id = str(uuid.uuid4())
    config: RunnableConfig = {"configurable": {"thread_id": thread_id}}

    initial_state: BaseMessages = {
        "messages": [],
        "role": payload.role,
        "keywords": payload.keywords,
        "questions": [],
        "current_idx": 0,
        "current_question": {"id": "", "question": "", "difficulty": ""},
        "user_response": [],
        "reference_answer": {},
        "evaluation": None,
        "followup_count": 0,
    }

    result = graph.invoke(initial_state, config=config)
    return {"thread_id": thread_id, "question": result["current_question"]}


@app.post("/interview/respond")
def respond(payload: ResponsRequest):
    config: RunnableConfig = {"configurable": {"thread_id": payload.thread_id}}
    result = graph.invoke(Command(resume=payload.answer), config=config)

    state = graph.get_state(config)
    if state.next == ():
        return {"status": "ended", "evaluation": result.get("evaluation")}

    evaluation = result.get("evaluation")
    if evaluation is not None and evaluation.status == "followup":
        question_text = evaluation.followup_question
    else:
        question_text = result["current_question"]["question"]

    return {"question": question_text}
