import asyncio
import time
from typing import Optional
import httpx

JIKAN_BASE = "https://api.jikan.moe/v4"

_cache: dict[str, tuple[float, dict]] = {}
CACHE_TTL_SECONDS = 60 * 60

_last_request_time = 0.0
_lock = asyncio.Lock()


async def _throttled_get(url: str) -> Optional[dict]:
    global _last_request_time
    async with _lock:
        elapsed = time.monotonic() - _last_request_time
        if elapsed < 0.35:
            await asyncio.sleep(0.35 - elapsed)
        _last_request_time = time.monotonic()

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(url)
        if r.status_code == 429:
            return None
        if r.status_code >= 500:
            return None
        if not r.is_success:
            return None
        return r.json()
    except (httpx.RequestError, httpx.TimeoutException):
        return None


def _cache_get(key: str) -> Optional[list]:
    if key in _cache:
        ts, value = _cache[key]
        if time.time() - ts < CACHE_TTL_SECONDS:
            return value
        del _cache[key]
    return None


def _cache_set(key: str, value: list) -> None:
    _cache[key] = (time.time(), value)


def _slim_anime(anime: dict) -> dict:
    return {
        "mal_id": anime.get("mal_id"),
        "title": anime.get("title"),
        "title_english": anime.get("title_english"),
        "episodes": anime.get("episodes"),
        "score": anime.get("score"),
        "year": anime.get("year"),
        "image_url": (anime.get("images") or {}).get("jpg", {}).get("image_url"),
        "url": anime.get("url"),
    }


async def search_anime(query: str, limit: int = 1) -> list[dict]:
    key = f"search:{query.lower()}:{limit}"
    cached = _cache_get(key)
    if cached is not None:
        return cached

    data = await _throttled_get(f"{JIKAN_BASE}/anime?q={query}&limit={limit}")
    if not data or "data" not in data:
        return []

    results = [_slim_anime(a) for a in data["data"]]
    _cache_set(key, results)
    return results


async def enrich_titles(titles: list[str]) -> list[Optional[dict]]:
    out = []
    for title in titles:
        results = await search_anime(title, limit=1)
        out.append(results[0] if results else None)
    return out
