from fastapi import HTTPException, status
from google.oauth2 import id_token
from google.auth.transport import requests
from ..config import settings

GOOGLE_CLIENT_ID = settings.GOOGLE_API_KEY

def verify_google_token(token: str):
    try:
        payload = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        return {
            "provider_id": payload["sub"],
            "email": payload["email"],
            "name": payload.get("name", ""),
            "picture": payload.get("picture", ""),
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google token"
        )
