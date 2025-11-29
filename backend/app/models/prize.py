from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class Prize(Base):
    __tablename__ = "prizes"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Relationships
    claimed_by: Mapped[list["ClaimedPrize"]] = relationship(
        "ClaimedPrize", 
        back_populates="prize",
        cascade="all, delete-orphan"
    )

