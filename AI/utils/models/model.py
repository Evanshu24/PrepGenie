from dotenv import load_dotenv
import os

load_dotenv()

print("[DEBUG] GOOGLE_API_KEY loaded:", bool(os.getenv("GOOGLE_API_KEY")))
print("[DEBUG] OPENAI_API_KEY loaded:", bool(os.getenv("OPENAI_API_KEY")))

from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_google_genai import ChatGoogleGenerativeAI

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
# Agent Model — Google Gemini (Free Tier)
# ============================================================

agent_model_name = "gemini-3.6-flash"

agent_model = ChatGoogleGenerativeAI(
    model=agent_model_name,
    temperature=0.4,
    max_output_tokens=2048,
)

print(f"[DEBUG][models.py] Agent model loaded: " f"model={agent_model_name}")


# interview_model_repo = "deepseek-ai/DeepSeek-V4-Flash-0731"
#
# interview_model_endpoint = HuggingFaceEndpoint(
#     model=interview_model_repo,
#     task="text-generation",
#     temperature=0.5,
#     max_new_tokens=2048,
# )
#
# print(
#     f"[DEBUG][models.py] HuggingFaceEndpoint created: "
#     f"repo={interview_model_repo}, "
#     f"max_new_tokens={interview_model_endpoint.max_new_tokens}"
# )
#
# model = ChatHuggingFace(llm=interview_model_endpoint)


# agent_model_repo = "Qwen/Qwen3-32B"
#
# agent_model_endpoint = HuggingFaceEndpoint(
#     model=agent_model_repo,
#     task="text-generation",
#     temperature=0.2,
#     max_new_tokens=2048,
# )
#
# print(
#     f"[DEBUG][models.py] HuggingFaceEndpoint created: "
#     f"repo={agent_model_repo}, "
#     f"max_new_tokens={agent_model_endpoint.max_new_tokens}"
# )
#
# agent_model = ChatHuggingFace(llm=agent_model_endpoint)


# agent_model_name = "gpt-4o-mini"
#
# agent_model = ChatOpenAI(
#     model=agent_model_name,
#     temperature=0.4,
#     max_tokens=2048,
# )
#
# print(
#     f"[DEBUG][models.py] OpenAI agent model wrapper created: "
#     f"model={agent_model_name}"
# )
