from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SessionCreate(BaseModel):
    """세션 생성 요청"""
    title: Optional[str] = "새 대화"


class SessionResponse(BaseModel):
    """세션 응답"""
    session_id: str
    title: str
    created_at: datetime
    updated_at: datetime
