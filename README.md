# PocketPM w/TIVd

A modern AI-powered project management application that provides proactive task management, dependency analysis, and stakeholder accountability.

## Features

### Predictive Task Analysis
- AI-driven bottleneck identification
- Risk scoring system
- Intuitive dashboard for high-risk tasks

### Smart Predecessor Management
- Intelligent dependency tracking
- Automatic alerts for at-risk predecessor tasks
- Critical path visualization
- What-if scenario planning

### Stakeholder Accountability
- Customizable notification system
- Escalation protocols
- Stakeholder-specific dashboards
- Performance analytics

### Budget Impact Analysis
- AI forecasting for budget implications
- Financial impact visualizations
- Automatic budget alerts
- Resource allocation optimization

## Technical Stack

- **Frontend**: React with TypeScript
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI/ML**: Pydantic AI, scikit-learn, TensorFlow
- **Authentication**: JWT, OAuth2
- **Real-time**: WebSockets
- **Visualization**: D3.js, Chart.js
- **Deployment**: Docker, Kubernetes

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 13+
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/pocketpm.git
cd pocketpm
```

2. Set up Python virtual environment
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# or
source venv/bin/activate  # On macOS/Linux
pip install -r backend/requirements.txt
```

### Quick Start (Recommended)

**Option 1: Use the startup scripts**
```bash
# Start both servers
python start_servers.py

# Or start individually
python start_backend.py
python start_frontend.py
```

**Option 2: Use batch files (Windows)**
```bash
# Double-click or run:
start_backend.bat
start_frontend.bat
```

**Option 3: Manual setup**
```bash
# Backend (from project root)
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend (in new terminal)
cd frontend
npm install --force
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Project Structure

```
pocketpm/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core functionality
│   │   ├── db/            # Database models and connections
│   │   ├── ml/            # Machine learning models
│   │   └── services/      # Business logic
│   ├── tests/             # Backend tests
│   └── requirements.txt   # Python dependencies
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── package.json       # Node.js dependencies
│   └── tsconfig.json      # TypeScript configuration
└── docker/                # Docker configuration
    ├── backend/           # Backend Dockerfile
    ├── frontend/          # Frontend Dockerfile
    └── docker-compose.yml # Docker Compose configuration
```

## Implementation Timeline

- **Phase 1**: Core task management and predecessor tracking system
- **Phase 2**: AI-powered risk prediction and notification system
- **Phase 3**: Budget impact analysis and resource optimization
- **Phase 4**: Advanced reporting, analytics, and third-party integrations

## License

This project is licensed under the MIT License - see the LICENSE file for details.
