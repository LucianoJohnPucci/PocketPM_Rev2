# ForesightPM

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
git clone https://github.com/yourusername/foresightpm.git
cd foresightpm
```

2. Set up the backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

3. Set up the frontend
```bash
cd frontend
npm install
npm start
```

4. Access the application at http://localhost:3000

## Project Structure

```
foresightpm/
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
