import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, List, Tuple
import joblib
import os
from datetime import datetime, timedelta

from app.db.models import Task, TaskStatus, TaskPriority
from app.api.schemas import RiskFactors, RiskPredictionResponse

class RiskPredictionModel:
    """
    Machine learning model for predicting task risk scores.
    """
    def __init__(self, model_path: str = None):
        """
        Initialize the risk prediction model.
        If model_path is provided and exists, load the model from disk.
        Otherwise, create a new model.
        """
        self.model = None
        self.feature_names = [
            'task_complexity',
            'resource_availability',
            'dependency_count',
            'historical_delays',
            'estimated_hours',
            'priority_level',
            'days_until_due',
            'completion_percentage'
        ]
        
        if model_path and os.path.exists(model_path):
            self.model = joblib.load(model_path)
        else:
            # Create a new model
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            # Note: In a real application, you would train this model with historical data
            # For now, we'll use a pre-trained model or train it with dummy data
    
    def train(self, X: np.ndarray, y: np.ndarray) -> None:
        """
        Train the risk prediction model.
        
        Args:
            X: Feature matrix
            y: Target vector (risk scores)
        """
        self.model.fit(X, y)
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make risk score predictions.
        
        Args:
            X: Feature matrix
            
        Returns:
            Predicted risk scores
        """
        return self.model.predict(X)
    
    def save_model(self, model_path: str) -> None:
        """
        Save the model to disk.
        
        Args:
            model_path: Path to save the model
        """
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        joblib.dump(self.model, model_path)
    
    def extract_features_from_task(self, task: Task) -> np.ndarray:
        """
        Extract features from a task for risk prediction.
        
        Args:
            task: Task object
            
        Returns:
            Feature vector
        """
        # Calculate days until due
        days_until_due = 30  # Default value if due_date is not set
        if task.due_date:
            days_until_due = max(0, (task.due_date - datetime.now()).days)
        
        # Convert priority to numeric value
        priority_mapping = {
            TaskPriority.LOW: 1,
            TaskPriority.MEDIUM: 2,
            TaskPriority.HIGH: 3,
            TaskPriority.CRITICAL: 4
        }
        priority_level = priority_mapping.get(task.priority, 2)  # Default to MEDIUM if not found
        
        # Count dependencies
        dependency_count = len(task.dependencies)
        
        # Placeholder values for features we don't have direct access to
        # In a real application, these would come from actual data
        task_complexity = 5.0  # Medium complexity (scale 0-10)
        resource_availability = 7.0  # Good availability (scale 0-10)
        historical_delays = 1  # Number of past delays
        
        # Create feature vector
        features = np.array([
            task_complexity,
            resource_availability,
            dependency_count,
            historical_delays,
            task.estimated_hours or 0.0,
            priority_level,
            days_until_due,
            task.completion_percentage or 0.0
        ]).reshape(1, -1)
        
        return features
    
    def predict_risk_for_task(self, task: Task) -> float:
        """
        Predict risk score for a task.
        
        Args:
            task: Task object
            
        Returns:
            Risk score (0-10)
        """
        features = self.extract_features_from_task(task)
        risk_score = self.predict(features)[0]
        
        # Ensure risk score is between 0 and 10
        return max(0, min(10, risk_score))
    
    def predict_risk_from_factors(self, risk_factors: RiskFactors) -> RiskPredictionResponse:
        """
        Predict risk score from provided risk factors.
        
        Args:
            risk_factors: Risk factors for prediction
            
        Returns:
            Risk prediction response with score, level, and contributing factors
        """
        # Map priority level to numeric value
        priority_mapping = {1: "LOW", 2: "MEDIUM", 3: "HIGH", 4: "CRITICAL"}
        priority_level = risk_factors.priority_level
        
        # Default values for missing factors
        days_until_due = 30
        completion_percentage = 0.0
        
        # Create feature vector
        features = np.array([
            risk_factors.task_complexity,
            risk_factors.resource_availability,
            risk_factors.dependency_count,
            risk_factors.historical_delays,
            risk_factors.estimated_hours,
            priority_level,
            days_until_due,
            completion_percentage
        ]).reshape(1, -1)
        
        # Predict risk score
        risk_score = float(self.predict(features)[0])
        risk_score = max(0, min(10, risk_score))
        
        # Determine risk level
        risk_level = "Low"
        if risk_score >= 7.5:
            risk_level = "Critical"
        elif risk_score >= 5.0:
            risk_level = "High"
        elif risk_score >= 2.5:
            risk_level = "Medium"
        
        # Calculate feature importance
        feature_importance = {}
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
            for i, feature in enumerate(self.feature_names):
                feature_importance[feature] = float(importances[i])
        
        # Generate mitigation suggestions
        mitigation_suggestions = self._generate_mitigation_suggestions(
            risk_score, 
            risk_factors, 
            feature_importance
        )
        
        return RiskPredictionResponse(
            risk_score=risk_score,
            risk_level=risk_level,
            contributing_factors=feature_importance,
            mitigation_suggestions=mitigation_suggestions
        )
    
    def _generate_mitigation_suggestions(
        self, 
        risk_score: float, 
        risk_factors: RiskFactors,
        feature_importance: Dict[str, float]
    ) -> List[str]:
        """
        Generate mitigation suggestions based on risk factors and their importance.
        
        Args:
            risk_score: Predicted risk score
            risk_factors: Risk factors used for prediction
            feature_importance: Feature importance dictionary
            
        Returns:
            List of mitigation suggestions
        """
        suggestions = []
        
        # Sort features by importance
        sorted_features = sorted(
            feature_importance.items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        # Generate suggestions based on top contributing factors
        for feature, importance in sorted_features[:3]:  # Top 3 factors
            if feature == 'task_complexity' and risk_factors.task_complexity > 7:
                suggestions.append("Consider breaking down this complex task into smaller, more manageable subtasks.")
            
            elif feature == 'resource_availability' and risk_factors.resource_availability < 5:
                suggestions.append("Allocate additional resources or redistribute workload to improve resource availability.")
            
            elif feature == 'dependency_count' and risk_factors.dependency_count > 3:
                suggestions.append("Review task dependencies to identify potential simplifications or parallel work streams.")
            
            elif feature == 'historical_delays' and risk_factors.historical_delays > 0:
                suggestions.append("Analyze previous delays to identify and address recurring issues.")
            
            elif feature == 'estimated_hours' and risk_factors.estimated_hours > 40:
                suggestions.append("Consider revising time estimates or breaking down the task further.")
            
            elif feature == 'priority_level' and risk_factors.priority_level >= 3:
                suggestions.append("Ensure high-priority tasks have adequate resources and monitoring.")
            
            elif feature == 'days_until_due' and feature_importance.get('days_until_due', 0) > 0.1:
                suggestions.append("Consider adjusting the timeline or starting the task earlier.")
            
            elif feature == 'completion_percentage' and feature_importance.get('completion_percentage', 0) > 0.1:
                suggestions.append("Implement more frequent progress tracking to ensure timely completion.")
        
        # Add general suggestions if we don't have enough specific ones
        if len(suggestions) < 2:
            suggestions.append("Implement regular status updates to track progress and identify issues early.")
            
        if len(suggestions) < 3 and risk_score > 5:
            suggestions.append("Consider escalating this high-risk task to management for additional oversight.")
        
        return suggestions

# Create a singleton instance
risk_model = RiskPredictionModel()

def train_model_with_dummy_data():
    """
    Train the risk model with dummy data for demonstration purposes.
    In a real application, this would use historical project data.
    """
    # Generate dummy data
    np.random.seed(42)
    n_samples = 1000
    
    # Features
    X = np.random.rand(n_samples, 8)
    X[:, 0] *= 10  # task_complexity (0-10)
    X[:, 1] *= 10  # resource_availability (0-10)
    X[:, 2] = np.random.randint(0, 10, n_samples)  # dependency_count (0-9)
    X[:, 3] = np.random.randint(0, 5, n_samples)  # historical_delays (0-4)
    X[:, 4] = np.random.randint(1, 100, n_samples)  # estimated_hours (1-100)
    X[:, 5] = np.random.randint(1, 5, n_samples)  # priority_level (1-4)
    X[:, 6] = np.random.randint(1, 60, n_samples)  # days_until_due (1-60)
    X[:, 7] *= 100  # completion_percentage (0-100)
    
    # Target: Risk score calculation (simplified model)
    y = (
        0.2 * X[:, 0] +  # task_complexity
        -0.15 * X[:, 1] +  # resource_availability (negative impact)
        0.1 * X[:, 2] +  # dependency_count
        0.15 * X[:, 3] +  # historical_delays
        0.05 * X[:, 4] / 10 +  # estimated_hours (normalized)
        0.2 * X[:, 5] +  # priority_level
        -0.1 * np.log1p(X[:, 6]) +  # days_until_due (log-transformed, negative impact)
        -0.05 * X[:, 7] / 10  # completion_percentage (normalized, negative impact)
    )
    
    # Normalize to 0-10 scale
    y = 10 * (y - y.min()) / (y.max() - y.min())
    
    # Train the model
    risk_model.train(X, y)
    
    return risk_model

# Initialize the model with dummy data
train_model_with_dummy_data()
