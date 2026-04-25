from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


class SubmitRequest(BaseModel):
    answers: List[int] = Field(..., min_length=1)


class SubmitResponse(BaseModel):
    session_id: str
    user_id: str


class GroupInfo(BaseModel):
    group_members: List[str]
    average_score: int
    group_name: str


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
    personality: str
    group_members: List[str]
    activity_plan: Plan
