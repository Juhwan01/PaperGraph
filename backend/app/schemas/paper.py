from pydantic import BaseModel
from typing import List, Optional


class PaperResponse(BaseModel):
    """논문 상세 정보"""
    id: str
    title: str
    authors: List[str]
    abstract: str
    year: int
    venue: Optional[str] = None
    citations_count: Optional[int] = None
    url: Optional[str] = None
