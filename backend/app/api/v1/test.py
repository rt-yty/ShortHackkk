from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import AsyncSessionDep, CurrentUser
from app.models.test_question import TestQuestion
from app.models.user_progress import UserProgress
from app.schemas.test import TestQuestionResponse, TestCompleteRequest

router = APIRouter(prefix="/test", tags=["test"])

# Points for completing test
TEST_COMPLETE_POINTS = 15


@router.get("/questions", response_model=list[TestQuestionResponse])
async def get_test_questions(
    current_user: CurrentUser,
    db: AsyncSessionDep
) -> list[TestQuestionResponse]:
    """Get all test questions ordered by order field."""
    result = await db.execute(
        select(TestQuestion).order_by(TestQuestion.order)
    )
    questions = result.scalars().all()
    return questions


@router.post("/complete", response_model=dict)
async def complete_test(
    test_data: TestCompleteRequest,
    current_user: CurrentUser,
    db: AsyncSessionDep
) -> dict:
    """Complete the test and save result."""
    # Get user progress
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
    
    # Check if test already completed
    if progress.completed_test:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Test already completed"
        )
    
    # Validate result
    if test_data.result not in ["developer", "designer"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid test result. Must be 'developer' or 'designer'"
        )
    
    # Update progress
    progress.completed_test = True
    progress.test_result = test_data.result
    progress.points += TEST_COMPLETE_POINTS
    
    await db.commit()
    await db.refresh(progress)
    
    return {
        "message": "Test completed successfully",
        "result": test_data.result,
        "points_earned": TEST_COMPLETE_POINTS,
        "total_points": progress.points
    }


@router.post("/skip", response_model=dict)
async def skip_test(
    current_user: CurrentUser,
    db: AsyncSessionDep
) -> dict:
    """Skip the test (no points awarded)."""
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
    
    if progress.completed_test:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Test already completed"
        )
    
    progress.completed_test = True
    # test_result remains None when skipped
    
    await db.commit()
    
    return {"message": "Test skipped"}


@router.post("/set-direction", response_model=dict)
async def set_direction(
    test_data: TestCompleteRequest,
    current_user: CurrentUser,
    db: AsyncSessionDep
) -> dict:
    """Manually set direction after skipping test."""
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User progress not found"
        )
    
    if test_data.result not in ["developer", "designer"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid direction. Must be 'developer' or 'designer'"
        )
    
    progress.test_result = test_data.result
    await db.commit()
    
    return {
        "message": "Direction set successfully",
        "direction": test_data.result
    }

