from fastapi import APIRouter

from app.api.endpoints import auth, users, projects, tasks, task_dependencies, risk_prediction

api_router = APIRouter()

# Include all routers with appropriate prefixes
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(task_dependencies.router, prefix="/task-dependencies", tags=["task_dependencies"])
api_router.include_router(risk_prediction.router, prefix="/risk-prediction", tags=["risk_prediction"])
