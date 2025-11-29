from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_admin: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserProgressBase(BaseModel):
    points: int = 0
    completed_test: bool = False
    test_result: str | None = None
    completed_game: bool = False


class UserProgressResponse(UserProgressBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True


class UserWithProgress(UserResponse):
    progress: UserProgressResponse | None = None

