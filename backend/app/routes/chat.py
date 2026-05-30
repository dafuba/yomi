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


class EnrichedAnime(BaseModel):
    mal_id: Optional[int] = None
    title: Optional[str] = None
    title_english: Optional[str] = None
    episodes: Optional[int] = None
    score: Optional[float] = None
    year: Optional[int] = None
    image_url: Optional[str] = None
    url: Optional[str] = None


class Suggestion(BaseModel):
    id: str
    action: str = "add"
    title: str
    list: str
    reason: str
    jikan: Optional[EnrichedAnime] = None


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

    # Collect all titles to enrich in one pass — deduplicated to avoid redundant Jikan calls.
    rec_titles = _extract_titles(reply)
    sug_titles = [s["title"] for s in suggestions]
    all_titles = list(dict.fromkeys(rec_titles + sug_titles))

    enriched_map: dict[str, Optional[dict]] = {}
    if all_titles:
        try:
            results = await enrich_titles(all_titles)
            for title, result in zip(all_titles, results):
                enriched_map[title.lower()] = result
        except Exception:
            pass

    enriched = [enriched_map.get(t.lower()) for t in rec_titles]
    enriched_suggestions = [
        {**s, "jikan": enriched_map.get(s["title"].lower())}
        for s in suggestions
    ]

    return ChatResponse(reply=reply, suggestions=enriched_suggestions, enriched=enriched)
