from pydantic import BaseModel
from typing import Literal


class EvaluationResult(BaseModel):
    status: Literal["followup", "complete", "skip"]
    followup_question: str
    feedback: str
    score: float
