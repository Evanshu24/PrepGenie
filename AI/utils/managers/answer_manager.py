from utils.state import BaseMessages, Question, ReferenceAnswer
from typing import Dict
from concurrent.futures import ThreadPoolExecutor, Future
from utils.fetcher import DuckDuckGoFetcher

fetcher = DuckDuckGoFetcher()


class AnswerManager:
    def __init__(self, fetcher, max_workers: int = 3):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.tasks: Dict[str, Future] = {}
        self.fetcher = fetcher

    def launch(self, question: Question):
        question_id = question["id"]

        if question_id in self.tasks:
            return

        future = self.executor.submit(self.fetcher.fetch, question["question"])
        self.tasks[question_id] = future

    def get(self, question_id: str) -> ReferenceAnswer:
        future = self.tasks[question_id]
        answer = future.result()
        return answer

    def shutdown(self):
        self.executor.shutdown(wait=True)


answer_manager = AnswerManager(fetcher)

# answer_manager.launch(
#     {
#         "id": "q_199",
#         "question": "What is database sharding and what are its main challenges?",
#         "difficulty": "hard",
#     }
# )
# output = answer_manager.get("q_199")
# print(output)
