from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.schemas import TaskCreate, TaskUpdate, TaskResponse
from app.core.auth import get_current_active_user
from app.db.database import get_db
from app.db.models import Task, Project, User, TaskStatus

router = APIRouter()

@router.get("/", response_model=List[TaskResponse])
async def read_tasks(
    skip: int = 0,
    limit: int = 100,
    project_id: int = None,
    status: str = None,
    assignee_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Retrieve tasks with optional filtering.
    """
    query = db.query(Task)
    
    # Filter by project_id if provided
    if project_id is not None:
        # Check if user has access to this project
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )
        
        if current_user.role != "admin" and current_user not in project.members:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
        
        query = query.filter(Task.project_id == project_id)
    else:
        # If no project_id is provided, only show tasks from projects the user is a member of
        if current_user.role != "admin":
            query = query.join(Project).filter(
                Project.members.any(User.id == current_user.id)
            )
    
    # Filter by status if provided
    if status is not None:
        try:
            task_status = TaskStatus(status)
            query = query.filter(Task.status == task_status)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status value: {status}",
            )
    
    # Filter by assignee_id if provided
    if assignee_id is not None:
        query = query.filter(Task.assignee_id == assignee_id)
    
    # Execute query with pagination
    tasks = query.offset(skip).limit(limit).all()
    return tasks

@router.post("/", response_model=TaskResponse)
async def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Create new task.
    """
    # Check if project exists and user has access
    project = db.query(Project).filter(Project.id == task_in.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    if current_user.role != "admin" and current_user not in project.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if assignee exists and is a member of the project
    if task_in.assignee_id:
        assignee = db.query(User).filter(User.id == task_in.assignee_id).first()
        if not assignee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignee not found",
            )
        if assignee not in project.members:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assignee is not a member of the project",
            )
    
    # Create task
    task = Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        start_date=task_in.start_date,
        due_date=task_in.due_date,
        estimated_hours=task_in.estimated_hours,
        actual_hours=task_in.actual_hours,
        completion_percentage=task_in.completion_percentage,
        project_id=task_in.project_id,
        assignee_id=task_in.assignee_id,
        creator_id=current_user.id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    
    # Calculate risk score (placeholder for ML integration)
    # In a real implementation, this would call the ML service
    task.risk_score = 0.0
    db.add(task)
    db.commit()
    db.refresh(task)
    
    return task

@router.get("/{task_id}", response_model=TaskResponse)
async def read_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific task by id.
    """
    task = db.query(Task).options(
        joinedload(Task.project),
        joinedload(Task.dependencies),
        joinedload(Task.predecessors),
        joinedload(Task.comments),
    ).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    # Check if user has access to this task's project
    if current_user.role != "admin" and current_user not in task.project.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update a task.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    # Check if user has access to this task's project
    project = db.query(Project).filter(Project.id == task.project_id).first()
    if current_user.role != "admin" and current_user not in project.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if new assignee exists and is a member of the project
    if task_in.assignee_id is not None:
        if task_in.assignee_id > 0:  # Only check if not removing assignee
            assignee = db.query(User).filter(User.id == task_in.assignee_id).first()
            if not assignee:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Assignee not found",
                )
            if assignee not in project.members:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Assignee is not a member of the project",
                )
    
    # Update task fields
    update_data = task_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    # Recalculate risk score (placeholder for ML integration)
    # In a real implementation, this would call the ML service
    # task.risk_score = ml_service.calculate_risk_score(task)
    
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", response_model=TaskResponse)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Delete a task.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    # Check if user has access to this task's project
    project = db.query(Project).filter(Project.id == task.project_id).first()
    if current_user.role != "admin" and current_user not in project.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    db.delete(task)
    db.commit()
    return task
