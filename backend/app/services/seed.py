"""
Seed script to populate initial data.
Run with: python -m app.services.seed
"""
import asyncio
from sqlalchemy import select

from app.core.database import async_session_maker, engine
from app.core.security import get_password_hash
from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.prize import Prize
from app.models.test_question import TestQuestion
from app.models.event_settings import EventSettings
from app.models.base import Base
# Import all models to register them with Base.metadata
from app.models import *  # noqa: F401, F403


# Default test questions
DEFAULT_QUESTIONS = [
    {
        "question": "Что вас больше привлекает в работе?",
        "options": [
            {"text": "Решение сложных логических задач", "type": "developer"},
            {"text": "Создание красивых и удобных интерфейсов", "type": "designer"},
        ],
        "order": 1
    },
    {
        "question": "Какой инструмент вы бы выбрали для изучения?",
        "options": [
            {"text": "VS Code или другую IDE", "type": "developer"},
            {"text": "Figma или Sketch", "type": "designer"},
        ],
        "order": 2
    },
    {
        "question": "Что для вас важнее в проекте?",
        "options": [
            {"text": "Чистый и оптимизированный код", "type": "developer"},
            {"text": "Гармоничная цветовая палитра", "type": "designer"},
        ],
        "order": 3
    },
    {
        "question": "Как вы предпочитаете учиться?",
        "options": [
            {"text": "Читать документацию и разбирать примеры кода", "type": "developer"},
            {"text": "Изучать дизайн-системы и тренды", "type": "designer"},
        ],
        "order": 4
    },
    {
        "question": "Какая задача кажется вам интереснее?",
        "options": [
            {"text": "Оптимизировать алгоритм для ускорения работы приложения", "type": "developer"},
            {"text": "Провести UX-исследование для улучшения пользовательского опыта", "type": "designer"},
        ],
        "order": 5
    },
    {
        "question": "Что вас больше вдохновляет?",
        "options": [
            {"text": "Автоматизация рутинных процессов", "type": "developer"},
            {"text": "Создание уникального визуального стиля", "type": "designer"},
        ],
        "order": 6
    },
]


async def seed_admin():
    """Create admin user if not exists."""
    async with async_session_maker() as session:
        # Check if admin exists
        result = await session.execute(
            select(User).where(User.email == "admin@x5.ru")
        )
        admin = result.scalar_one_or_none()
        
        if not admin:
            admin = User(
                email="admin@x5.ru",
                hashed_password=get_password_hash("admin"),
                is_admin=True
            )
            session.add(admin)
            await session.commit()
            print("✓ Admin user created (admin@x5.ru / admin)")
        else:
            print("• Admin user already exists")


async def seed_questions():
    """Seed default test questions."""
    async with async_session_maker() as session:
        # Check if questions exist
        result = await session.execute(select(TestQuestion))
        existing_questions = result.scalars().all()
        
        if not existing_questions:
            for q_data in DEFAULT_QUESTIONS:
                question = TestQuestion(**q_data)
                session.add(question)
            await session.commit()
            print(f"✓ {len(DEFAULT_QUESTIONS)} test questions created")
        else:
            print(f"• {len(existing_questions)} questions already exist")


async def seed_event_settings():
    """Seed default event settings."""
    async with async_session_maker() as session:
        # Check if settings exist
        result = await session.execute(select(EventSettings))
        settings = result.scalar_one_or_none()
        
        if not settings:
            settings = EventSettings(
                event_name="X5 Tech Career Day 2024",
                welcome_text="Добро пожаловать в X5 For Students! Пройдите задания и получите шанс на стажировку в X5 Tech."
            )
            session.add(settings)
            await session.commit()
            print("✓ Event settings created")
        else:
            print("• Event settings already exist")


async def create_tables():
    """Create all tables if they don't exist."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✓ Database tables created/verified")


async def main():
    """Run all seed functions."""
    print("\n🌱 Starting database seeding...\n")
    
    # Create tables first
    await create_tables()
    
    await seed_admin()
    await seed_questions()
    await seed_event_settings()
    
    # Призы НЕ добавляются автоматически - их должен добавить админ вручную
    print("ℹ️  Призы не добавлены - добавьте их через админ-панель")
    
    print("\n✅ Seeding completed!\n")


if __name__ == "__main__":
    asyncio.run(main())

