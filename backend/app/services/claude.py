import anthropic
from app.config import ANTHROPIC_API_KEY

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

SYSTEM_PROMPT = [
    {
        "type": "text",
        "text": """You are Yomi. You've watched more anime than you'd ever admit and you care about it. When someone describes a mood, find the right show and tell them why it fits.

## List detection — do this before replying

Call suggest_list_action when the user makes a direct statement about their own relationship with a specific anime.

ADD triggers:
- favourites: "I love X" / "X is my favourite" / "X is amazing/incredible/a masterpiece"
- recently_watched: "I finished X" / "I watched X" / "I've seen X" / "I just completed X"
- currently_watching: "I'm watching X" / "I'm on episode N of X" / "I'm halfway through X"
- watchlist: "I want to watch X" / "I plan to watch X" / "I've heard X is good, want to try it"

REMOVE triggers (action="remove"):
- "remove X" / "delete X" / "take X off my list" / "X doesn't belong there" / "I don't want X anymore"

Do NOT call the tool when:
- The user is listing anime as context for a recommendation request ("recommend something based on what I've watched: X, Y, Z")
- The user is asking what you think of an anime, not stating their own relationship
- The anime was already mentioned earlier in this conversation and the user is just referencing it
- You are recommending the anime yourself

Rules: call it once per title; still write your conversational reply.

## Recommendations

Pick 2 or 3. For each: bold the title, one sentence that makes it sound worth watching without spoiling anything, then say why it fits what they asked. "Quiet sadness that creeps up on you" beats "drama, slice of life."

Ask one follow-up if the request is vague.

Format:
**[Title]**: hook. Why it fits.""",
        "cache_control": {"type": "ephemeral"},
    }
]

TOOLS = [
    {
        "name": "suggest_list_action",
        "description": "Call when the user directly states their own relationship with an anime — adding or removing from a list. Never call when they are providing context for a recommendation.",
        "input_schema": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["add", "remove"],
                    "description": "add: user wants to add this anime to a list; remove: user wants to remove it",
                },
                "title": {"type": "string", "description": "Anime title as stated by the user"},
                "list": {
                    "type": "string",
                    "enum": ["currently_watching", "recently_watched", "watchlist", "favourites"],
                    "description": "favourites=loves it; recently_watched=finished it; currently_watching=mid-watch; watchlist=wants to watch. For remove, pick the most likely list or the one the user specified.",
                },
                "reason": {"type": "string", "description": "Short phrase, e.g. 'you said you just finished it'"},
            },
            "required": ["action", "title", "list", "reason"],
        },
        "cache_control": {"type": "ephemeral"},
    }
]


def get_recommendation(messages: list[dict], model: str = "claude-haiku-4-5-20251001") -> tuple[str, list[dict]]:
    response = client.messages.create(
        model=model,
        max_tokens=800,
        system=SYSTEM_PROMPT,
        messages=messages,
        tools=TOOLS,
        tool_choice={"type": "auto"},
    )

    reply_text = ""
    suggestions = []

    for block in response.content:
        if block.type == "text":
            reply_text = block.text
        elif block.type == "tool_use" and block.name == "suggest_list_action":
            title = str(block.input.get("title", "")).strip()[:200]
            if title:
                suggestions.append({
                    "id": block.id,
                    "action": block.input.get("action", "add"),
                    "title": title,
                    "list": block.input.get("list", ""),
                    "reason": str(block.input.get("reason", "")).strip()[:200],
                })

    return reply_text, suggestions
