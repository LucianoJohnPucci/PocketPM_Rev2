from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas import TaskDependencyCreate, TaskDependencyResponse
from app.core.auth import get_current_active_user
from app.db.database import get_db
from app.db.models import TaskDependency, Task, Project, User

router = APIRouter()

@router.get("/", response_model=List[TaskDependencyResponse])
async def read_task_dependencies(
    task_id: int = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Retrieve task dependencies with optional filtering by task_id.
    """
    query = db.query(TaskDependency)
    
    if task_id is not None:
        # Check if task exists and user has access
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
        
        # Filter dependencies by task_id (either as dependent or prerequisite)
        query = query.filter(
            (TaskDependency.dependent_task_id == task_id) | 
            (TaskDependency.prerequisite_task_id == task_id)
        )
    else:
        # If no task_id is provided, only show dependencies from projects the user is a member of
        if current_user.role != "admin":
            query = query.join(
                Task, 
                TaskDependency.dependent_task_id == Task.id
            ).join(
                Project,
                Task.project_id == Project.id
            ).filter(
                Project.members.any(User.id == current_user.id)
            )
    
    dependencies = query.offset(skip).limit(limit).all()
    return dependencies

@router.post("/", response_model=TaskDependencyResponse)
async def create_task_dependency(
    dependency_in: TaskDependencyCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Create new task dependency.
    """
    # Check if dependent task exists
    dependent_task = db.query(Task).filter(Task.id == dependency_in.dependent_task_id).first()
    if not dependent_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dependent task not found",
        )
    
    # Check if prerequisite task exists
    prerequisite_task = db.query(Task).filter(Task.id == dependency_in.prerequisite_task_id).first()
    if not prerequisite_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prerequisite task not found",
        )
    
    # Check if both tasks are in the same project
    if dependent_task.project_id != prerequisite_task.project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tasks must be in the same project",
        )
    
    # Check if user has access to the project
    project = db.query(Project).filter(Project.id == dependent_task.project_id).first()
    if current_user.role != "admin" and current_user not in project.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if dependency already exists
    existing_dependency = db.query(TaskDependency).filter(
        TaskDependency.dependent_task_id == dependency_in.dependent_task_id,
        TaskDependency.prerequisite_task_id == dependency_in.prerequisite_task_id
    ).first()
    
    if existing_dependency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dependency already exists",
        )
    
    # Check for circular dependencies
    if dependency_in.dependent_task_id == dependency_in.prerequisite_task_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task cannot depend on itself",
        )
    
    # Create dependency
    dependency = TaskDependency(
        dependent_task_id=dependency_in.dependent_task_id,
        prerequisite_task_id=dependency_in.prerequisite_task_id,
        dependency_type=dependency_in.dependency_type,
    )
    db.add(dependency)
    db.commit()
    db.refresh(dependency)
    return dependency

@router.get("/{dependency_id}", response_model=TaskDependencyResponse)
async def read_task_dependency(
    dependency_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific task dependency by id.
    """
    dependency = db.query(TaskDependency).filter(TaskDependency.id == dependency_id).first()
    if not dependency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task dependency not found",
        )
    
    # Check if user has access to the dependent task's project
    dependent_task = db.query(Task).filter(Task.id == dependency.dependent_task_id).first()
    project = db.query(Project).filter(Project.id == dependent_task.project_id).first()
    
    if current_user.role != "admin" and current_user not in project.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return dependency

@router.delete("/{dependency_id}", response_model=TaskDependencyResponse)
async def delete_task_dependency(
    dependency_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Delete a task dependency.
    """
    dependency = db.query(TaskDependency).filter(TaskDependency.id == dependency_id).first()
    if not dependency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task dependency not found",
        )
    
    # Check if user has access to the dependent task's project
    dependent_task = db.query(Task).filter(Task.id == dependency.dependent_task_id).first()
    project = db.query(Project).filter(Project.id == dependent_task.project_id).first()
    
    if current_user.role != "admin" and current_user not in project.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    db.delete(dependency)
    db.commit()
    return dependency
