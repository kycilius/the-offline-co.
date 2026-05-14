from __future__ import annotations

import logging
import os
from typing import Any

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import Client, create_client

from models import GroupInfo, MatchResponse, Plan, ResultResponse, SubmitRequest, SubmitResponse

app = FastAPI(title="Social Detox MVP API", version="0.2.0")

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

DEFAULT_ACTIVITY_PLAN = Plan(
    icebreaker="Share one habit you want to change this week.",
    activity="Take a short walk together and talk about your daily routines.",
    closing="Exchange one small commitment and check in tomorrow.",
)

USER_COLUMNS = "id, name, answers, age_group, gender, created_at"
GROUP_COLUMNS = "id, group_name, members, created_at"



def fetch_users() -> list[dict[str, Any]]:
    try:
        response = supabase.table("users").select(USER_COLUMNS).execute()
        users = response.data or []
        users = [user for user in users if user.get("answers")]
        logger.info("Fetched users: %s", users)
        return users
    except Exception as e:
        logger.exception("Error fetching from Supabase: %s", str(e))
        return []


def fetch_groups() -> list[dict[str, Any]]:
    try:
        response = supabase.table("groups").select(GROUP_COLUMNS).execute()
        groups = response.data or []
        logger.info("Fetched groups: %s", groups)
        return groups
    except Exception as e:
        logger.exception("Error fetching groups from Supabase: %s", str(e))
        return []


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


def calculate_similarity(user1: dict[str, object], user2: dict[str, object]) -> int:
    answers1 = list(user1.get("answers") or [])
    answers2 = list(user2.get("answers") or [])

    score = sum(1 for a, b in zip(answers1, answers2) if a == b)
    return score


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


