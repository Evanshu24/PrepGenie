from langchain_core.tools import tool
from ddgs import DDGS
import json


@tool
def ddg_search(query: str) -> str:
    """
    Search DuckDuckGo and return titles and URLs.
    """

    with DDGS() as ddgs:
        results = list(ddgs.text(query, max_results=5))
    result = json.dumps([{"title": r["title"], "url": r["href"]} for r in results])
    return result
