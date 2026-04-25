from __future__ import annotations

import os
from uuid import uuid4

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import GroupInfo, MatchResponse, Plan, ResultResponse, SubmitRequest, SubmitResponse

app = FastAPI(title="Social Detox MVP API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage only.
users: list[dict[str, object]] = []
results_by_session: dict[str, ResultResponse] = {}


def compatibility_score(answers1: list[int], answers2: list[int]) -> int:
    """Return a compatibility score from 0 to 100."""
    if not answers1 or not answers2:
        return 0

    paired = list(zip(answers1, answers2))
    if not paired:
        return 0

    distance = sum(abs(a - b) for a, b in paired)
    max_distance = len(paired) * 4
    raw_score = 100 - (distance / max_distance) * 100
    return max(0, min(100, int(raw_score)))


def choose_group_name(score: int) -> str:
    if score > 80:
        return "Deep Connectors"
    if score > 60:
        return "Balanced Explorers"
    return "Casual Circle"


def build_personality_summary(answers: list[int]) -> str:
    if not answers:
        return (
            "You value steady, intentional connection and a gentle social pace. "
            "You tend to build trust through consistency and clear communication."
        )

    average_answer = sum(answers) / len(answers)

    if average_answer <= 2.5:
        return (
            "You value meaningful conversations and prefer depth over noise. "
            "You feel most comfortable in calm spaces where people listen carefully. "
            "You bring thoughtful energy that helps others feel grounded."
        )
    if average_answer <= 3.5:
        return (
            "You naturally balance reflection with openness in social settings. "
            "You enjoy shared activities with structure and room for genuine conversation. "
            "You help groups stay connected, practical, and welcoming."
        )

    return (
        "You bring warm momentum and positive initiative to group experiences. "
        "You enjoy active plans and respond well to collaborative challenges. "
        "You help others engage while keeping the atmosphere encouraging and inclusive."
    )


def build_activity_plan(score: int, answers: list[int]) -> Plan:
    avg_answer = (sum(answers) / len(answers)) if answers else 3

    if score > 80:
        if avg_answer >= 3:
            return Plan(
                icebreaker="Each person shares one offline moment that felt unexpectedly joyful.",
                activity="Take a 20-minute neighborhood walk in pairs, then regroup and exchange highlights.",
                closing="Set one shared intention for staying connected offline this week.",
            )
        return Plan(
            icebreaker="Share one small ritual that helps you slow down after a busy day.",
            activity="Host a guided reflection round with prompt cards and short partner check-ins.",
            closing="Name one meaningful conversation you want to have before next weekend.",
        )

    if score > 60:
        return Plan(
            icebreaker="Introduce yourself with a hobby you'd like to do more often offline.",
            activity="Do a light collaborative task (board game or mini-creative prompt) followed by discussion.",
            closing="Each member chooses one practical digital-boundary goal for the next 3 days.",
        )

    return Plan(
        icebreaker="Share one thing that helps you feel comfortable in a new group.",
        activity="Start with short one-on-one chats, then rotate to find shared interests as a full group.",
        closing="Agree on a low-pressure follow-up activity and pick a tentative time window.",
    )


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "Backend is running"}


@app.post("/api/submit", response_model=SubmitResponse)
def submit_answers(payload: SubmitRequest) -> SubmitResponse:
    session_id = str(uuid4())

    users.append(
        {
            "session_id": session_id,
            "answers": payload.answers,
        }
    )

    # New submission can affect matching quality, so reset previous computed results.
    results_by_session.clear()

    return SubmitResponse(session_id=session_id)


@app.post("/api/match", response_model=MatchResponse)
def match_users() -> MatchResponse:
    if len(users) < 2:
        return MatchResponse(
            message="Need at least 2 users before matching can run.",
            groups_created=0,
            users_processed=len(users),
            groups=[],
        )

    results_by_session.clear()
    groups: list[GroupInfo] = []

    for user in users:
        current_id = str(user["session_id"])
        current_answers = list(user["answers"])

        comparisons: list[tuple[str, int]] = []
        for other in users:
            other_id = str(other["session_id"])
            if other_id == current_id:
                continue

            score = compatibility_score(current_answers, list(other["answers"]))
            comparisons.append((other_id, score))

        comparisons.sort(key=lambda item: item[1], reverse=True)

        top_matches = comparisons[:4]
        if len(top_matches) >= 3:
            top_matches = top_matches[:4]

        matched_ids = [match_id for match_id, _ in top_matches]
        group_members = [current_id, *matched_ids]

        average_score = int(sum(score for _, score in top_matches) / len(top_matches)) if top_matches else 0
        group_name = choose_group_name(average_score)

        groups.append(
            GroupInfo(
                group_members=group_members,
                average_score=average_score,
                group_name=group_name,
            )
        )

        results_by_session[current_id] = ResultResponse(
            group_name=group_name,
            score=average_score,
            personality=build_personality_summary(current_answers),
            group_members=group_members,
            activity_plan=build_activity_plan(average_score, current_answers),
        )

    return MatchResponse(
        message="Matching complete",
        groups_created=len(groups),
        users_processed=len(users),
        groups=groups,
    )


@app.get("/api/result/{session_id}", response_model=ResultResponse)
def get_result(session_id: str) -> ResultResponse:
    if not any(str(user["session_id"]) == session_id for user in users):
        raise HTTPException(status_code=404, detail="Session not found")

    result = results_by_session.get(session_id)
    if not result:
        raise HTTPException(status_code=409, detail="No matching result yet. Run /api/match first.")

    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "10000")))
