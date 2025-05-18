from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

# Enum schemas
class TaskStatusEnum(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DELAYED = "delayed"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"

class TaskPriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: Optional[str] = "user"
    is_active: Optional[bool] = True

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    budget: Optional[float] = 0.0
    status: Optional[str] = "planning"

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatusEnum = TaskStatusEnum.NOT_STARTED
    priority: TaskPriorityEnum = TaskPriorityEnum.MEDIUM
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = 0.0
    actual_hours: Optional[float] = 0.0
    completion_percentage: Optional[float] = 0.0
    project_id: int
    assignee_id: Optional[int] = None

class TaskDependencyBase(BaseModel):
    dependent_task_id: int
    prerequisite_task_id: int
    dependency_type: str = "finish-to-start"

class TaskCommentBase(BaseModel):
    content: str
    task_id: int
    user_id: int

class NotificationBase(BaseModel):
    user_id: int
    title: str
    message: str
    notification_type: str
    related_task_id: Optional[int] = None
    is_read: bool = False

class BudgetEntryBase(BaseModel):
    project_id: int
    description: str
    amount: float
    entry_type: str
    category: str
    date: datetime

# Create schemas
class UserCreate(UserBase):
    password: str

class ProjectCreate(ProjectBase):
    member_ids: List[int] = []

class TaskCreate(TaskBase):
    creator_id: int

class TaskDependencyCreate(TaskDependencyBase):
    pass

class TaskCommentCreate(TaskCommentBase):
    pass

class NotificationCreate(NotificationBase):
    pass

class BudgetEntryCreate(BudgetEntryBase):
    pass

# Update schemas
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    status: Optional[str] = None
    member_ids: Optional[List[int]] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatusEnum] = None
    priority: Optional[TaskPriorityEnum] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    completion_percentage: Optional[float] = None
    assignee_id: Optional[int] = None

class TaskCommentUpdate(BaseModel):
    content: Optional[str] = None

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class BudgetEntryUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    entry_type: Optional[str] = None
    category: Optional[str] = None
    date: Optional[datetime] = None

# Response schemas
class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class TaskDependencyResponse(TaskDependencyBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class TaskCommentResponse(TaskCommentBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class BudgetEntryResponse(BudgetEntryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class TaskResponse(TaskBase):
    id: int
    risk_score: float
    creator_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    dependencies: List[TaskDependencyResponse] = []
    comments: List[TaskCommentResponse] = []

    class Config:
        orm_mode = True

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    members: List[UserResponse] = []
    tasks: List[TaskResponse] = []

    class Config:
        orm_mode = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Risk prediction schemas
class RiskFactors(BaseModel):
    task_complexity: float = Field(..., ge=0, le=10)
    resource_availability: float = Field(..., ge=0, le=10)
    dependency_count: int = Field(..., ge=0)
    historical_delays: int = Field(..., ge=0)
    estimated_hours: float = Field(..., ge=0)
    priority_level: int = Field(..., ge=1, le=4)

class RiskPredictionResponse(BaseModel):
    risk_score: float
    risk_level: str
    contributing_factors: Dict[str, float]
    mitigation_suggestions: List[str]
