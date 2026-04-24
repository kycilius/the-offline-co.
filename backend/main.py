from __future__ import annotations

from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ai import answers_to_vector, build_groups, seed_users, vector_score
from models import GroupRecord, MatchResponse, ResultResponse, SubmitRequest, SubmitResponse, UserRecord

app = FastAPI(title="Social Detox MVP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
users: dict[str, UserRecord] = seed_users()
groups: dict[str, GroupRecord] = {}
user_to_group: dict[str, str] = {}


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "social-detox-backend"}


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
        raise HTTPException(status_code=400, detail="Need at least 3 users to perform matching")

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
    if session_id not in users:
        raise HTTPException(status_code=404, detail="Session not found")

    if not groups:
        # fallback quick demo group when matching has not run
        demo_members = list(users.keys())[:3]
        if session_id not in demo_members and demo_members:
            demo_members[0] = session_id

        demo_records = [users[m] for m in demo_members if m in users]
        avg_score = round(sum(u.score for u in demo_records) / len(demo_records), 2)
        from ai import activity_for_score

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