def assign_group_personality(answers_list: list[list[int]]) -> tuple[str, str]:
    if not answers_list:
        return "Quiet Circles", "Thoughtful people who prefer low-pressure social moments."

    avg_answers = [sum(values) / len(values) for values in zip(*answers_list)]
    overall_avg = sum(avg_answers) / len(avg_answers) if avg_answers else 3

    high_emotional = sum(1 for value in avg_answers if value <= 2.4)
    adventurous = sum(1 for value in avg_answers if value >= 4.1)

    if high_emotional >= max(2, len(avg_answers) // 3):
        return (
            "Deep Connectors",
            "People who value meaningful conversations and emotional depth.",
        )

    if adventurous >= max(2, len(avg_answers) // 3) or overall_avg >= 3.8:
        return (
            "Explorers",
            "Curious members who enjoy trying new activities and shared momentum.",
        )

    return (
        "Quiet Circles",
        "Calm and social members who prefer steady, supportive connection.",
    )


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


def build_display_name_map(users: list[dict[str, object]]) -> dict[str, str]:
    descriptors = [
        "Quiet Listener",
        "Warm Storyteller",
        "Thoughtful Explorer",
        "Calm Optimist",
        "Gentle Connector",
        "Curious Reflector",
    ]
    return {str(user["id"]): descriptors[(index - 1) % len(descriptors)] for index, user in enumerate(users, start=1)}


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


def build_result_for_user(user_id: str, users: list[dict[str, object]]) -> ResultResponse:
    if len(users) < 2:
        return ResultResponse(
            group_name="Thoughtful Circle",
            score=50,
            match_score=50,
            match_label=build_match_label(50),
            group_label=build_group_label(1),
            group_members_count=1,
            vibe_description="A thoughtful starter circle waiting for more meaningful matches.",
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

    current_user = next((user for user in users if str(user["id"]) == user_id), None)
    if current_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    display_names = build_display_name_map(users)
    current_answers = list(current_user["answers"])
    personality_type = infer_personality_type(current_answers)

    comparisons: list[tuple[str, int]] = []
    for other in users:
        other_id = str(other["id"])
        if other_id == user_id:
            continue

        score = adjusted_match_score(current_user, other)
        comparisons.append((other_id, score))

    comparisons.sort(key=lambda item: item[1], reverse=True)
    top_matches = comparisons[:4]
    average_score = int(sum(score for _, score in top_matches) / len(top_matches)) if top_matches else 0
    group_name = choose_group_name_for_personality(personality_type)

    group_member_names = [display_names.get(user_id, "User"), *[display_names.get(match_id, "User") for match_id, _ in top_matches]]
    if not group_member_names:
        group_member_names = ["Waiting for more users to join"]
    group_size = len(group_member_names)

    return ResultResponse(
        group_name=group_name,
        score=average_score,
        match_score=average_score,
        match_label=build_match_label(average_score),
        group_label=build_group_label(group_size),
        group_members_count=group_size,
        vibe_description=build_personality_summary(current_answers),
        personality=build_personality_summary(current_answers),
        group_members=group_member_names,
        activity_plan=build_personality_activity_plan(personality_type),
        match_reasons=build_match_reasons(current_answers),
        group_size=group_size,
        user_display_name=display_names.get(user_id, "You"),
    )


def group_match_score(members: list[dict[str, Any]]) -> int:
    if len(members) < 2:
        return 50

    scores: list[int] = []
    for index, member in enumerate(members):
        for other in members[index + 1 :]:
            scores.append(adjusted_match_score(member, other))
    return int(sum(scores) / len(scores)) if scores else 50


def build_group_context(
    group: dict[str, Any],
    users: list[dict[str, Any]],
) -> tuple[list[str], list[dict[str, Any]], str, str]:
    member_ids = [str(member) for member in (group.get("members") or [])]
    members = [u for u in users if str(u.get("id")) in member_ids]
    answers_list = [list(member.get("answers") or []) for member in members if member.get("answers")]

    if answers_list:
        computed_group_name, vibe_description = assign_group_personality(answers_list)
    else:
        computed_group_name = "Thoughtful Circle"
        vibe_description = "A thoughtful starter circle waiting for more meaningful matches."

    group_name = str(group.get("group_name") or computed_group_name)
    return member_ids, members, group_name, vibe_description


def build_result_from_group(user: dict[str, Any], users: list[dict[str, Any]], group: dict[str, Any]) -> ResultResponse:
    user_id = str(user["id"])
    member_ids, members, group_name, vibe_description = build_group_context(group, users)
    display_names = build_display_name_map(members or [user])

    personality_type = infer_personality_type(list(user.get("answers") or []))
    comparisons = [adjusted_match_score(user, m) for m in members if str(m.get("id")) != user_id]
    average_score = int(sum(comparisons) / len(comparisons)) if comparisons else 50

    return ResultResponse(
        group_name=group_name,
        score=average_score,
        match_score=average_score,
        match_label=build_match_label(average_score),
        group_label=build_group_label(len(member_ids) or 1),
        group_members_count=len(member_ids) or 1,
        vibe_description=vibe_description,
        personality=build_personality_summary(list(user.get("answers") or [])),
        group_members=[display_names.get(member_id, "User") for member_id in member_ids] or ["Waiting for more users"],
        activity_plan=build_personality_activity_plan(personality_type),
        match_reasons=build_match_reasons(list(user.get("answers") or [])),
        group_size=len(member_ids) or 1,
        user_display_name=display_names.get(user_id, "You"),
    )


def assign_real_groups(users: list[dict[str, Any]], groups: list[dict[str, Any]]) -> int:
    assigned_ids = {
        str(member)
        for group in groups
        for member in (group.get("members") or [])
    }
    unassigned_users = [user for user in users if str(user.get("id")) not in assigned_ids]
    created_groups = 0

    while len(unassigned_users) >= 3:
        seed = unassigned_users.pop(0)
        scored_candidates = sorted(
            unassigned_users,
            key=lambda candidate: (
                calculate_similarity(seed, candidate),
                adjusted_match_score(seed, candidate),
            ),
            reverse=True,
        )

        target_size = min(5, len(unassigned_users) + 1)
        selected_users = [seed, *scored_candidates[: target_size - 1]]
        selected_ids = {str(user["id"]) for user in selected_users}
        unassigned_users = [user for user in unassigned_users if str(user["id"]) not in selected_ids]

        answers_list = [list(user["answers"]) for user in selected_users]
        group_name, _ = assign_group_personality(answers_list)
        group_payload = {
            "group_name": group_name,
            "members": [str(user["id"]) for user in selected_users],
        }

        supabase.table("groups").insert(group_payload).execute()

        created_groups += 1

    return created_groups


def build_group_info(group: dict[str, Any], users: list[dict[str, Any]]) -> GroupInfo:
    member_ids, members, group_name, vibe_description = build_group_context(group, users)
    display_names = build_display_name_map(members)
    group_members = [display_names.get(member_id, "User") for member_id in member_ids] or ["Waiting for more users"]

    return GroupInfo(
        group_members=group_members,
        match_score=group_match_score(members),
        group_members_count=len(member_ids) or 1,
        group_name=group_name,
        vibe_description=vibe_description,
    )


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "Backend is running"}


@app.post("/api/submit", response_model=SubmitResponse)
def submit_answers(payload: SubmitRequest) -> SubmitResponse:
    try:
        response = supabase.table("users").insert(
            {
                "name": payload.name,
                "answers": payload.answers,
                "age_group": payload.age_group,
                "gender": payload.gender,
            }
        ).execute()
        logger.info("Supabase insert response: %s", response)
    except Exception as e:
        logger.exception("Error inserting into Supabase: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to create user") from e

    user = response.data[0] if response.data else None
    if not user or not user.get("id"):
        raise HTTPException(status_code=500, detail="Failed to create user")

    user_id = str(user["id"])
    return SubmitResponse(session_id=user_id, user_id=user_id)


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

    existing_groups = fetch_groups()
    created_groups = assign_real_groups(users, existing_groups)
    users = fetch_users()
    groups = [build_group_info(group, users) for group in fetch_groups()]

    return MatchResponse(
        message="Matching complete",
        groups_created=created_groups,
        users_processed=len(users),
        groups=groups,
    )


@app.get("/api/result/{user_id}", response_model=ResultResponse)
def get_result(user_id: str) -> ResultResponse:
    try:
        response = supabase.table("users").select(USER_COLUMNS).eq("id", user_id).limit(1).execute()
        user = response.data[0] if response.data else None
    except Exception as e:
        logger.exception("Error fetching user from Supabase: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch user")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    users = fetch_users()

    try:
        group_response = (
            supabase.table("groups").select(GROUP_COLUMNS).contains("members", [user_id]).limit(1).execute()
        )
        group = group_response.data[0] if group_response.data else None
        if group:
            return build_result_from_group(user, users, group)
    except Exception as e:
        logger.exception("Error fetching group from Supabase: %s", str(e))

    return build_result_for_user(user_id, users)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "10000")))
