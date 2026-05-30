# CLAUDE.md — Yomi Anime Recommendation App

This file tells Claude Code everything it needs to know about this project.
Read this before touching any file.

---

## Context

This project lives inside `playground/` — a personal sandbox for learning
fullstack project structure and development patterns. The goal is to get familiar
with how real projects are organised so the patterns can be reused later.

Don't over-engineer. The point is clarity and learning, not production polish.

---

## What this project is

A fullstack web app called **Yomi** — an anime recommendation chat powered by Claude.
Users type a vibe or mood, Yomi responds like a knowledgeable friend.

Stack:
- **Frontend**: React + Vite (JavaScript)
- **Backend**: Python + FastAPI
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Deploy target**: Frontend → Vercel, Backend → Railway (later)

---

## Folder layout

```
playground/              ← sandbox root (other test projects go here too)
└── yomi/                      ← this project
    ├── CLAUDE.md              ← you are here
    ├── .gitignore
    ├── README.md
    │
    ├── frontend/
    │   ├── package.json
    │   ├── vite.config.js
    │   ├── index.html
    │   ├── .env.local         ← VITE_API_URL=http://localhost:8000
    │   └── src/
    │       ├── main.jsx       ← entry point
    │       ├── App.jsx        ← root component
    │       ├── components/
    │       │   ├── ChatWindow.jsx     ← message list
    │       │   ├── MessageBubble.jsx  ← single message bubble
    │       │   └── InputBar.jsx       ← text input + send button
    │       ├── hooks/
    │       │   └── useChat.js         ← chat state + API call logic
    │       └── pages/
    │           └── Home.jsx           ← main page layout
    │
    └── backend/
        ├── requirements.txt
        ├── main.py            ← FastAPI app entry point
        ├── .env               ← ANTHROPIC_API_KEY=sk-...
        └── app/
            ├── __init__.py
            ├── config.py      ← loads env vars
            ├── routes/
            │   ├── __init__.py
            │   └── chat.py    ← POST /api/chat endpoint
            └── services/
                ├── __init__.py
                └── claude.py  ← Anthropic API call + system prompt
```

---

## How to run locally

### Backend

```bash
cd playground/yomi/backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd playground/yomi/frontend
npm install
npm run dev                     # runs on http://localhost:5173
```

Run both at the same time in two terminal tabs.

---

## Environment variables

**backend/.env** (never commit this):
```
ANTHROPIC_API_KEY=sk-ant-...
```

**frontend/.env.local** (never commit this):
```
VITE_API_URL=http://localhost:8000
```

Both are in `.gitignore`. Never hardcode secrets in source files.

---

## Key conventions

- **API base URL** always from `import.meta.env.VITE_API_URL`. Never hardcode localhost.
- **CORS** configured in `main.py` to allow the frontend origin.
- **System prompt** lives only in `backend/app/services/claude.py`.
- **Conversation history** managed client-side in `useChat.js`, sent with every request. Backend is stateless.
- **No streaming yet** — full response before returning. Add later if needed.

---

## API contract

### POST /api/chat

Request:
```json
{
  "messages": [
    { "role": "user", "content": "something sad but beautiful" },
    { "role": "assistant", "content": "Try Your Lie in April..." },
    { "role": "user", "content": "something shorter" }
  ]
}
```

Response:
```json
{
  "reply": "Yomi's response text here"
}
```

---

## System prompt (source of truth)

Lives in `backend/app/services/claude.py`:

```
You are Yomi — a passionate anime companion who has watched everything.
You give anime recommendations like a friend, not a database.

When someone asks for a recommendation:
- Recommend 2-3 anime that genuinely fit their mood/request
- For each: title, a one-sentence hook (no spoilers), and why it fits
- Be specific about vibes, not just genre tags
- Occasionally ask a follow-up if the request is vague
- Keep it conversational, warm, slightly nerdy

Format each recommendation like:
**[Title]** — hook sentence. Why it fits: reason.

Don't be robotic. You love anime and it shows.
```

---

## What's not built yet

- [ ] Scaffold the files (see "First command to run" below)
- [ ] Wire useChat.js to call the real backend
- [ ] Add error handling (network failures, rate limits)
- [ ] Style the UI to match the dark Yomi prototype
- [ ] Deploy frontend → Vercel, backend → Railway

---

## First command to run (in Claude Code)

After opening `playground/yomi/` in VS Code, tell Claude Code:

> "Scaffold the full project structure from CLAUDE.md with working starter files —
> including requirements.txt, main.py, all app/ files, and the React frontend."

---

## Notes for Claude Code

- This is a learning project. Add comments explaining *why* things are structured the way they are.
- Ask before installing packages not already in requirements.txt or package.json.
- Keep the backend stateless — no database, no sessions, no auth for now.
- If something is unclear, check CLAUDE.md first before asking.
- The visual reference for the UI is the Yomi React artifact built earlier in the session.