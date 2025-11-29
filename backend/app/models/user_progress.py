from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    points: Mapped[int] = mapped_column(Integer, default=0)
    completed_test: Mapped[bool] = mapped_column(Boolean, default=False)
    test_result: Mapped[str | None] = mapped_column(String(50), nullable=True)  # 'developer' | 'designer'
    completed_game: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="progress")

