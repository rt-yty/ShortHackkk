from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api.deps import AsyncSessionDep, CurrentUser
from app.models.prize import Prize
from app.models.claimed_prize import ClaimedPrize
from app.models.user_progress import UserProgress
from app.schemas.prize import PrizeResponse

router = APIRouter(prefix="/prizes", tags=["prizes"])


@router.get("", response_model=list[PrizeResponse])
async def get_prizes(
    db: AsyncSessionDep
) -> list[PrizeResponse]:
    """Get all prizes ordered by points."""
    result = await db.execute(
        select(Prize).order_by(Prize.points)
    )
    prizes = result.scalars().all()
    return prizes


@router.post("/{prize_id}/claim", response_model=dict)
async def claim_prize(
    prize_id: int,
    current_user: CurrentUser,
    db: AsyncSessionDep
) -> dict:
    """Claim a prize."""
    # Get prize
    result = await db.execute(select(Prize).where(Prize.id == prize_id))
    prize = result.scalar_one_or_none()
    
    if not prize:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prize not found"
        )
    
    # Check if prize is available
    if prize.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prize is out of stock"
        )
    
    # Get user progress
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User has no points"
        )
    
    # Check if user has enough points
    if progress.points < prize.points:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough points. Need {prize.points}, have {progress.points}"
        )
    
    # Check if already claimed
    result = await db.execute(
        select(ClaimedPrize).where(
            ClaimedPrize.user_id == current_user.id,
            ClaimedPrize.prize_id == prize_id
        )
    )
    existing_claim = result.scalar_one_or_none()
    
    if existing_claim:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prize already claimed"
        )
    
    # Claim the prize
    claimed_prize = ClaimedPrize(
        user_id=current_user.id,
        prize_id=prize_id
    )
    db.add(claimed_prize)
    
    # Deduct points and decrease quantity
    progress.points -= prize.points
    prize.quantity -= 1
    
    await db.commit()
    
    return {
        "message": f"Successfully claimed '{prize.name}'",
        "remaining_points": progress.points,
        "prize_name": prize.name
    }

