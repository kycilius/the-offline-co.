from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class SubmitRequest(BaseModel):
    answers: List[int] = Field(..., min_length=1)


class SubmitResponse(BaseModel):
    session_id: str


class MatchResponse(BaseModel):
    message: str
    groups_created: int
    users_processed: int


class Plan(BaseModel):
    icebreaker: str
    activity: str
    closing: str


class ResultResponse(BaseModel):
    group: List[str]
    score: float
    group_name: str
    activity: str
    plan: Plan


class UserRecord(BaseModel):
    session_id: str
    answers: List[int]
    vector: List[float]
    score: float
    label: Optional[str] = None


class GroupRecord(BaseModel):
    group_id: str
    members: List[str]
    average_score: float
    group_name: str
    activity: str
    plan: Plan
