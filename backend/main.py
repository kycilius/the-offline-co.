from __future__ import annotations

import os
from uuid import uuid4

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ai import activity_for_score, answers_to_vector, build_groups, vector_score
from models import GroupRecord, MatchResponse, ResultResponse, SubmitRequest, SubmitResponse, UserRecord

app = FastAPI(title="Social Detox MVP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (MVP/hackathon simple setup)
users: dict[str, UserRecord] = {}
groups: dict[str, GroupRecord] = {}
user_to_group: dict[str, str] = {}


def build_demo_result(session_id: str) -> ResultResponse:
    """Return a default demo group when there are fewer than 3 users."""
    return ResultResponse(
        group=["Demo User 1", "Demo User 2", "Demo User 3"],
        score=50.0,
        group_name="Demo Circle",
        activity="Quick intro chat and team icebreaker",
        plan=activity_for_score(50.0)[2],
    )


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "Backend is running"}


@app.post("/api/submit", response_model=SubmitResponse)
def submit_answers(payload: SubmitRequest) -> SubmitResponse:
    session_id = str(uuid4())
    vector = answers_to_vector(payload.answers)
    score = vector_score(vector)

    users[session_id] = UserRecord(
        session_id=session_id,
        answers=payload.answers,
        vector=vector,
        score=score,
        label=f"User-{len(users) + 1}",
    )

    return SubmitResponse(session_id=session_id)


@app.post("/api/match", response_model=MatchResponse)
def match_users() -> MatchResponse:
    global groups, user_to_group

    if len(users) < 3:
        return MatchResponse(
            message="Not enough users yet. Using default demo group.",
            groups_created=1,
            users_processed=len(users),
        )

    groups = build_groups(users)
    user_to_group = {}

    for group_id, group in groups.items():
        for member_id in group.members:
            user_to_group[member_id] = group_id

    return MatchResponse(
        message="Matching complete",
        groups_created=len(groups),
        users_processed=len(users),
    )


@app.get("/api/result/{session_id}", response_model=ResultResponse)
def get_result(session_id: str) -> ResultResponse:
    if len(users) < 3:
        return build_demo_result(session_id)

    if session_id not in users:
        raise HTTPException(status_code=404, detail="Session not found")

    if not groups:
        demo_members = list(users.keys())[:3]
        if session_id not in demo_members and demo_members:
            demo_members[0] = session_id

        demo_records = [users[m] for m in demo_members if m in users]
        avg_score = round(sum(u.score for u in demo_records) / len(demo_records), 2)
        group_name, activity, plan = activity_for_score(avg_score)

        return ResultResponse(
            group=[users[m].label or m for m in demo_members],
            score=avg_score,
            group_name=group_name,
            activity=activity,
            plan=plan,
        )

    group_id = user_to_group.get(session_id)
    if not group_id:
        raise HTTPException(status_code=404, detail="User is not assigned to any group")

    group = groups[group_id]
    member_labels = [users[m].label or m for m in group.members]

    return ResultResponse(
        group=member_labels,
        score=group.average_score,
        group_name=group.group_name,
        activity=group.activity,
        plan=group.plan,
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "10000")))
