from typing import TypedDict, List, Optional
from dataclasses import dataclass


@dataclass
class Message:
    """채팅 메시지"""
    role: str  # 'user' | 'assistant'
    content: str


@dataclass
class Document:
    """검색된 문서"""
    paper_id: str
    title: str
    authors: List[str]
    abstract: str
    year: int
    score: float
    content: Optional[str] = None
    venue: Optional[str] = None
    url: Optional[str] = None


@dataclass
class Citation:
    """인용 정보"""
    paper_id: str
    title: str
    authors: List[str]
    year: int
    relevance: float
    url: Optional[str] = None
    citations_count: Optional[int] = None


class RAGState(TypedDict):
    """LangGraph RAG 파이프라인 상태"""
    query: str
    chat_history: List[Message]
    search_results: List[Document]
    reranked_results: List[Document]
    generated_answer: str
    citations: List[Citation]
    confidence_score: float
    needs_refinement: bool
