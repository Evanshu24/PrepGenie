from ddgs import DDGS

from utils.state import ReferenceAnswer


class DuckDuckGoFetcher:
    def __init__(self, max_results: int = 2):
        self.max_results = max_results

    def fetch(self, question: str) -> ReferenceAnswer:
        with DDGS() as ddgs:
            results = list(
                ddgs.text(
                    question,
                    max_results=self.max_results,
                )
            )

        if not results:
            return {
                "answer": "",
                "sources": [],
                "fetched": False,
            }

        answer = "\n\n".join(result["body"] for result in results if result.get("body"))

        sources = [result["href"] for result in results if result.get("href")]

        return {
            "answer": answer,
            "sources": sources,
            "fetched": True,
        }
