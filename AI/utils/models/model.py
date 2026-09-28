from dotenv import load_dotenv
import os

load_dotenv()

print("[DEBUG] GOOGLE_API_KEY loaded:", bool(os.getenv("GOOGLE_API_KEY")))
print("[DEBUG] OPENAI_API_KEY loaded:", bool(os.getenv("OPENAI_API_KEY")))
print("[DEBUG] GROQ_API_KEY loaded:", bool(os.getenv("GROQ_API_KEY")))

from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_groq import ChatGroq

# from langchain_openai import ChatOpenAI


# ============================================================
# Interview Model — Qwen3-32B
# ============================================================

interview_model_repo = "Qwen/Qwen3-32B"

interview_model_endpoint = HuggingFaceEndpoint(
    model=interview_model_repo,
    task="text-generation",
    temperature=0.5,
    max_new_tokens=2048,
)

print(
    f"[DEBUG][models.py] Interview model loaded: "
    f"repo={interview_model_repo}, "
    f"max_new_tokens={interview_model_endpoint.max_new_tokens}"
)

model = ChatHuggingFace(llm=interview_model_endpoint)

print(
    f"[DEBUG][models.py] Interview model wrapper created: "
    f"repo={interview_model_repo}"
)


# ============================================================
# Agent Model
# ============================================================

agent_model_name = "openai/gpt-oss-safeguard-20b"

agent_model = ChatGroq(
    model=agent_model_name,
    temperature=0.4,
    max_tokens=2048,
)

print(f"[DEBUG][models.py] Agent model loaded: " f"model={agent_model_name}")

# ============================================================
# Analyzer Model
# ============================================================

analyzer_model_name = "openai/gpt-oss-safeguard-20b"

analyzer_model = ChatGroq(
    model=agent_model_name,
    temperature=0.4,
    max_tokens=2048,
)

print(f"[DEBUG][models.py] Analyzer model loaded: " f"model={analyzer_model_name}")

from groq import Groq

# ============================================================
# Speech-to-Text Model (Whisper via Groq)
# ============================================================
stt_model_name = "whisper-large-v3-turbo"

stt_model = Groq(api_key=os.getenv("GROQ_API_KEY"))

print(f"[DEBUG][models.py] STT model loaded: {stt_model_name}")
