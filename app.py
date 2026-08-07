from langgraph.graph import StateGraph, END, START
from langchain_core.runnables import RunnableConfig
from langgraph.checkpoint.memory import MemorySaver
from utils.state import BaseMessages
from utils.nodes import (
    EvaluateResponse,
    FetchQuestions,
    InitializeInterview,
    AskQuestion,
    GetUserResponse,
    PrefetchAnswers,
    AdvanceState,
    AskFollowup,
)
from utils.routers import EvaluationRouter, InterviewRouter
from data.runnable import config
from dotenv import load_dotenv

env_loaded = load_dotenv()

builder = StateGraph(state_schema=BaseMessages)

builder.add_node("fetch_questions", FetchQuestions)
builder.add_node("intitialize_interview", InitializeInterview)
builder.add_node("ask_question", AskQuestion)
builder.add_node("get_user_response", GetUserResponse)
builder.add_node("prefetch_answers", PrefetchAnswers)
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
    {"continue": "ask_question", "prefetch": "prefetch_answers", "end": END},
)

builder.add_conditional_edges(
    "evaluate_response",
    EvaluationRouter,
    {"followup": "ask_followup", "next_question": "advance_state", "end": END},
)

memory = MemorySaver()
graph = builder.compile(checkpointer=memory)
print(graph.get_graph().print_ascii())

available = [
    "Backend Developer",
    "Frontend Developer",
    "Database Administrator",
    "Machine Learning Engineer",
]

print("Please choose the role you are applying for:\n")

for idx, role in enumerate(available):
    print(f"{idx}. {role}")

while True:
    try:
        idx = int(input("Enter your choice: "))
        role = available[idx]
        break
    except ValueError:
        print("Please enter a valid integer.")
    except KeyError:
        print("Please choose one of the listed options.")

keywords = []

print("\nEnter up to 5 keywords (press Enter to finish):")

while len(keywords) < 5:
    word = input(f"Keyword {len(keywords) + 1}: ").strip()

    if not word:
        break

    keywords.append(word)

initial_state: BaseMessages = {
    "messages": [],
    "role": role,
    "keywords": keywords,
    "questions": [],
    "current_idx": 0,
    "current_question": {
        "id": "",
        "question": "",
        "difficulty": "",
    },
    "user_response": [],
    "reference_answer": {},
    "evaluation": None,
    "followup_count": 0,
}

try:
    result = graph.invoke(initial_state, config=config)
except Exception as e:
    raise RuntimeError("Interview graph execution failed") from e
