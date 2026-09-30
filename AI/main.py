from fastapi import FastAPI, UploadFile, File, Form
from langgraph.types import Command
from pydantic import BaseModel
from typing import List
import uuid
import tempfile
import os
from app import graph
from utils.state import BaseMessages
from langchain_core.runnables import RunnableConfig
from fastapi.responses import FileResponse
from utils.speech_service import text_to_speech, speech_to_text
from fastapi import HTTPException
import shutil
from utils.models import stt_model, stt_model_name

app = FastAPI()


class StartRequest(BaseModel):
    role: str
    keywords: List[str] = []
    difficulty: str
    duration: int


@app.post("/interview/start")
def start_interview(payload: StartRequest):
    thread_id = str(uuid.uuid4())
    config: RunnableConfig = {"configurable": {"thread_id": thread_id}}

    initial_state: BaseMessages = {
        "messages": [],
        "role": payload.role,
        "keywords": payload.keywords,
        "difficulty": payload.difficulty,
        "duration": payload.duration,
        "questions": [],
        "current_idx": 0,
        "current_question": {"id": "", "question": "", "difficulty": ""},
        "user_response": [],
        "reference_answer": {},
        "evaluation": None,
        "followup_count": 0,
    }

    result = graph.invoke(initial_state, config=config)

    return {
        "thread_id": thread_id,
        "question": result["current_question"],
    }


@app.post("/interview/respond")
def respond(thread_id: str = Form(...), audio: UploadFile = File(...)):
    config: RunnableConfig = {"configurable": {"thread_id": thread_id}}

    state = graph.get_state(config)
    question_id = state.values["current_question"]["id"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp:
        temp.write(audio.file.read())
        temp_path = temp.name

    with open(temp_path, "rb") as f:
        whisper_result = stt_model.audio.transcriptions.create(
            file=(os.path.basename(temp_path), f.read()),
            model=stt_model_name,
            language="en",
            response_format="text",
        )

    transcript = (
        whisper_result if isinstance(whisper_result, str) else whisper_result.text
    )
    transcript = transcript.strip()

    os.remove(temp_path)

    print("TRANSCRIPT:", transcript)

    result = graph.invoke(Command(resume=transcript), config=config)

    state = graph.get_state(config)

    reference_answer = state.values.get("reference_answer", {}).get(question_id)

    if state.next == ():
        print(result.get("evaluation"))

        return {
            "status": "ended",
            "evaluation": result.get("evaluation"),
            "transcript": transcript,
            "reference_answer": reference_answer,
        }

    evaluation = result.get("evaluation")

    if evaluation is not None and evaluation.status == "followup":
        question_text = evaluation.followup_question
    else:
        question_text = result["current_question"]["question"]

    return {
        "status": "continue",
        "transcript": transcript,
        "question": question_text,
        "reference_answer": reference_answer,
    }
