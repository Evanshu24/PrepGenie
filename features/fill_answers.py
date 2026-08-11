from features.answer_agent import run_async_agents
import asyncio
import os
import json

questions_path = os.path.join("./data/interview.json")
answers_path = os.path.join("./data/answers.json")

with open(questions_path, "r") as f:
    stored_questions = json.load(f)

stored_answers = []
if os.path.exists(answers_path) and os.path.getsize(answers_path) > 0:
    with open(answers_path, "r") as f:
        try:
            stored_answers = json.load(f)
        except json.JSONDecodeError:
            print(
                f"[DEBUG] {answers_path} exists but contains invalid JSON — starting fresh"
            )
            stored_answers = []

# ids that previously failed — should be retried, not skipped
error_ids = {a["id"] for a in stored_answers if a["status"] == "error"}

# remove those error entries from stored_answers so they don't linger as bad data
stored_answers = [a for a in stored_answers if a["status"] != "error"]

answered_ids = {a["id"] for a in stored_answers}

# unanswered ids + previously-errored ids both need to be attempted
questions_list = [
    q for q in stored_questions if q["id"] not in answered_ids or q["id"] in error_ids
]

results = asyncio.run(run_async_agents(questions_list))

error_count = sum(1 for r in results if r["status"] == "error")
success_count = sum(1 for r in results if r["status"] != "error")
print(f"[DEBUG] {success_count} questions answered successfully, {error_count} failed")

stored_answers.extend(results)

with open(answers_path, "w") as f:
    json.dump(stored_answers, f, indent=2)
