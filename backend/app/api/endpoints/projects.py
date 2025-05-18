from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from app.core.auth import get_current_active_user
from app.db.database import get_db
from app.db.models import Project, User, user_project

router = APIRouter()

@router.get("/", response_model=List[ProjectResponse])
async def read_projects(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Retrieve projects.
    """
    if current_user.role == "admin":
        projects = db.query(Project).offset(skip).limit(limit).all()
    else:
        projects = db.query(Project).join(user_project).filter(
            user_project.c.user_id == current_user.id
        ).offset(skip).limit(limit).all()
    return projects

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Create new project.
    """
    project = Project(
        name=project_in.name,
        description=project_in.description,
        start_date=project_in.start_date,
        end_date=project_in.end_date,
        budget=project_in.budget,
        status=project_in.status,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Add current user as a project member
    project.members.append(current_user)
    
    # Add other members if specified
    if project_in.member_ids:
        for member_id in project_in.member_ids:
            if member_id != current_user.id:  # Skip if already added
                member = db.query(User).filter(User.id == member_id).first()
                if member:
                    project.members.append(member)
    
    db.commit()
    db.refresh(project)
    return project

@router.get("/{project_id}", response_model=ProjectResponse)
async def read_project(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific project by id.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    # Check if user has access to this project
    if current_user.role != "admin" and current_user not in project.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update a project.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    # Check if user has access to this project
    if current_user.role != "admin" and current_user not in project.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    update_data = project_in.dict(exclude_unset=True)
    
    # Handle member_ids separately
    if "member_ids" in update_data:
        member_ids = update_data.pop("member_ids")
        # Clear existing members and add new ones
        project.members = []
        for member_id in member_ids:
            member = db.query(User).filter(User.id == member_id).first()
            if member:
                project.members.append(member)
    
    # Update other fields
    for field, value in update_data.items():
        setattr(project, field, value)
    
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", response_model=ProjectResponse)
async def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Delete a project.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    # Check if user has access to this project
    if current_user.role != "admin" and current_user not in project.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    db.delete(project)
    db.commit()
    return project
