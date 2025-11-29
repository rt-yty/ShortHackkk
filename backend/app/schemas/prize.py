from datetime import datetime
from pydantic import BaseModel


class PrizeBase(BaseModel):
    name: str
    points: int
    quantity: int = 0
    description: str | None = None


class PrizeCreate(PrizeBase):
    pass


class PrizeUpdate(BaseModel):
    name: str | None = None
    points: int | None = None
    quantity: int | None = None
    description: str | None = None


class PrizeResponse(PrizeBase):
    id: int
    
    class Config:
        from_attributes = True


class ClaimedPrizeResponse(BaseModel):
    id: int
    prize_id: int
    claimed_at: datetime
    prize: PrizeResponse
    
    class Config:
        from_attributes = True

