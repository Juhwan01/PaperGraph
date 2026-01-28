from pydantic import BaseModel
from typing import List, Optional


class Citation(BaseModel):
    """논문 인용 정보"""
    paper_id: str
    title: str
    authors: List[str]
    year: int
    relevance: float
    url: Optional[str] = None
    citations_count: Optional[int] = None


class ChatRequest(BaseModel):
    """채팅 요청"""
    session_id: str
    message: str
    stream: bool = False


class ChatResponse(BaseModel):
    """채팅 응답"""
    answer: str
    citations: List[Citation]
    confidence_score: float
