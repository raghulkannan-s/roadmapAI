import json
import re
from fastapi import HTTPException
from google import genai
from ..config import settings
from ..prompt import SYSTEM_PROMPT

client = genai.Client(api_key=settings.GOOGLE_API_KEY)
MAX_RETRIES = 2

async def generate_text(user_input: str):
    prompt = (
        f"System: {SYSTEM_PROMPT}\n"
        f"User: {user_input}\n"
    )

    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            text = (response.text or "").strip()
            if not text:
                raise HTTPException(status_code=500, detail="AI returned empty response")

            text = re.sub(r"^```json\s*|```$", "", text, flags=re.MULTILINE).strip()
            try:
                data = json.loads(text)
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail=f"AI returned invalid JSON: {text}")

            return data

        except Exception as e:
            if attempt == MAX_RETRIES - 1:
                raise HTTPException(status_code=500, detail=f"AI request failed: {e}")
            continue
