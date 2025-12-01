from datetime import datetime
from pydantic import BaseModel, EmailStr


class ApplicationBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    direction: str  # 'developer' | 'designer'
    motivation: str | None = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationResponse(BaseModel):
    """Response schema for application - uses str for email since data is already validated."""
    id: int
    user_id: int
    full_name: str
    email: str  # Using str instead of EmailStr for response to accept any stored email
    phone: str
    direction: str
    motivation: str | None = None
    resume_path: str | None = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ApplicationWithUser(ApplicationResponse):
    user_email: str

