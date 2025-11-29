from pydantic import BaseModel


class GameCompleteRequest(BaseModel):
    score: int
    game_type: str  # 'bug_catcher' | 'color_match'


class GameCompleteResponse(BaseModel):
    points_earned: int
    total_points: int
    message: str

