from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import AsyncSessionDep, CurrentUser
from app.models.user_progress import UserProgress
from app.schemas.game import GameCompleteRequest, GameCompleteResponse

router = APIRouter(prefix="/games", tags=["games"])

# Base points for completing game
GAME_BASE_POINTS = 25
# Max bonus points
GAME_MAX_BONUS = 25


@router.post("/complete", response_model=GameCompleteResponse)
async def complete_game(
    game_data: GameCompleteRequest,
    current_user: CurrentUser,
    db: AsyncSessionDep
) -> GameCompleteResponse:
    """Complete a game and award points."""
    # Get user progress
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
        await db.flush()
    
    # Check if game already completed
    if progress.completed_game:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Game already completed"
        )
    
    # Validate game type
    if game_data.game_type not in ["bug_catcher", "color_match"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid game type. Must be 'bug_catcher' or 'color_match'"
        )
    
    # Calculate points: base points + bonus based on score
    bonus_points = min(game_data.score // 2, GAME_MAX_BONUS)
    points_earned = GAME_BASE_POINTS + bonus_points
    
    # Update progress
    progress.completed_game = True
    progress.points += points_earned
    
    await db.commit()
    await db.refresh(progress)
    
    return GameCompleteResponse(
        points_earned=points_earned,
        total_points=progress.points,
        message=f"Game completed! You earned {points_earned} points ({GAME_BASE_POINTS} base + {bonus_points} bonus)"
    )

