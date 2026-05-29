from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.claude import get_recommendation

router = APIRouter()


class Message(BaseModel):
    role: str
    content: str


ALLOWED_MODELS = {
    "claude-haiku-4-5-20251001",
    "claude-sonnet-4-5",
    "claude-opus-4-8",
}

DEFAULT_MODEL = "claude-haiku-4-5-20251001"


class ChatRequest(BaseModel):
    messages: list[Message]
    model: str = DEFAULT_MODEL


class Suggestion(BaseModel):
    id: str
    action: str = "add"
    title: str
    list: str
    reason: str


class ChatResponse(BaseModel):
    reply: str
    suggestions: list[Suggestion] = []


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if request.model not in ALLOWED_MODELS:
        raise HTTPException(status_code=400, detail=f"Unknown model: {request.model}")

    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    try:
        reply, suggestions = get_recommendation(messages, model=request.model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return ChatResponse(reply=reply, suggestions=suggestions)
