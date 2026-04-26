from __future__ import annotations

import os
import uuid

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

DEFAULT_ACTIVITY_PLAN = Plan(
    icebreaker="Share one habit you want to change this week.",
    activity="Take a short walk together and talk about your daily routines.",
    closing="Exchange one small commitment and check in tomorrow.",
)


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


def adjusted_match_score(user1: dict[str, object], user2: dict[str, object]) -> int:
    """Keep personality as main factor with small demographic bonus weights."""
    base_score = compatibility_score(list(user1["answers"]), list(user2["answers"]))
    bonus = 0

    if str(user1.get("age_group", "unknown")) == str(user2.get("age_group", "unknown")):
        bonus += 10

    if str(user1.get("gender", "unknown")) == str(user2.get("gender", "unknown")):
        bonus += 5

    return min(100, base_score + bonus)


def infer_personality_type(answers: list[int]) -> str:
    if not answers:
        return "reflective"

    avg = sum(answers) / len(answers)
    if avg <= 2.3:
        return "deep"
    if avg <= 3.0:
        return "calm"
    if avg <= 3.7:
        return "reflective"
    return "explore"


def choose_group_name_for_personality(personality_type: str) -> str:
    if personality_type == "deep":
        return "Deep Connectors"
    if personality_type == "explore":
        return "Curious Builders"
    if personality_type == "calm":
        return "Quiet Thinkers"
    if personality_type == "reflective":
        return "Meaning Seekers"
    return "Thoughtful Circle"


def build_match_label(score: int) -> str:
    if score >= 80:
        return "unusually strong alignment"
    if score >= 60:
        return "strong alignment"
    if score >= 40:
        return "moderate alignment"
    return "early-stage compatibility"


def build_group_label(group_size: int) -> str:
    if group_size == 1:
        return "1 person like you"
    return f"{group_size} people like you"


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


def build_personality_activity_plan(personality_type: str) -> Plan:
    if personality_type == "deep":
        return Plan(
            icebreaker="Share one recent moment that felt meaningful.",
            activity="Take a quiet walk and share one meaningful thought.",
            closing="Reflect on one value you want your relationships to protect.",
        )

    if personality_type == "explore":
        return Plan(
            icebreaker="Name one unfamiliar thing you've wanted to try this month.",
            activity="Try something new together and talk about what you noticed.",
            closing="Pick one fresh activity to revisit next week.",
        )

    if personality_type == "calm":
        return Plan(
            icebreaker="Share one small habit that helps you reset.",
            activity="Sit in a calm space and have a slow, honest conversation.",
            closing="Agree on one gentle ritual you can both practice this week.",
        )

    if personality_type == "reflective":
        return Plan(
            icebreaker="Share one insight you've had about your social energy lately.",
            activity="Journal for five minutes, then discuss what surprised you.",
            closing="Choose one intentional boundary you'll carry into next week.",
        )

    return DEFAULT_ACTIVITY_PLAN


def build_display_name_map() -> dict[str, str]:
    descriptors = [
        "Quiet Listener",
        "Warm Storyteller",
        "Thoughtful Explorer",
        "Calm Optimist",
        "Gentle Connector",
        "Curious Reflector",
    ]
    return {str(user["session_id"]): descriptors[(index - 1) % len(descriptors)] for index, user in enumerate(users, start=1)}


def build_match_reasons(answers: list[int]) -> list[str]:
    if not answers:
        return [
            "You prefer meaningful conversations",
            "You value emotional safety",
            "You listen before speaking",
        ]

    avg = sum(answers) / len(answers)
    reasons: list[str] = []

    if avg <= 2.8:
        reasons.append("You prefer meaningful conversations")
    elif avg >= 3.8:
        reasons.append("You bring uplifting energy to group moments")
    else:
        reasons.append("You balance depth with lighthearted conversation")

    if len([value for value in answers if value <= 2]) >= max(1, len(answers) // 3):
        reasons.append("You value emotional safety")
    else:
        reasons.append("You adapt well to different social comfort levels")

    first_answer = answers[0] if answers else 3
    if first_answer <= 3:
        reasons.append("You listen before speaking")
    else:
        reasons.append("You initiate conversations with warmth")

    return reasons


def build_result_for_session(session_id: str) -> ResultResponse:
    if len(users) < 2:
        return ResultResponse(
            group_name="Thoughtful Circle",
            score=50,
            match_label=build_match_label(50),
            group_label=build_group_label(1),
            personality="You're early. More people will join your circle soon.",
            group_members=["Waiting for more users"],
            activity_plan=build_personality_activity_plan("reflective"),
            match_reasons=[
                "You prefer meaningful conversations",
                "You value emotional safety",
                "You listen before speaking",
            ],
            group_size=1,
            user_display_name="You",
        )

    current_user = next((user for user in users if str(user["session_id"]) == session_id), None)
    if current_user is None:
        raise HTTPException(status_code=404, detail="Session not found")

    display_names = build_display_name_map()
    current_answers = list(current_user["answers"])
    personality_type = infer_personality_type(current_answers)

    comparisons: list[tuple[str, int]] = []
    for other in users:
        other_id = str(other["session_id"])
        if other_id == session_id:
            continue

        score = adjusted_match_score(current_user, other)
        comparisons.append((other_id, score))

    comparisons.sort(key=lambda item: item[1], reverse=True)
    top_matches = comparisons[:4]
    average_score = int(sum(score for _, score in top_matches) / len(top_matches)) if top_matches else 0
    group_name = choose_group_name_for_personality(personality_type)

    group_member_names = [display_names.get(session_id, "User"), *[display_names.get(match_id, "User") for match_id, _ in top_matches]]
    if not group_member_names:
        group_member_names = ["Waiting for more users to join"]
    group_size = len(group_member_names)

    return ResultResponse(
        group_name=group_name,
        score=average_score,
        match_label=build_match_label(average_score),
        group_label=build_group_label(group_size),
        personality=build_personality_summary(current_answers),
        group_members=group_member_names,
        activity_plan=build_personality_activity_plan(personality_type),
        match_reasons=build_match_reasons(current_answers),
        group_size=group_size,
        user_display_name=display_names.get(session_id, "You"),
    )


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "Backend is running"}


@app.post("/api/submit", response_model=SubmitResponse)
def submit_answers(payload: SubmitRequest) -> SubmitResponse:
    session_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())

    users.append(
        {
            "user_id": user_id,
            "session_id": session_id,
            "answers": payload.answers,
            "age_group": payload.age_group,
            "gender": payload.gender,
        }
    )

    # New submission can affect matching quality, so reset previous computed results.
    results_by_session.clear()

    return SubmitResponse(session_id=session_id, user_id=user_id)


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

    display_names = build_display_name_map()

    for user in users:
        current_id = str(user["session_id"])
        computed_result = build_result_for_session(current_id)
        group_members = computed_result.group_members

        groups.append(
            GroupInfo(
                group_members=group_members,
                average_score=computed_result.score,
                group_name=computed_result.group_name,
            )
        )

        # Ensure readable labels are always returned in pre-computed results.
        results_by_session[current_id] = ResultResponse(
            group_name=computed_result.group_name,
            score=computed_result.score,
            match_label=computed_result.match_label,
            group_label=computed_result.group_label,
            personality=computed_result.personality,
            group_members=group_members,
            activity_plan=computed_result.activity_plan,
            match_reasons=computed_result.match_reasons,
            group_size=computed_result.group_size,
            user_display_name=computed_result.user_display_name,
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
    if result:
        return result

    return build_result_for_session(session_id)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "10000")))
