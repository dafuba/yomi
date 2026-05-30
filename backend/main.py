from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router

app = FastAPI(title="Yomi API")

# Allow the Vite dev server to call this API.
# In production, replace "*" with your actual Vercel domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten to Vercel URL after first deploy
    allow_methods=["*"],
    allow_headers=["*"],
)

# All chat routes live under /api
app.include_router(chat_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "Yomi backend is running"}
