from google import genai
from ..config import settings
from ..prompt import SYSTEM_PROMPT

client = genai.Client(api_key=settings.GOOGLE_API_KEY)

def generate_text(user_input: str):
    prompt = f"""
    System: {SYSTEM_PROMPT}
    User: {user_input}
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        raise RuntimeError(f"Error generating text: {e}")
