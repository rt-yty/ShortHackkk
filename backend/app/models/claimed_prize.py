from datetime import datetime
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class ClaimedPrize(Base):
    __tablename__ = "claimed_prizes"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    prize_id: Mapped[int] = mapped_column(ForeignKey("prizes.id"), nullable=False)
    claimed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="claimed_prizes")
    prize: Mapped["Prize"] = relationship("Prize", back_populates="claimed_by")

