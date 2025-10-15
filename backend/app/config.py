from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DB_URI: str
    GOOGLE_API_KEY: str
    FRONTEND_URL: str
    GOOGLE_CLIENT_ID: str
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings() # type: ignore