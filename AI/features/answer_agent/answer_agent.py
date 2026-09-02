from features.tools import crawl_page, ddg_search
import asyncio
from typing import Dict
from utils.models import agent_model
from langgraph.prebuilt import create_react_agent

tools = [crawl_page, ddg_search]

SYSTEM_PROMPT = """
You are an AI research assistant.
Decide first whether you already know the answer confidently and it is unlikely to have changed recently (stable facts, established concepts, historical information). If so, answer directly from your own knowledge — do not call any tools.
Only use tools when the question involves:
- Recent events, releases, or updates (e.g. "latest", "newest", "current")
- Specific facts you are not confident about
- Information that changes over time (versions, prices, statuses, ongoing situations)
Tool usage rules (only when tools are needed):
1. ddg_search — use to find relevant pages. Never answer from search snippets alone.
2. crawl_page — use to read the actual content of a promising result. If a page fails or is irrelevant, try the next one.
Efficiency rules:
- Use at most 1 search and 1-2 page crawls per question. Do not keep searching once you have enough information to answer.
- Do not crawl more pages than necessary to confirm the answer.
- Keep your final answer concise and to the point — no filler, no repetition, no unnecessary background.
Output rules:
- Never include URLs, links, or source names in your final answer.
- Answer only in plain text, synthesized in your own words.
- Do not mention that you searched or which tools you used.
"""

agent = create_react_agent(model=agent_model, tools=tools, prompt=SYSTEM_PROMPT)


def extract_text(content) -> str:
    """Normalize LangChain message content into a plain string,
    handling both plain-string and list-of-content-block formats."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
            elif isinstance(block, str):
                parts.append(block)
        return "".join(parts)
    return str(content)


async def run_agent(q_id: str, question: str, sem: asyncio.Semaphore) -> dict:
    "Run the agent on a single task and return a structured result"
    async with sem:  # blocks here if max concurrency is already reached
        try:
            result = await agent.ainvoke(
                {"messages": [("user", question)]}, config={"recursion_limit": 6}
            )
            answer = extract_text(result["messages"][-1].content)
            return {"id": q_id, "answer": answer, "status": "ok"}
        except Exception as e:
            return {
                "id": q_id,
                "answer": None,
                "status": "error",
                "error": str(e),
            }


async def run_async_agents(questions: list):
    sem = asyncio.Semaphore(4)
    tasks = [run_agent(q["id"], q["question"], sem) for q in questions]
    results = await asyncio.gather(*tasks)
    return results


# if __name__ == "__main__":
#     questions = [
#         "What was announced in the latest LangGraph release?",
#         "What is the latest version of LangChain?",
#         "What are the newest features in Claude Agent SDK?",
#     ]
#     asyncio.run(main(questions))
