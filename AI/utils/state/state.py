from typing import TypedDict, List, Annotated, Optional, Literal
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage
from utils.llm import EvaluationResult


class BaseMessages(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    role: Annotated[str, "Role for the interview"]
    keywords: Annotated[List[str], "List of keywords generated from parsing the resume"]
    questions: Annotated[List[Question], "List of questions from the question bank"]
    current_idx: Annotated[int, "index of current question"]
    current_question: Annotated[
        Question, "The current question being asked to the user"
    ]
    user_response: Annotated[List[str], "List of response strings from the user"]
    reference_answer: Annotated[
        dict[str, ReferenceAnswer],
        "Maps question IDs to their fetched reference answers.",
    ]
    evaluation: Annotated[
        EvaluationResult | None,
        "Latest evaluation of the current interview question.",
    ]

    followup_count: Annotated[
        int,
        "Number of follow-up questions asked for the current question.",
    ]


class Question(TypedDict):
    id: str
    question: str
    difficulty: str


class ReferenceAnswer(TypedDict):
    answer: str
    sources: List[str]
    fetched: bool
