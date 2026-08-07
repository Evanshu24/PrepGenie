from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

model_repo = "deepseek-ai/DeepSeek-V4-Flash-0731"
model_endpoint = HuggingFaceEndpoint(
    model=model_repo,
    task="text-generation",
    temperature=0.5,
    max_new_tokens=2048,  # raised from (implicit) default ~512 so reasoning + JSON output both fit
)
print(
    f"[DEBUG][models.py] HuggingFaceEndpoint created: repo={model_repo}, max_new_tokens=2048"
)

model = ChatHuggingFace(llm=model_endpoint)
print("[DEBUG][models.py] ChatHuggingFace model wrapper created")
