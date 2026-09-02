from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from utils.models import model
from .prompts import SYSTEM_PROMPT
from .schemas import EvaluationResult

evaluation_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        (
            "human",
            """Interview Question:
{question}

Reference Answer:
{reference_answer}
""",
        ),
        MessagesPlaceholder("messages"),
    ]
)

structured_llm = evaluation_prompt | model.with_structured_output(
    EvaluationResult,
    method="json_schema",
)
