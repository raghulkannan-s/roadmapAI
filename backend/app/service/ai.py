import json
from google import genai
from ..config import settings
from pydantic import ValidationError
from fastapi import HTTPException
from ..prompt import SYSTEM_PROMPT
from ..schemas import RoadmapResponse

client = genai.Client(api_key=settings.GOOGLE_API_KEY)

MAX_RETRIES = 2

async def generate_text(user_input: str):
    prompt = f"""
    System: {SYSTEM_PROMPT}
    User: {user_input}
    """
    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            text = response.text
            if not text:
                raise HTTPException(status_code=500, detail="AI returned empty response")
            data = json.loads(text)
            RoadmapResponse.parse_obj(data)
            return data
        except (json.JSONDecodeError, ValidationError):
            if attempt == MAX_RETRIES - 1:
                raise HTTPException(status_code=500, detail="AI returned invalid roadmap JSON")
            continue
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI request failed: {e}")