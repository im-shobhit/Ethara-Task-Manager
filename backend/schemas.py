# backend/schemas.py
from pydantic import BaseModel
from typing import List, Optional

# --- TASK SCHEMAS ---
class TaskBase(BaseModel):
    title: str
    description: str
    status: str = "pending"
    project_id: int
    assignee_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int

    class Config:
        from_attributes = True  # This tells Pydantic to read data from SQLAlchemy models

# --- PROJECT SCHEMAS ---
class ProjectBase(BaseModel):
    name: str
    description: str

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int
    tasks: List[Task] = []

    class Config:
        from_attributes = True

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: str = "member"

class User(UserBase):
    id: int
    role: str
    # Notice we DO NOT put the password here, so it never accidentally leaks to the frontend!

    class Config:
        from_attributes = True