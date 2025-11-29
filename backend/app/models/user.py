from datetime import datetime
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    progress: Mapped["UserProgress"] = relationship(
        "UserProgress", 
        back_populates="user", 
        uselist=False,
        cascade="all, delete-orphan"
    )
    claimed_prizes: Mapped[list["ClaimedPrize"]] = relationship(
        "ClaimedPrize", 
        back_populates="user",
        cascade="all, delete-orphan"
    )
    application: Mapped["Application"] = relationship(
        "Application", 
        back_populates="user", 
        uselist=False,
        cascade="all, delete-orphan"
    )

