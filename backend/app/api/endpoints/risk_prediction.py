from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas import RiskFactors, RiskPredictionResponse
from app.core.auth import get_current_active_user
from app.db.database import get_db
from app.db.models import Task, User
from app.ml.risk_prediction import risk_model

router = APIRouter()

@router.post("/predict", response_model=RiskPredictionResponse)
async def predict_risk(
    risk_factors: RiskFactors,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Predict risk based on provided factors.
    """
    # Use our ML model to predict risk
    prediction = risk_model.predict_risk_from_factors(risk_factors)
    return prediction

@router.get("/task/{task_id}", response_model=RiskPredictionResponse)
async def get_task_risk(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get risk prediction for a specific task.
    """
    # Get the task
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    # Calculate risk score
    risk_score = risk_model.predict_risk_for_task(task)
    
    # Create risk factors from task
    features = risk_model.extract_features_from_task(task)
    
    # Create risk factors object
    risk_factors = RiskFactors(
        task_complexity=5.0,  # Placeholder
        resource_availability=7.0,  # Placeholder
        dependency_count=len(task.dependencies),
        historical_delays=1,  # Placeholder
        estimated_hours=task.estimated_hours or 0.0,
        priority_level=int(task.priority.value) if task.priority else 2,
    )
    
    # Get full prediction
    prediction = risk_model.predict_risk_from_factors(risk_factors)
    
    # Override the risk score with the one calculated directly from the task
    prediction.risk_score = risk_score
    
    return prediction
