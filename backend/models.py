from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class SubmitRequest(BaseModel):
    answers: List[int] = Field(..., min_length=1)
    age_group: str = "unknown"
    gender: str = "unknown"
    name: Optional[str] = None
    preferred_destination: str = "open"
    # Backwards-compatible alias for the existing frontend/session naming.
    landscape: Optional[str] = None


class SubmitResponse(BaseModel):
    group_id: str


class GroupInfo(BaseModel):
    group_members: List[str]
    match_score: int
    group_members_count: int
    group_name: str
    vibe_description: str
    preferred_destination: str = "open"
    destination_name: str = "Open landscape"
    destination_place: str = "Wherever feels right"
    emotional_theme: str = "An intentional shared atmosphere"
    cohort_atmosphere: str = "A small circle shaped around presence, ease, and genuine conversation."


class MatchResponse(BaseModel):
    message: str
    groups_created: int
    users_processed: int
    groups: List[GroupInfo]


class Plan(BaseModel):
    icebreaker: str
    activity: str
    closing: str


class ResultResponse(BaseModel):
    group_name: str
    score: int
    match_score: int = 0
    match_label: str = ""
    group_label: str = ""
    group_members_count: int = 0
    vibe_description: str = ""
    personality: str
    group_members: List[str]
    activity_plan: Plan
    match_reasons: List[str] = Field(default_factory=list)
    group_size: int = 0
    user_display_name: str = "You"
    preferred_destination: str = "open"
    destination_name: str = "Open landscape"
    destination_place: str = "Wherever feels right"
    destination_image: str = ""
    emotional_theme: str = "An intentional shared atmosphere"
    cohort_atmosphere: str = "A small circle shaped around presence, ease, and genuine conversation."
