from google import genai
from google.genai import types
from app.config import settings


client = genai.Client(api_key=settings.GOOGLE_API_KEY)

