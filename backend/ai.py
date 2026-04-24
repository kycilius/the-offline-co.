from __future__ import annotations

from statistics import mean
from typing import Dict, List, Tuple

from models import GroupRecord, Plan, UserRecord


def answers_to_vector(answers: List[int]) -> List[float]:
    """Convert raw answers to a normalized 0-1 vector (assuming 1-5 scale)."""
    normalized: List[float] = []
    for value in answers:
        clamped = max(1, min(5, value))
        normalized.append((clamped - 1) / 4)
    return normalized


def vector_score(vector: List[float]) -> float:
    """Simple personality score in 0-100 range."""
    if not vector:
        return 0.0
    return round((sum(vector) / len(vector)) * 100, 2)


def activity_for_score(avg_score: float) -> Tuple[str, str, Plan]:
    if avg_score < 40:
        return (
            "Mindful Circle",
            "Coffee meetup and storytelling",
            Plan(
                icebreaker="Share one peaceful moment from this week.",
                activity="Have a relaxed coffee chat and swap short stories.",
                closing="Share one small detox goal for the next day.",
            ),
        )
    if avg_score < 70:
        return (
            "Creative Explorers",
            "Board games and open discussion",
            Plan(
                icebreaker="Tell the group about a hobby you'd like to restart.",
                activity="Play a light game, then discuss social detox habits.",
                closing="Exchange contact info and plan a follow-up hangout.",
            ),
        )
    return (
        "Energy Adventurers",
        "Outdoor walk and mini challenge",
        Plan(
            icebreaker="Share one thing that energizes you offline.",
            activity="Take a walk and complete a simple team photo challenge.",
            closing="Commit to one outdoor plan before next week.",
        ),
    )


def build_groups(users: Dict[str, UserRecord]) -> Dict[str, GroupRecord]:
    """
    Group users by similar score:
    1) sort by score
    2) group consecutive users in triplets
    """
    sorted_users = sorted(users.values(), key=lambda u: u.score)
    groups: Dict[str, GroupRecord] = {}

    for i in range(0, len(sorted_users), 3):
        chunk = sorted_users[i : i + 3]
        if not chunk:
            continue

        member_ids = [user.session_id for user in chunk]
        avg_score = round(mean(u.score for u in chunk), 2)
        group_name, activity, plan = activity_for_score(avg_score)
        group_id = f"group_{(i // 3) + 1}"

        groups[group_id] = GroupRecord(
            group_id=group_id,
            members=member_ids,
            average_score=avg_score,
            group_name=group_name,
            activity=activity,
            plan=plan,
        )

    return groups


def seed_users() -> Dict[str, UserRecord]:
    """Optional demo seed data (20 users)."""
    seeded: Dict[str, UserRecord] = {}

    for i in range(1, 21):
        session_id = f"demo_user_{i}"
        answers = [((i + j) % 5) + 1 for j in range(8)]
        vector = answers_to_vector(answers)
        seeded[session_id] = UserRecord(
            session_id=session_id,
            answers=answers,
            vector=vector,
            score=vector_score(vector),
            label=f"User{i}",
        )

    return seeded
