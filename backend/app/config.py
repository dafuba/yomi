from dotenv import load_dotenv
import os

# Load .env from the backend directory
load_dotenv()

# The API key is read once at startup and used by the claude service
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY is not set. Add it to backend/.env")
