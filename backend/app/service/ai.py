import json
import re
import asyncio
import logging
from fastapi import HTTPException
from google import genai
from ..config import settings
from ..prompt import SYSTEM_PROMPT

logger = logging.getLogger(__name__)
client = genai.Client(api_key=settings.GOOGLE_API_KEY)
MAX_RETRIES = 2

async def generate_text(user_input: str):
    messages = (
        f"System: {SYSTEM_PROMPT}\n"
        f"User: {user_input}\n"
    )

    for attempt in range(MAX_RETRIES):
        try:
            response = await asyncio.to_thread(
                client.models.generate_content,
                model="gemini-2.5-flash",
                contents=messages
            )

            text = (response.text or "").strip()
            if not text:
                raise HTTPException(status_code=500, detail="AI returned empty response")

            text = re.sub(r"^```(json)?\s*|\s*```$", "", text, flags=re.MULTILINE).strip()

            try:
                data = json.loads(text)
            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON from Gemini (attempt {attempt+1}): {text[:300]}")
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(1)
                    continue
                raise HTTPException(status_code=500, detail="AI returned invalid JSON")

            if not isinstance(data, dict) or "roadmap_json" not in data:
                raise HTTPException(status_code=500, detail="AI returned malformed roadmap JSON")

            return data

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"AI generation failed (attempt {attempt+1}): {e}")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(1)
                continue
            raise HTTPException(status_code=500, detail="AI generation failed")
