# Yomi — Anime Recommendation Chat

Yomi is a fullstack chat app powered by Claude. Tell it your mood and it recommends anime like a knowledgeable friend.

---

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | React + Vite (JavaScript)   |
| Backend  | Python + FastAPI            |
| AI       | Anthropic Claude API        |

---

## Prerequisites

- **Python 3.10+** (or a conda environment)
- **Node.js 18+**
- An **Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)

---

## First-time setup

Do this once before running the app.

### 1. Add your API key

Open `backend/.env` and replace the placeholder:

```
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
```

This file is gitignored. Never commit it.

---

### 2. Install Python dependencies

```bash
conda activate yomi        # or: python -m venv backend/venv && backend\venv\Scripts\activate
pip install -r backend/requirements.txt
```

---

### 3. Install Node dependencies (one-time, from the `yomi/` root)

```bash
npm install                # installs concurrently (used by npm run fastapi)
cd frontend && npm install # installs React + Vite
cd ..
```

---

## Running the app

Make sure your Python environment is active, then from the `yomi/` root:

```bash
npm run fastapi
```

That's it. Both servers start together:

| Server   | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:5173    |
| Backend  | http://localhost:8000    |

Output is colour-coded — **[API]** in cyan is the FastAPI backend, **[UI]** in magenta is the Vite frontend. Press `Ctrl+C` to stop both.

---

### Running servers separately (optional)

If you prefer two terminals:

**Terminal 1 — backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```

---

## How it works

1. You type a vibe or mood into the chat input (e.g. *"something sad but beautiful"*).
2. The frontend sends the recent conversation history to `POST /api/chat` on the backend.
3. The backend passes that history to Claude along with Yomi's system prompt.
4. Claude replies as Yomi — recommending 2–3 anime that fit your mood.
5. The reply appears in the chat. Conversation continues from there.

The backend is **stateless** — it doesn't store anything. The frontend keeps the full conversation history in localStorage and sends the last 10 turns with every request.

---

## Project structure

```
yomi/
├── package.json                 ← root scripts (npm run fastapi)
├── backend/
│   ├── main.py                  ← FastAPI app, CORS config
│   ├── requirements.txt
│   ├── .env                     ← your API key (gitignored)
│   └── app/
│       ├── config.py            ← loads the API key from .env
│       ├── routes/
│       │   └── chat.py          ← POST /api/chat endpoint
│       └── services/
│           └── claude.py        ← Claude API call + Yomi's system prompt
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.local               ← VITE_API_URL (gitignored)
│   └── src/
│       ├── main.jsx             ← React entry point
│       ├── App.jsx              ← router (switches between pages)
│       ├── pages/
│       │   ├── Home.jsx         ← landing page with feature cards
│       │   ├── Chat.jsx         ← Yomi AI chat
│       │   ├── CurrentlyWatching.jsx
│       │   ├── RecentlyWatched.jsx
│       │   ├── Watchlist.jsx
│       │   └── Favourites.jsx
│       ├── components/
│       │   ├── NavBar.jsx       ← sticky top navigation
│       │   ├── ChatWindow.jsx   ← scrollable message list
│       │   ├── MessageBubble.jsx
│       │   ├── InputBar.jsx
│       │   ├── SuggestionCards.jsx ← Yomi's auto-detected list suggestions
│       │   └── ListUI.jsx       ← shared UI for all list pages
│       └── hooks/
│           ├── useChat.js       ← chat state, API calls, localStorage persistence
│           └── useAnimeList.js  ← generic localStorage list hook
│
├── .gitignore
├── CLAUDE.md                    ← instructions for Claude Code
└── README.md                    ← you are here
```

---

## Customising Yomi's personality

Edit the `SYSTEM_PROMPT` in `backend/app/services/claude.py`. That's the only place that controls how Yomi talks and what format it uses for recommendations.

---

## Common issues

| Problem | Fix |
|---|---|
| `ANTHROPIC_API_KEY is not set` | Check `backend/.env` has your real key |
| `npm run fastapi` — uvicorn not found | Make sure your conda/venv environment is active before running |
| Frontend can't reach backend | Backend must be running on port 8000 — check the `[API]` output for errors |
| CORS error in browser | Backend CORS is set to `localhost:5173` — make sure Vite is on that port |
| `npm install` fails at root | Make sure you're in the `yomi/` folder, not inside `frontend/` |
