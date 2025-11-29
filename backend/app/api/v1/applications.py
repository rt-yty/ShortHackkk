import os
import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from sqlalchemy import select

from app.api.deps import AsyncSessionDep, CurrentUser
from app.core.config import settings
from app.models.application import Application
from app.models.user_progress import UserProgress
from app.schemas.application import ApplicationResponse

router = APIRouter(prefix="/applications", tags=["applications"])

# Points for submitting application
APPLICATION_POINTS = 35

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}


def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower()


@router.post("", response_model=dict)
async def submit_application(
    current_user: CurrentUser,
    db: AsyncSessionDep,
    full_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    direction: str = Form(...),
    motivation: str = Form(None),
    resume: UploadFile | None = File(None)
) -> dict:
    """Submit an internship application with optional resume upload."""
    # Check if already applied
    result = await db.execute(
        select(Application).where(Application.user_id == current_user.id)
    )
    existing_application = result.scalar_one_or_none()
    
    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application already submitted"
        )
    
    # Validate direction
    if direction not in ["developer", "designer"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid direction. Must be 'developer' or 'designer'"
        )
    
    resume_path = None
    
    # Handle resume upload
    if resume:
        # Validate file extension
        ext = get_file_extension(resume.filename)
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Check file size
        content = await resume.read()
        if len(content) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE // (1024*1024)}MB"
            )
        
        # Save file
        upload_dir = Path(settings.UPLOAD_DIR)
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        unique_filename = f"{current_user.id}_{uuid.uuid4().hex}{ext}"
        file_path = upload_dir / unique_filename
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        resume_path = str(file_path)
    
    # Create application
    application = Application(
        user_id=current_user.id,
        full_name=full_name,
        email=email,
        phone=phone,
        direction=direction,
        motivation=motivation,
        resume_path=resume_path
    )
    db.add(application)
    
    # Get user progress and add points
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
        await db.flush()
    
    progress.points += APPLICATION_POINTS
    
    await db.commit()
    await db.refresh(progress)
    
    return {
        "message": "Application submitted successfully",
        "points_earned": APPLICATION_POINTS,
        "total_points": progress.points
    }


@router.get("/me", response_model=ApplicationResponse | None)
async def get_my_application(
    current_user: CurrentUser,
    db: AsyncSessionDep
) -> ApplicationResponse | None:
    """Get current user's application."""
    result = await db.execute(
        select(Application).where(Application.user_id == current_user.id)
    )
    application = result.scalar_one_or_none()
    return application

