from fastapi import APIRouter

from app.api.v1.chat import router as chat_router
from app.api.v1.sessions import router as sessions_router
from app.api.v1.papers import router as papers_router

router = APIRouter()

router.include_router(chat_router, prefix="/chat", tags=["chat"])
router.include_router(sessions_router, prefix="/sessions", tags=["sessions"])
router.include_router(papers_router, prefix="/papers", tags=["papers"])
