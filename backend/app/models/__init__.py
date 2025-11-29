from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.prize import Prize
from app.models.claimed_prize import ClaimedPrize
from app.models.test_question import TestQuestion
from app.models.application import Application
from app.models.event_settings import EventSettings
from app.models.base import Base

__all__ = [
    "Base",
    "User",
    "UserProgress",
    "Prize",
    "ClaimedPrize",
    "TestQuestion",
    "Application",
    "EventSettings",
]

