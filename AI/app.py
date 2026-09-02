from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.memory import MemorySaver
from utils.state import BaseMessages
from utils.nodes import (
    EvaluateResponse,
    FetchQuestions,
    InitializeInterview,
    AskQuestion,
    GetUserResponse,
    AdvanceState,
    AskFollowup,
)
from utils.routers import EvaluationRouter, InterviewRouter
from dotenv import load_dotenv

load_dotenv()

builder = StateGraph(state_schema=BaseMessages)
builder.add_node("fetch_questions", FetchQuestions)
builder.add_node("intitialize_interview", InitializeInterview)
builder.add_node("ask_question", AskQuestion)
builder.add_node("get_user_response", GetUserResponse)
builder.add_node("evaluate_response", EvaluateResponse)
builder.add_node("advance_state", AdvanceState)
builder.add_node("ask_followup", AskFollowup)

builder.add_edge(START, "fetch_questions")
builder.add_edge("fetch_questions", "intitialize_interview")
builder.add_edge("ask_question", "get_user_response")
builder.add_edge("get_user_response", "evaluate_response")
builder.add_edge("advance_state", "intitialize_interview")
builder.add_edge("ask_followup", "get_user_response")

builder.add_conditional_edges(
    "intitialize_interview",
    InterviewRouter,
    {"continue": "ask_question", "end": END},
)
builder.add_conditional_edges(
    "evaluate_response",
    EvaluationRouter,
    {"followup": "ask_followup", "next_question": "advance_state", "end": END},
)

memory = MemorySaver()
graph = builder.compile(checkpointer=memory)
