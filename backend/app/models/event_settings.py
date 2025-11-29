from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class EventSettings(Base):
    __tablename__ = "event_settings"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    event_name: Mapped[str] = mapped_column(String(255), default="X5 Tech Career Day 2024")
    welcome_text: Mapped[str | None] = mapped_column(
        Text, 
        default="Добро пожаловать в X5 For Students! Пройдите задания и получите шанс на стажировку в X5 Tech."
    )

