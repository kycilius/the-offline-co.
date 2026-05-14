from __future__ import annotations

import logging
import os
from typing import Any

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import Client, create_client

from models import GroupInfo, MatchResponse, Plan, ResultResponse, SubmitRequest, SubmitResponse

app = FastAPI(title="Social Detox MVP API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing Supabase environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
logger = logging.getLogger(__name__)

USER_COLUMNS = "id,name,answers,age_group,gender,created_at"
GROUP_COLUMNS = "id,group_name,members,created_at"

DEFAULT_ACTIVITY_PLAN = Plan(
    icebreaker="Share one habit you want to change this week.",
    activity="Take a short walk together and talk about your daily routines.",
    closing="Exchange one small commitment and check in tomorrow.",
)


def fetch_users() -> list[dict[str, Any]]:
    try:
        response = supabase.table("users").select(USER_COLUMNS).execute()
        users = response.data or []
        return [user for user in users if user.get("id") and user.get("answers")]
    except Exception as e:
        logger.exception("Error fetching users from Supabase: %s", str(e))
        return []


def fetch_groups() -> list[dict[str, Any]]:
    try:
        response = supabase.table("groups").select(GROUP_COLUMNS).execute()
        return response.data or []
    except Exception as e:
        logger.exception("Error fetching groups from Supabase: %s", str(e))
        return []


def record_id(user: dict[str, Any]) -> str:
    return str(user["id"])


def user_answers(user: dict[str, Any]) -> list[int]:
    return list(user.get("answers") or [])


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


def adjusted_match_score(user1: dict[str, Any], user2: dict[str, Any]) -> int:
    """Keep personality as the main factor with small demographic bonus weights."""
    base_score = compatibility_score(user_answers(user1), user_answers(user2))
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


def build_display_name_map(users: list[dict[str, Any]]) -> dict[str, str]:
    descriptors = [
        "Quiet Listener",
        "Warm Storyteller",
        "Thoughtful Explorer",
        "Calm Optimist",
        "Gentle Connector",
        "Curious Reflector",
    ]

    names: dict[str, str] = {}
    for index, user in enumerate(users, start=1):
        fallback = descriptors[(index - 1) % len(descriptors)]
        name = str(user.get("name") or "").strip()
        names[record_id(user)] = name or fallback
    return names


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


def select_group_members(current_user: dict[str, Any], users: list[dict[str, Any]], max_group_size: int = 5) -> list[str]:
    others = [user for user in users if record_id(user) != record_id(current_user)]
    ranked = sorted(others, key=lambda candidate: adjusted_match_score(current_user, candidate), reverse=True)
    return [record_id(current_user), *[record_id(user) for user in ranked[: max_group_size - 1]]]


def build_result_from_group(group: dict[str, Any], users: list[dict[str, Any]]) -> ResultResponse:
    member_ids = [str(member) for member in (group.get("members") or [])]
    user_by_id = {record_id(user): user for user in users}
    members = [user_by_id[member] for member in member_ids if member in user_by_id]

    current_user = members[0] if members else None
    if current_user is None:
        raise HTTPException(status_code=404, detail="Group has no matching users")

    current_answers = user_answers(current_user)
    personality_type = infer_personality_type(current_answers)
    display_names = build_display_name_map(members)
    comparisons = [adjusted_match_score(current_user, member) for member in members[1:]]
    average_score = int(sum(comparisons) / len(comparisons)) if comparisons else 50
    group_size = len(member_ids) or 1

    return ResultResponse(
        group_name=str(group.get("group_name") or choose_group_name_for_personality(personality_type)),
        score=average_score,
        match_score=average_score,
        match_label=build_match_label(average_score),
        group_label=build_group_label(group_size),
        group_members_count=group_size,
        vibe_description=build_personality_summary(current_answers),
        personality=build_personality_summary(current_answers),
        group_members=[display_names.get(member, "User") for member in member_ids] or ["Waiting for more users"],
        activity_plan=build_personality_activity_plan(personality_type),
        match_reasons=build_match_reasons(current_answers),
        group_size=group_size,
        user_display_name=display_names.get(record_id(current_user), "You"),
    )


def build_group_info(group: dict[str, Any], users: list[dict[str, Any]]) -> GroupInfo:
    result = build_result_from_group(group, users)
    return GroupInfo(
        group_members=result.group_members,
        match_score=result.score,
        group_members_count=result.group_size,
        group_name=result.group_name,
        vibe_description=result.vibe_description,
    )


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "Backend is running"}


@app.post("/api/submit", response_model=SubmitResponse)
def submit_answers(payload: SubmitRequest) -> SubmitResponse:
    user_payload = {
        "name": payload.name,
        "answers": payload.answers,
        "age_group": payload.age_group,
        "gender": payload.gender,
    }

    try:
        user_response = supabase.table("users").insert(user_payload).execute()
    except Exception as e:
        logger.exception("Error inserting user into Supabase: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to save answers")

    user = (user_response.data or [None])[0]
    if not user or not user.get("id"):
        raise HTTPException(status_code=500, detail="Failed to save answers")

    users = fetch_users()
    group_members = select_group_members(user, users)
    personality_type = infer_personality_type(user_answers(user))
    group_payload = {
        "group_name": choose_group_name_for_personality(personality_type),
        "members": group_members,
    }

    try:
        group_response = supabase.table("groups").insert(group_payload).execute()
    except Exception as e:
        logger.exception("Error inserting group into Supabase: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to create group")

    group = (group_response.data or [None])[0]
    if not group or not group.get("id"):
        raise HTTPException(status_code=500, detail="Failed to create group")

    return SubmitResponse(group_id=str(group["id"]))


@app.post("/api/match", response_model=MatchResponse)
def match_users() -> MatchResponse:
    users = fetch_users()

    if len(users) < 2:
        return MatchResponse(
            message="Need at least 2 users before matching can run.",
            groups_created=0,
            users_processed=len(users),
            groups=[],
        )

    groups = fetch_groups()
    group_infos: list[GroupInfo] = []
    for group in groups:
        try:
            group_infos.append(build_group_info(group, users))
        except HTTPException:
            continue

    return MatchResponse(
        message="Matching complete",
        groups_created=0,
        users_processed=len(users),
        groups=group_infos,
    )


@app.get("/api/result/{group_id}", response_model=ResultResponse)
def get_result(group_id: str) -> ResultResponse:
    try:
        group_response = supabase.table("groups").select(GROUP_COLUMNS).eq("id", group_id).limit(1).execute()
    except Exception as e:
        logger.exception("Error fetching group from Supabase: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch group")

    group = (group_response.data or [None])[0]
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    users = fetch_users()
    return build_result_from_group(group, users)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "10000")))
