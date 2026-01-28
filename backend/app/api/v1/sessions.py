from fastapi import APIRouter, HTTPException
from app.schemas.session import SessionCreate, SessionResponse
from app.services.session import SessionService

router = APIRouter()


@router.post("", response_model=SessionResponse)
async def create_session():
    """새 세션 생성"""
    session_service = SessionService()
    session = await session_service.create_session()
    return session


@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str):
    """세션 조회"""
    session_service = SessionService()
    session = await session_service.get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return session


@router.delete("/{session_id}")
async def delete_session(session_id: str):
    """세션 삭제"""
    session_service = SessionService()
    success = await session_service.delete_session(session_id)

    if not success:
        raise HTTPException(status_code=404, detail="Session not found")

    return {"message": "Session deleted"}
