import asyncio
import re
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.claude import get_recommendation
from app.services.jikan import enrich_titles

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


class EnrichedAnime(BaseModel):
    mal_id: Optional[int] = None
    title: Optional[str] = None
    title_english: Optional[str] = None
    episodes: Optional[int] = None
    score: Optional[float] = None
    year: Optional[int] = None
    image_url: Optional[str] = None
    url: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    suggestions: list[Suggestion] = []
    enriched: list[Optional[EnrichedAnime]] = []


def _extract_titles(text: str) -> list[str]:
    matches = re.findall(r"\*\*([^*]+?)\*\*", text)
    return [m.strip(" :—-") for m in matches if 2 < len(m) < 80]


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if request.model not in ALLOWED_MODELS:
        raise HTTPException(status_code=400, detail=f"Unknown model: {request.model}")

    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    try:
        reply, suggestions = await asyncio.to_thread(get_recommendation, messages, model=request.model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    titles = _extract_titles(reply)
    enriched: list[Optional[dict]] = []
    if titles:
        try:
            enriched = await enrich_titles(titles)
        except Exception:
            enriched = [None] * len(titles)

    return ChatResponse(reply=reply, suggestions=suggestions, enriched=enriched)
