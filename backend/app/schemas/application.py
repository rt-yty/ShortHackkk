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


class ApplicationResponse(ApplicationBase):
    id: int
    user_id: int
    resume_path: str | None = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ApplicationWithUser(ApplicationResponse):
    user_email: str

