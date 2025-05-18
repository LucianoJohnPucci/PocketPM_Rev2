# ForesightPM Frontend

This is the frontend application for ForesightPM, a modern AI-powered project management application that provides proactive task management, dependency analysis, and stakeholder accountability.

## Technology Stack

- React 18 with TypeScript
- Material UI for component library
- React Router for navigation
- Formik and Yup for form handling and validation
- Chart.js and React-Chartjs-2 for data visualization
- Axios for API communication

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start the development server:

```bash
npm start
# or
yarn start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── auth/          # Authentication-related components
│   └── layout/        # Layout components
├── contexts/          # React contexts
├── pages/             # Page components
├── services/          # API services
├── utils/             # Utility functions
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## Features

- User authentication (login, register, profile management)
- Dashboard with project and task statistics
- Project management (create, view, edit, delete)
- Task management with dependency tracking
- Risk prediction and analysis
- Stakeholder accountability tracking

## Development

### Building for Production

```bash
npm run build
# or
yarn build
```

This will create an optimized production build in the `build` folder.

### Running Tests

```bash
npm test
# or
yarn test
```

## Connecting to the Backend

The frontend is configured to connect to the backend API at `http://localhost:8000/api/v1`. If your backend is running at a different URL, you'll need to update the `API_URL` constant in the relevant files.
