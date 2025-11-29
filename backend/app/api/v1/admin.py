from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select, func

from app.api.deps import AsyncSessionDep, CurrentAdmin
from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.application import Application
from app.models.prize import Prize
from app.models.test_question import TestQuestion
from app.models.event_settings import EventSettings
from app.schemas.admin import (
    AnalyticsResponse, 
    EventSettingsResponse, 
    EventSettingsUpdate,
    UserAnalytics
)
from app.schemas.prize import PrizeCreate, PrizeUpdate, PrizeResponse
from app.schemas.test import TestQuestionCreate, TestQuestionUpdate, TestQuestionResponse
from app.schemas.application import ApplicationWithUser

router = APIRouter(prefix="/admin", tags=["admin"])


# ============== Analytics ==============

@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> AnalyticsResponse:
    """Get analytics data."""
    # Count registrations
    result = await db.execute(select(func.count(User.id)).where(User.is_admin == False))
    registrations = result.scalar()
    
    # Count completed tests
    result = await db.execute(
        select(func.count(UserProgress.id)).where(UserProgress.completed_test == True)
    )
    tests_completed = result.scalar()
    
    # Count completed games
    result = await db.execute(
        select(func.count(UserProgress.id)).where(UserProgress.completed_game == True)
    )
    games_completed = result.scalar()
    
    # Count applications
    result = await db.execute(select(func.count(Application.id)))
    applications = result.scalar()
    
    return AnalyticsResponse(
        registrations=registrations or 0,
        tests_completed=tests_completed or 0,
        games_completed=games_completed or 0,
        applications=applications or 0
    )


@router.get("/users", response_model=list[UserAnalytics])
async def get_users(
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> list[UserAnalytics]:
    """Get list of registered users."""
    result = await db.execute(
        select(User)
        .where(User.is_admin == False)
        .order_by(User.created_at.desc())
    )
    users = result.scalars().all()
    
    return [
        UserAnalytics(
            email=user.email,
            registered_at=user.created_at.isoformat()
        )
        for user in users
    ]


@router.get("/applications", response_model=list[ApplicationWithUser])
async def get_applications(
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> list[ApplicationWithUser]:
    """Get all applications."""
    result = await db.execute(
        select(Application, User)
        .join(User, Application.user_id == User.id)
        .order_by(Application.created_at.desc())
    )
    rows = result.all()
    
    return [
        ApplicationWithUser(
            id=app.id,
            user_id=app.user_id,
            full_name=app.full_name,
            email=app.email,
            phone=app.phone,
            direction=app.direction,
            motivation=app.motivation,
            resume_path=app.resume_path,
            created_at=app.created_at,
            user_email=user.email
        )
        for app, user in rows
    ]


# ============== Event Settings ==============

@router.get("/settings", response_model=EventSettingsResponse)
async def get_settings(
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> EventSettingsResponse:
    """Get event settings."""
    result = await db.execute(select(EventSettings))
    settings = result.scalar_one_or_none()
    
    if not settings:
        # Create default settings
        settings = EventSettings()
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    
    return settings


@router.patch("/settings", response_model=EventSettingsResponse)
async def update_settings(
    settings_data: EventSettingsUpdate,
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> EventSettingsResponse:
    """Update event settings."""
    result = await db.execute(select(EventSettings))
    settings = result.scalar_one_or_none()
    
    if not settings:
        settings = EventSettings()
        db.add(settings)
    
    # Update fields
    if settings_data.event_name is not None:
        settings.event_name = settings_data.event_name
    if settings_data.welcome_text is not None:
        settings.welcome_text = settings_data.welcome_text
    
    await db.commit()
    await db.refresh(settings)
    
    return settings


# ============== Prizes Management ==============

@router.get("/prizes", response_model=list[PrizeResponse])
async def admin_get_prizes(
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> list[PrizeResponse]:
    """Get all prizes for admin."""
    result = await db.execute(select(Prize).order_by(Prize.points))
    prizes = result.scalars().all()
    return prizes


@router.post("/prizes", response_model=PrizeResponse, status_code=status.HTTP_201_CREATED)
async def create_prize(
    prize_data: PrizeCreate,
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> PrizeResponse:
    """Create a new prize."""
    prize = Prize(**prize_data.model_dump())
    db.add(prize)
    await db.commit()
    await db.refresh(prize)
    return prize


@router.put("/prizes/{prize_id}", response_model=PrizeResponse)
async def update_prize(
    prize_id: int,
    prize_data: PrizeUpdate,
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> PrizeResponse:
    """Update a prize."""
    result = await db.execute(select(Prize).where(Prize.id == prize_id))
    prize = result.scalar_one_or_none()
    
    if not prize:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prize not found"
        )
    
    # Update fields
    update_data = prize_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(prize, field, value)
    
    await db.commit()
    await db.refresh(prize)
    return prize


@router.delete("/prizes/{prize_id}")
async def delete_prize(
    prize_id: int,
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> dict:
    """Delete a prize."""
    result = await db.execute(select(Prize).where(Prize.id == prize_id))
    prize = result.scalar_one_or_none()
    
    if not prize:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prize not found"
        )
    
    await db.delete(prize)
    await db.commit()
    
    return {"message": "Prize deleted successfully"}


# ============== Test Questions Management ==============

@router.get("/questions", response_model=list[TestQuestionResponse])
async def admin_get_questions(
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> list[TestQuestionResponse]:
    """Get all test questions for admin."""
    result = await db.execute(select(TestQuestion).order_by(TestQuestion.order))
    questions = result.scalars().all()
    return questions


@router.post("/questions", response_model=TestQuestionResponse, status_code=status.HTTP_201_CREATED)
async def create_question(
    question_data: TestQuestionCreate,
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> TestQuestionResponse:
    """Create a new test question."""
    question = TestQuestion(
        question=question_data.question,
        options=[opt.model_dump() for opt in question_data.options],
        order=question_data.order
    )
    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question


@router.put("/questions/{question_id}", response_model=TestQuestionResponse)
async def update_question(
    question_id: int,
    question_data: TestQuestionUpdate,
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> TestQuestionResponse:
    """Update a test question."""
    result = await db.execute(select(TestQuestion).where(TestQuestion.id == question_id))
    question = result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Update fields
    if question_data.question is not None:
        question.question = question_data.question
    if question_data.options is not None:
        question.options = [opt.model_dump() for opt in question_data.options]
    if question_data.order is not None:
        question.order = question_data.order
    
    await db.commit()
    await db.refresh(question)
    return question


@router.delete("/questions/{question_id}")
async def delete_question(
    question_id: int,
    current_admin: CurrentAdmin,
    db: AsyncSessionDep
) -> dict:
    """Delete a test question."""
    result = await db.execute(select(TestQuestion).where(TestQuestion.id == question_id))
    question = result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    await db.delete(question)
    await db.commit()
    
    return {"message": "Question deleted successfully"}

