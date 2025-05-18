from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean, Table, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from datetime import datetime

from app.db.database import Base

# Association table for many-to-many relationships
user_project = Table(
    "user_project",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("project_id", Integer, ForeignKey("projects.id"), primary_key=True)
)

class TaskStatus(enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DELAYED = "delayed"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"

class TaskPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    projects = relationship("Project", secondary=user_project, back_populates="members")
    assigned_tasks = relationship("Task", back_populates="assignee")
    created_tasks = relationship("Task", back_populates="creator", foreign_keys="Task.creator_id")
    notifications = relationship("Notification", back_populates="user")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    budget = Column(Float)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    members = relationship("User", secondary=user_project, back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(Enum(TaskStatus), default=TaskStatus.NOT_STARTED)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    start_date = Column(DateTime(timezone=True))
    due_date = Column(DateTime(timezone=True))
    estimated_hours = Column(Float)
    actual_hours = Column(Float, default=0)
    completion_percentage = Column(Float, default=0)
    risk_score = Column(Float, default=0)  # AI-calculated risk score
    
    # Foreign keys
    project_id = Column(Integer, ForeignKey("projects.id"))
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="assigned_tasks", foreign_keys=[assignee_id])
    creator = relationship("User", back_populates="created_tasks", foreign_keys=[creator_id])
    dependencies = relationship("TaskDependency", back_populates="dependent_task", foreign_keys="TaskDependency.dependent_task_id", cascade="all, delete-orphan")
    predecessors = relationship("TaskDependency", back_populates="prerequisite_task", foreign_keys="TaskDependency.prerequisite_task_id", cascade="all, delete-orphan")
    comments = relationship("TaskComment", back_populates="task", cascade="all, delete-orphan")

class TaskDependency(Base):
    __tablename__ = "task_dependencies"
    
    id = Column(Integer, primary_key=True, index=True)
    dependent_task_id = Column(Integer, ForeignKey("tasks.id"), index=True)
    prerequisite_task_id = Column(Integer, ForeignKey("tasks.id"), index=True)
    dependency_type = Column(String)  # e.g., "finish-to-start", "start-to-start", etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    dependent_task = relationship("Task", back_populates="dependencies", foreign_keys=[dependent_task_id])
    prerequisite_task = relationship("Task", back_populates="predecessors", foreign_keys=[prerequisite_task_id])

class TaskComment(Base):
    __tablename__ = "task_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    task = relationship("Task", back_populates="comments")
    user = relationship("User")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    notification_type = Column(String)  # e.g., "task_due", "task_assigned", "risk_alert"
    related_task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="notifications")
    related_task = relationship("Task")

class BudgetEntry(Base):
    __tablename__ = "budget_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    description = Column(String)
    amount = Column(Float)
    entry_type = Column(String)  # "planned", "actual", "forecast"
    category = Column(String)
    date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project")
