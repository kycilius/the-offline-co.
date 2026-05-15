from __future__ import annotations

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
USER_COLUMNS = "id,name,answers,age_group,gender,preferred_destination,created_at"
LEGACY_USER_COLUMNS = "id,name,answers,age_group,gender,created_at"
GROUP_COLUMNS = "id,group_name,members,created_at"
TARGET_COHORT_SIZE = 7
OPEN_DESTINATION = "open"

DEFAULT_ACTIVITY_PLAN = Plan(
    icebreaker="Share one habit you want to change this week.",
    activity="Take a short walk together and talk about your daily routines.",
    closing="Exchange one small commitment and check in tomorrow.",
)


DESTINATION_PROFILES: dict[str, dict[str, str]] = {
    "birbhum": {
        "name": "Birbhum, West Bengal",
        "place": "Shantiniketan & the Khoai",
        "cohort_name": "Birbhum Red Earth Cohort",
        "image": "Warm red earth paths, wide skies, baul songs, and the quiet creative pulse of Khoai.",
        "theme": "Slow creativity and grounded conversation",
        "atmosphere": "Earthy, artistic, unhurried, and made for people who soften into honest dialogue.",
    },
    "dooars": {
        "name": "Jalpaiguri, North Bengal",
        "place": "The Dooars, near Gorumara",
        "cohort_name": "The Dooars Cohort",
        "image": "Tea-green edges, forest roads, river mist, and the hush around Gorumara.",
        "theme": "Forest calm and open-hearted discovery",
        "atmosphere": "Fresh, spacious, quietly adventurous, and held by the rhythm of the wild north.",
    },
    "kandhamal": {
        "name": "Kandhamal, Odisha",
        "place": "Daringbadi pine country",
        "cohort_name": "Daringbadi Pine Cohort",
        "image": "Pine shade, cool hill air, coffee blooms, and soft mornings in Daringbadi.",
        "theme": "Gentle reflection and hill-country stillness",
        "atmosphere": "Soft, reflective, restorative, and suited to people who want a quieter kind of closeness.",
    },
    "satkosia": {
        "name": "Angul, Odisha",
        "place": "Satkosia gorge, Mahanadi",
        "cohort_name": "Satkosia River Cohort",
        "image": "A deep river gorge, stone bends, evening light, and the patient flow of the Mahanadi.",
        "theme": "River depth and meaningful presence",
        "atmosphere": "Deep, steady, intimate, and shaped for conversations that move at river pace.",
    },
    "open": {
        "name": "Open landscape",
        "place": "Wherever feels right",
        "cohort_name": "Open Horizon Cohort",
        "image": "An open path chosen by fit, timing, and the atmosphere your cohort needs most.",
        "theme": "Trusting the right shared atmosphere",
        "atmosphere": "Flexible, receptive, and curated around the group that feels most emotionally coherent.",
    },
}

DESTINATION_ALIASES = {
    "angul": "satkosia",
    "daringbadi": "kandhamal",
    "jalpaiguri": "dooars",
}


def normalize_destination(value: Any) -> str:
    destination = str(value or OPEN_DESTINATION).strip().lower()
    destination = DESTINATION_ALIASES.get(destination, destination)
    if destination not in DESTINATION_PROFILES:
        return OPEN_DESTINATION
    return destination


def destination_profile(destination: Any) -> dict[str, str]:
    return DESTINATION_PROFILES[normalize_destination(destination)]


def fetch_users() -> list[dict[str, Any]]:
    try:
        response = supabase.table("users").select(USER_COLUMNS).execute()
        users = response.data or []
    except Exception as e:
        # Keep older Supabase projects stable until the safe migration is applied.
        print("Supabase preferred_destination fetch failed, retrying legacy columns:", e)
        try:
            response = supabase.table("users").select(LEGACY_USER_COLUMNS).execute()
            users = response.data or []
        except Exception as legacy_error:
            print("Supabase users fetch failed:", legacy_error)
            raise HTTPException(status_code=500, detail="Failed to fetch users") from legacy_error

    normalized_users = []
    for user in users:
        if user.get("id") and user.get("answers"):
            user["preferred_destination"] = normalize_destination(user.get("preferred_destination"))
            normalized_users.append(user)
    return normalized_users


def fetch_groups() -> list[dict[str, Any]]:
    try:
        response = supabase.table("groups").select(GROUP_COLUMNS).execute()
        return response.data or []
    except Exception as e:
        print("Supabase groups fetch failed:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch groups") from e


