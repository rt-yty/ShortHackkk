from fastapi import APIRouter

from app.api.v1 import auth, users, test, games, prizes, applications, admin

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(test.router)
api_router.include_router(games.router)
api_router.include_router(prizes.router)
api_router.include_router(applications.router)
api_router.include_router(admin.router)

