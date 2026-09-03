from fastapi import FastAPI
from langgraph.types import Command
from pydantic import BaseModel
from typing import List
import uuid
from app import graph
from utils.state import BaseMessages
from langchain_core.runnables import RunnableConfig
from fastapi import UploadFile, File
from fastapi.responses import FileResponse
from utils.speech_service import text_to_speech, speech_to_text
from fastapi import HTTPException
import os
import shutil

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


@app.post("/interview/tts")
def get_question_audio(text: str):
    target_path = os.path.join("data", "output_question.mp3")
    
    audio_path = text_to_speech(text, output_path=target_path)
    return FileResponse(audio_path, media_type="audio/mpeg", filename="question.mp3")


@app.post("/interview/stt")
async def transcribe_answer(file: UploadFile = File(...)):
    # Validate file extension
    if not file.filename.lower().endswith(".wav"):
        raise HTTPException(
            status_code=400, 
            detail="Invalid file format. Please upload a .wav audio file."
        )

    temp_file_path = os.path.join("data", f"temp_{file.filename}")
    
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    transcribed_text = speech_to_text(temp_file_path)
    
    if os.path.exists(temp_file_path):
        os.remove(temp_file_path)
        
    return {"transcribed_answer": transcribed_text}