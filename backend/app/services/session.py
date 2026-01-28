from typing import Optional, Dict, List
from datetime import datetime
import uuid
from app.schemas.session import SessionResponse
from app.models.state import Message


class SessionService:
    """세션 관리 서비스"""

    def __init__(self):
        # TODO: Redis 또는 메모리 기반 세션 저장소
        # 현재는 in-memory 저장소 사용
        self._sessions: Dict[str, dict] = {}
        self._chat_history: Dict[str, List[Message]] = {}

    async def create_session(self, title: str = "새 대화") -> SessionResponse:
        """새 세션 생성"""
        session_id = str(uuid.uuid4())
        now = datetime.utcnow()

        session = {
            "session_id": session_id,
            "title": title,
            "created_at": now,
            "updated_at": now,
        }

        self._sessions[session_id] = session
        self._chat_history[session_id] = []

        return SessionResponse(**session)

    async def get_session(self, session_id: str) -> Optional[SessionResponse]:
        """세션 조회"""
        session = self._sessions.get(session_id)
        if not session:
            return None
        return SessionResponse(**session)

    async def delete_session(self, session_id: str) -> bool:
        """세션 삭제"""
        if session_id not in self._sessions:
            return False

        del self._sessions[session_id]
        if session_id in self._chat_history:
            del self._chat_history[session_id]

        return True

    async def get_chat_history(self, session_id: str) -> List[Message]:
        """채팅 히스토리 조회"""
        return self._chat_history.get(session_id, [])

    async def add_message(self, session_id: str, message: Message) -> None:
        """메시지 추가"""
        if session_id not in self._chat_history:
            self._chat_history[session_id] = []

        self._chat_history[session_id].append(message)

        # 세션 업데이트 시간 갱신
        if session_id in self._sessions:
            self._sessions[session_id]["updated_at"] = datetime.utcnow()
