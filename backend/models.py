from pydantic import BaseModel, Field
from typing import Optional

class User(BaseModel):
    name: str
    email: str
    password: str
    xp: int = 0
    streak: int = 0
    age: Optional[int] = None
    gender: Optional[str] = None
    college: Optional[str] = None
    course: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    xp: int
    streak: int
    age: Optional[int] = None
    gender: Optional[str] = None
    college: Optional[str] = None
    course: Optional[str] = None