from utils.state import BaseMessages
from utils.managers import answer_manager


def PrefetchAnswers(state: BaseMessages):
    for question in state["questions"]:
        answer_manager.launch(question)
    return
