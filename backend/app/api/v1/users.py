from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api.deps import AsyncSessionDep, CurrentUser
from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.claimed_prize import ClaimedPrize
from app.schemas.user import UserResponse, UserProgressResponse, UserWithProgress
from app.schemas.prize import ClaimedPrizeResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserWithProgress)
async def get_current_user_info(
    current_user: CurrentUser,
    db: AsyncSessionDep
) -> UserWithProgress:
    """Get current user information with progress."""
    # Load user with progress
    result = await db.execute(
        select(User)
        .options(selectinload(User.progress))
        .where(User.id == current_user.id)
    )
    user = result.scalar_one()
    return user


@router.get("/me/progress", response_model=UserProgressResponse)
async def get_user_progress(
    current_user: CurrentUser,
    db: AsyncSessionDep
) -> UserProgressResponse:
    """Get current user's progress."""
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        # Create progress if not exists
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
    
    return progress


@router.get("/me/claimed-prizes", response_model=list[ClaimedPrizeResponse])
async def get_claimed_prizes(
    current_user: CurrentUser,
    db: AsyncSessionDep
) -> list[ClaimedPrizeResponse]:
    """Get list of prizes claimed by current user."""
    result = await db.execute(
        select(ClaimedPrize)
        .options(selectinload(ClaimedPrize.prize))
        .where(ClaimedPrize.user_id == current_user.id)
        .order_by(ClaimedPrize.claimed_at.desc())
    )
    claimed_prizes = result.scalars().all()
    return claimed_prizes

