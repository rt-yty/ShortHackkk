from sqlalchemy import Integer, String, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class TestQuestion(Base):
    __tablename__ = "test_questions"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    question: Mapped[str] = mapped_column(String(500), nullable=False)
    options: Mapped[list] = mapped_column(JSON, nullable=False)  # [{"text": "...", "type": "developer|designer"}]
    order: Mapped[int] = mapped_column(Integer, default=0)

