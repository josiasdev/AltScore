from pydantic import BaseModel


class ScoreBreakdown(BaseModel):
    payment: int
    income: int
    finance: int
    social: int


class ScoreResponse(BaseModel):
    total: int
    breakdown: ScoreBreakdown
    level: str
    connected_sources: list[str]
