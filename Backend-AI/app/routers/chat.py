from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.deepseek_client import get_response
from app.core.logger import logger

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str
    prompt: str
    chat_type: str  # one of "symptom", "qa", "food", "explore"


class ChatResponse(BaseModel):
    response: str


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Send a message to the medical chat bot",
)
async def chat_handler(payload: ChatRequest) -> ChatResponse:
    """
    Receives a chat request, dispatches to the deepseek_client,
    and returns the assistant's reply.
    """
    try:
        logger.info(
            f"[Chat][{payload.session_id}] {payload.chat_type} → {payload.prompt}"
        )
        reply = await get_response(
            session_id=payload.session_id,
            user_input=payload.prompt,
            chat_type=payload.chat_type,
        )
        return ChatResponse(response=reply)

    except Exception as e:
        logger.exception("Error in chat_handler")
        raise HTTPException(status_code=500, detail="Internal Chat Error")