def submit_request_data(payload: SubmitRequest) -> dict[str, Any]:
    if hasattr(payload, "model_dump"):
        return payload.model_dump()
    return payload.dict()


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


def cohort_candidate_score(current_user: dict[str, Any], candidate: dict[str, Any], selected: list[dict[str, Any]]) -> int:
    score = adjusted_match_score(current_user, candidate)

    selected_age_groups = {str(user.get("age_group", "unknown")) for user in selected}
    selected_genders = {str(user.get("gender", "unknown")) for user in selected}

    if str(candidate.get("age_group", "unknown")) not in selected_age_groups:
        score += 4
    if str(candidate.get("gender", "unknown")) not in selected_genders:
        score += 3

    return score


def choose_open_user_destination(current_user: dict[str, Any], users: list[dict[str, Any]]) -> str:
    destination_scores: dict[str, int] = {}
    for user in users:
        destination = normalize_destination(user.get("preferred_destination"))
        if destination == OPEN_DESTINATION or record_id(user) == record_id(current_user):
            continue
        destination_scores[destination] = destination_scores.get(destination, 0) + adjusted_match_score(current_user, user)

    if not destination_scores:
        return OPEN_DESTINATION

    return max(destination_scores, key=destination_scores.get)


def select_group_members(current_user: dict[str, Any], users: list[dict[str, Any]], target_group_size: int = TARGET_COHORT_SIZE) -> list[str]:
    current_destination = normalize_destination(current_user.get("preferred_destination"))
    anchor_destination = (
        choose_open_user_destination(current_user, users)
        if current_destination == OPEN_DESTINATION
        else current_destination
    )

    selected = [current_user]
    selected_ids = {record_id(current_user)}

    def add_ranked(candidates: list[dict[str, Any]]) -> None:
        while len(selected) < target_group_size:
            remaining = [candidate for candidate in candidates if record_id(candidate) not in selected_ids]
            if not remaining:
                return
            next_user = max(remaining, key=lambda candidate: cohort_candidate_score(current_user, candidate, selected))
            selected.append(next_user)
            selected_ids.add(record_id(next_user))

    destination_candidates = [
        user
        for user in users
        if record_id(user) != record_id(current_user)
        and normalize_destination(user.get("preferred_destination")) == anchor_destination
    ]
    add_ranked(destination_candidates)

    if anchor_destination != OPEN_DESTINATION:
        open_candidates = [
            user
            for user in users
            if record_id(user) != record_id(current_user)
            and normalize_destination(user.get("preferred_destination")) == OPEN_DESTINATION
        ]
        add_ranked(open_candidates)

    # MVP fallback: create a smaller pilot cohort instead of randomly mixing destinations.
    return [record_id(user) for user in selected]


def choose_group_name_for_destination(destination: Any) -> str:
    return destination_profile(destination)["cohort_name"]

def choose_group_destination(current_user: dict[str, Any], member_ids: list[str], users: list[dict[str, Any]]) -> str:
    current_destination = normalize_destination(current_user.get("preferred_destination"))
    if current_destination != OPEN_DESTINATION:
        return current_destination

    users_by_id = {record_id(user): user for user in users}
    destination_counts: dict[str, int] = {}
    for member_id in member_ids:
        member = users_by_id.get(member_id)
        if not member:
            continue
        destination = normalize_destination(member.get("preferred_destination"))
        if destination != OPEN_DESTINATION:
            destination_counts[destination] = destination_counts.get(destination, 0) + 1

    if not destination_counts:
        return OPEN_DESTINATION

    return max(destination_counts, key=destination_counts.get)


def build_destination_summary(destination: Any) -> dict[str, str]:
    profile = destination_profile(destination)
    return {
        "preferred_destination": normalize_destination(destination),
        "destination_name": profile["name"],
        "destination_place": profile["place"],
        "destination_image": profile["image"],
        "emotional_theme": profile["theme"],
        "cohort_atmosphere": profile["atmosphere"],
    }


