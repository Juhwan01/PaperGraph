from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.agent import AgentService

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    채팅 메시지 처리 (동기)

    - 쿼리 분석 → 검색 → 리랭킹 → 답변 생성
    - Citation 포함
    """
    agent_service = AgentService()
    result = await agent_service.process_message(
        session_id=request.session_id,
        message=request.message,
    )
    return result


@router.websocket("/ws/{session_id}")
async def chat_websocket(websocket: WebSocket, session_id: str):
    """
    채팅 메시지 처리 (스트리밍)

    WebSocket을 통해 실시간으로 토큰 및 Citation 전송
    """
    await websocket.accept()
    agent_service = AgentService()

    try:
        while True:
            message = await websocket.receive_text()

            async for chunk in agent_service.process_message_stream(
                session_id=session_id,
                message=message,
            ):
                await websocket.send_json(chunk)

    except WebSocketDisconnect:
        pass
