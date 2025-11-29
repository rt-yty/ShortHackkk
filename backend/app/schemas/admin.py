from pydantic import BaseModel


class EventSettingsBase(BaseModel):
    event_name: str
    welcome_text: str | None = None


class EventSettingsUpdate(BaseModel):
    event_name: str | None = None
    welcome_text: str | None = None


class EventSettingsResponse(EventSettingsBase):
    id: int
    
    class Config:
        from_attributes = True


class AnalyticsResponse(BaseModel):
    registrations: int
    tests_completed: int
    games_completed: int
    applications: int
    
    class Config:
        from_attributes = True


class UserAnalytics(BaseModel):
    email: str
    registered_at: str