def build_result_from_group(group: dict[str, Any], users: list[dict[str, Any]]) -> ResultResponse:
    member_ids = [str(member) for member in (group.get("members") or [])]
    user_by_id = {record_id(user): user for user in users}
    members = [user_by_id[member] for member in member_ids if member in user_by_id]

    current_user = members[0] if members else None
    if current_user is None:
        raise HTTPException(status_code=404, detail="Group has no matching users")

    current_answers = user_answers(current_user)
    personality_type = infer_personality_type(current_answers)
    current_destination = normalize_destination(current_user.get("preferred_destination"))
    if current_destination == OPEN_DESTINATION:
        destination_counts: dict[str, int] = {}
        for member in members:
            member_destination = normalize_destination(member.get("preferred_destination"))
            if member_destination != OPEN_DESTINATION:
                destination_counts[member_destination] = destination_counts.get(member_destination, 0) + 1
        if destination_counts:
            current_destination = max(destination_counts, key=destination_counts.get)
    destination_summary = build_destination_summary(current_destination)
    display_names = build_display_name_map(members)
    comparisons = [adjusted_match_score(current_user, member) for member in members[1:]]
    average_score = int(sum(comparisons) / len(comparisons)) if comparisons else 50
    group_size = len(member_ids) or 1

    return ResultResponse(
        group_name=str(group.get("group_name") or choose_group_name_for_destination(current_destination)),
        score=average_score,
        match_score=average_score,
        match_label=build_match_label(average_score),
        group_label=build_group_label(group_size),
        group_members_count=group_size,
        vibe_description=destination_summary["cohort_atmosphere"],
        personality=build_personality_summary(current_answers),
        group_members=[display_names.get(member, "User") for member in member_ids] or ["Waiting for more users"],
        activity_plan=build_personality_activity_plan(personality_type),
        match_reasons=build_match_reasons(current_answers),
        group_size=group_size,
        user_display_name=display_names.get(record_id(current_user), "You"),
        **destination_summary,
    )


def build_group_info(group: dict[str, Any], users: list[dict[str, Any]]) -> GroupInfo:
    result = build_result_from_group(group, users)
    return GroupInfo(
        group_members=result.group_members,
        match_score=result.score,
        group_members_count=result.group_size,
        group_name=result.group_name,
        vibe_description=result.vibe_description,
        preferred_destination=result.preferred_destination,
        destination_name=result.destination_name,
        destination_place=result.destination_place,
        emotional_theme=result.emotional_theme,
        cohort_atmosphere=result.cohort_atmosphere,
    )


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "Backend is running"}


@app.post("/api/submit", response_model=SubmitResponse)
def submit_answers(payload: SubmitRequest) -> SubmitResponse:
    data = submit_request_data(payload)
    preferred_destination = normalize_destination(data.get("preferred_destination") or data.get("landscape"))
    insert_payload = {
        "name": data.get("name"),
        "answers": data.get("answers"),
        "age_group": data.get("age_group"),
        "gender": data.get("gender"),
        "preferred_destination": preferred_destination,
    }

    try:
        print("Submitting user to Supabase")
        try:
            user_response = supabase.table("users").insert(insert_payload).execute()
        except Exception as insert_error:
            # Stability fallback for projects that have not applied the safe migration yet.
            print("Supabase preferred_destination insert failed, retrying legacy payload:", insert_error)
            legacy_payload = dict(insert_payload)
            legacy_payload.pop("preferred_destination", None)
            user_response = supabase.table("users").insert(legacy_payload).execute()
        print("Supabase response:", user_response)
    except Exception as e:
        print("Supabase insert failed:", e)
        raise HTTPException(status_code=500, detail="Failed to save answers") from e

    user = (user_response.data or [None])[0]
    if not user or not user.get("id"):
        raise HTTPException(status_code=500, detail="Failed to save answers")

    user["preferred_destination"] = preferred_destination
    users = fetch_users()
    if not any(record_id(existing_user) == record_id(user) for existing_user in users):
        users.append(user)
    members = select_group_members(user, users)
    group_destination = choose_group_destination(user, members, users)
    group_name = choose_group_name_for_destination(group_destination)

    try:
        print("Submitting group to Supabase")
        group_response = (
            supabase.table("groups")
            .insert({
                "group_name": group_name,
                "members": members,
            })
            .execute()
        )
        print("Supabase response:", group_response)
    except Exception as e:
        print("Supabase insert failed:", e)
        raise HTTPException(status_code=500, detail="Failed to create group") from e

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
        group_response = (
            supabase.table("groups")
            .select(GROUP_COLUMNS)
            .eq("id", group_id)
            .limit(1)
            .execute()
        )
    except Exception as e:
        print("Supabase group fetch failed:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch group") from e

    group = (group_response.data or [None])[0]
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    users = fetch_users()
    return build_result_from_group(group, users)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "10000")))
