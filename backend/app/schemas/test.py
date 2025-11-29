from pydantic import BaseModel


class TestOptionSchema(BaseModel):
    text: str
    type: str  # 'developer' | 'designer'


class TestQuestionBase(BaseModel):
    question: str
    options: list[TestOptionSchema]
    order: int = 0


class TestQuestionCreate(TestQuestionBase):
    pass


class TestQuestionUpdate(BaseModel):
    question: str | None = None
    options: list[TestOptionSchema] | None = None
    order: int | None = None


class TestQuestionResponse(TestQuestionBase):
    id: int
    
    class Config:
        from_attributes = True


class TestCompleteRequest(BaseModel):
    result: str  # 'developer' | 'designer'

