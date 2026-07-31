from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class QuizResult(BaseModel):
    career: str
    score: int
    total: int
    fitPercent: int
    date: str

class User(BaseModel):
    name: str
    email: str
    password: str
    age: Optional[int] = None
    gender: Optional[str] = None
    college: Optional[str] = None
    course: Optional[str] = None
    quiz_results: List[QuizResult] = []
    learning_style: Optional[str] = None
    career_result: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    age: Optional[int] = None
    gender: Optional[str] = None
    college: Optional[str] = None
    course: Optional[str] = None
    quiz_results: List[QuizResult] = []
    learning_style: Optional[str] = None
    career_result: Optional[str] = None