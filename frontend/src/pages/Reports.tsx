import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

// Define API URL
const API_URL = 'http://localhost:8000/api/v1';

// Define interfaces
interface TaskDependency {
  id: number;
  task_id: number;
  predecessor_id: number;
  dependency_type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
}

interface ProjectTask {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  start_date: string;
  due_date: string;
  estimated_hours: number;
  actual_hours: number;
  completion_percentage: number;
  risk_score: number;
  project_id: number;
  assignee_id: number | null;
  creator_id: number;
  created_at: string;
  project: {
    id: number;
    name: string;
  };
  assignee: {
    id: number;
    username: string;
    full_name: string;
  } | null;
  dependencies: TaskDependency[];
}

interface Project {
  id: number;
  name: string;
}

// Helper function to convert task data to Gantt chart format
const convertToGanttTasks = (tasks: ProjectTask[]): Task[] => {
  return tasks.map(task => {
    const dependencies = task.dependencies?.map(dep => dep.predecessor_id.toString()) || [];
    
    return {
      id: task.id.toString(),
      name: task.title,
      start: new Date(task.start_date),
      end: new Date(task.due_date),
      progress: task.completion_percentage / 100,
      dependencies: dependencies,
      styles: {
        progressColor: getStatusColor(task.status),
        progressSelectedColor: getStatusColor(task.status),
        barBackgroundColor: '#E0E0E0',
        barBackgroundSelectedColor: '#E0E0E0'
      },
      project: task.project.name,
      isDisabled: false,
      type: 'task'
    };
  });
};

// Helper function to get color based on task status
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#4caf50'; // Green
    case 'in_progress':
      return '#2196f3'; // Blue
    case 'not_started':
      return '#9e9e9e'; // Gray
    case 'delayed':
      return '#ff9800'; // Orange
    case 'blocked':
      return '#f44336'; // Red
    default:
      return '#9e9e9e'; // Gray
  }
};

// Helper function to get color based on dependency type
const getDependencyTypeColor = (type: string): string => {
  switch (type) {
    case 'finish_to_start':
      return '#2196f3'; // Blue
    case 'start_to_start':
      return '#4caf50'; // Green
    case 'finish_to_finish':
      return '#ff9800'; // Orange
    case 'start_to_finish':
      return '#f44336'; // Red
    default:
      return '#9e9e9e'; // Gray
  }
};

// Helper function to get label based on dependency type
const getDependencyTypeLabel = (type: string): string => {
  switch (type) {
    case 'finish_to_start':
      return 'FS';
    case 'start_to_start':
      return 'SS';
    case 'finish_to_finish':
      return 'FF';
    case 'start_to_finish':
      return 'SF';
    default:
      return '';
  }
};

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | ''>('');
  const [ganttViewMode, setGanttViewMode] = useState<ViewMode>(ViewMode.Day);
  
  useEffect(() => {
    // In a real implementation, we would fetch this data from the API
    // For now, we'll use mock data
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          const mockProjects = [
            { id: 1, name: 'ForesightPM Development' },
            { id: 2, name: 'Marketing Campaign' },
            { id: 3, name: 'Mobile App Development' }
          ];
          
          const mockTasks = [
            {
              id: 1,
              title: 'Design database schema',
              description: 'Create the database schema for the ForesightPM application',
              status: 'completed',
              priority: 'high',
              start_date: '2025-05-01',
              due_date: '2025-05-05',
              estimated_hours: 8,
              actual_hours: 10,
              completion_percentage: 100,
              risk_score: 2.5,
              project_id: 1,
              assignee_id: 1,
              creator_id: 1,
              created_at: '2025-05-01T00:00:00',
              project: {
                id: 1,
                name: 'ForesightPM Development'
              },
              assignee: {
                id: 1,
                username: 'johndoe',
                full_name: 'John Doe'
              },
              dependencies: []
            },
            {
              id: 2,
              title: 'Implement user authentication',
              description: 'Implement JWT authentication for the API',
              status: 'in_progress',
              priority: 'critical',
              start_date: '2025-05-05',
              due_date: '2025-05-10',
              estimated_hours: 16,
              actual_hours: 8,
              completion_percentage: 50,
              risk_score: 7.8,
              project_id: 1,
              assignee_id: 2,
              creator_id: 1,
              created_at: '2025-05-01T00:00:00',
              project: {
                id: 1,
                name: 'ForesightPM Development'
              },
              assignee: {
                id: 2,
                username: 'janedoe',
                full_name: 'Jane Doe'
              },
              dependencies: [
                {
                  id: 1,
                  task_id: 2,
                  predecessor_id: 1,
                  dependency_type: 'finish_to_start' as 'finish_to_start'
                }
              ]
            },
            {
              id: 3,
              title: 'Design dashboard UI',
              description: 'Create the UI design for the dashboard',
              status: 'not_started',
              priority: 'medium',
              start_date: '2025-05-10',
              due_date: '2025-05-15',
              estimated_hours: 24,
              actual_hours: 0,
              completion_percentage: 0,
              risk_score: 4.2,
              project_id: 1,
              assignee_id: 3,
              creator_id: 1,
              created_at: '2025-05-01T00:00:00',
              project: {
                id: 1,
                name: 'ForesightPM Development'
              },
              assignee: {
                id: 3,
                username: 'bobsmith',
                full_name: 'Bob Smith'
              },
              dependencies: [
                {
                  id: 2,
                  task_id: 3,
                  predecessor_id: 2,
                  dependency_type: 'finish_to_start' as 'finish_to_start'
                }
              ]
            },
            {
              id: 4,
              title: 'Implement dashboard components',
              description: 'Implement React components for the dashboard',
              status: 'not_started',
              priority: 'high',
              start_date: '2025-05-15',
              due_date: '2025-05-25',
              estimated_hours: 40,
              actual_hours: 0,
              completion_percentage: 0,
              risk_score: 5.6,
              project_id: 1,
              assignee_id: 2,
              creator_id: 1,
              created_at: '2025-05-01T00:00:00',
              project: {
                id: 1,
                name: 'ForesightPM Development'
              },
              assignee: {
                id: 2,
                username: 'janedoe',
                full_name: 'Jane Doe'
              },
              dependencies: [
                {
                  id: 3,
                  task_id: 4,
                  predecessor_id: 3,
                  dependency_type: 'finish_to_start' as 'finish_to_start'
                }
              ]
            },
            {
              id: 5,
              title: 'Create marketing materials',
              description: 'Design and create marketing materials for the campaign',
              status: 'in_progress',
              priority: 'medium',
              start_date: '2025-05-05',
              due_date: '2025-05-15',
              estimated_hours: 30,
              actual_hours: 15,
              completion_percentage: 50,
              risk_score: 3.2,
              project_id: 2,
              assignee_id: 3,
              creator_id: 2,
              created_at: '2025-05-01T00:00:00',
              project: {
                id: 2,
                name: 'Marketing Campaign'
              },
              assignee: {
                id: 3,
                username: 'bobsmith',
                full_name: 'Bob Smith'
              },
              dependencies: []
            },
            {
              id: 6,
              title: 'Plan social media strategy',
              description: 'Develop a social media strategy for the campaign',
              status: 'not_started',
              priority: 'high',
              start_date: '2025-05-10',
              due_date: '2025-05-20',
              estimated_hours: 24,
              actual_hours: 0,
              completion_percentage: 0,
              risk_score: 4.8,
              project_id: 2,
              assignee_id: 4,
              creator_id: 2,
              created_at: '2025-05-01T00:00:00',
              project: {
                id: 2,
                name: 'Marketing Campaign'
              },
              assignee: {
                id: 4,
                username: 'alicejones',
                full_name: 'Alice Jones'
              },
              dependencies: [
                {
                  id: 4,
                  task_id: 6,
                  predecessor_id: 5,
                  dependency_type: 'start_to_start' as 'start_to_start'
                }
              ]
            }
          ];
          
          setProjects(mockProjects);
          setTasks(mockTasks);
          setSelectedProject(1); // Default to first project
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProjectChange = (event: any) => {
    setSelectedProject(event.target.value);
  };

  const handleViewModeChange = (event: any) => {
    setGanttViewMode(event.target.value);
  };

  // Filter tasks based on selected project
  const filteredTasks = selectedProject 
    ? tasks.filter(task => task.project_id === selectedProject)
    : tasks;

  // Convert tasks to Gantt chart format
  const ganttTasks = convertToGanttTasks(filteredTasks);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Reports</Typography>
      
      {/* Project Selection */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="project-select-label">Project</InputLabel>
            <Select
              labelId="project-select-label"
              id="project-select"
              value={selectedProject}
              label="Project"
              onChange={handleProjectChange}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          {activeTab === 1 && (
            <FormControl fullWidth>
              <InputLabel id="view-mode-select-label">View Mode</InputLabel>
              <Select
                labelId="view-mode-select-label"
                id="view-mode-select"
                value={ganttViewMode}
                label="View Mode"
                onChange={handleViewModeChange}
              >
                <MenuItem value={ViewMode.Day}>Day</MenuItem>
                <MenuItem value={ViewMode.Week}>Week</MenuItem>
                <MenuItem value={ViewMode.Month}>Month</MenuItem>
              </Select>
            </FormControl>
          )}
        </Grid>
      </Grid>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="report tabs">
          <Tab label="Predecessor Tracking" />
          <Tab label="Gantt Chart" />
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      {activeTab === 0 && (
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardHeader title="Task Dependencies" />
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assignee</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Predecessors</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task) => {
                    // Find predecessor tasks
                    const predecessors = task.dependencies.map(dep => {
                      const predecessorTask = tasks.find(t => t.id === dep.predecessor_id);
                      return {
                        task: predecessorTask,
                        type: dep.dependency_type
                      };
                    });
                    
                    return (
                      <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>
                          <Chip 
                            label={task.status.replace('_', ' ')} 
                            size="small"
                            sx={{ 
                              backgroundColor: getStatusColor(task.status),
                              color: 'white',
                              textTransform: 'capitalize'
                            }} 
                          />
                        </TableCell>
                        <TableCell>{task.assignee ? task.assignee.full_name : 'Unassigned'}</TableCell>
                        <TableCell>{new Date(task.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(task.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {predecessors.length > 0 ? (
                            <Box display="flex" flexDirection="column" gap={1}>
                              {predecessors.map((pred, index) => (
                                pred.task && (
                                  <Box key={index} display="flex" alignItems="center">
                                    <Chip 
                                      label={pred.task.title} 
                                      size="small"
                                      variant="outlined"
                                      sx={{ mr: 1 }}
                                    />
                                    <Chip 
                                      label={getDependencyTypeLabel(pred.type)} 
                                      size="small"
                                      sx={{ 
                                        backgroundColor: getDependencyTypeColor(pred.type),
                                        color: 'white',
                                        minWidth: 30
                                      }}
                                    />
                                  </Box>
                                )
                              ))}
                            </Box>
                          ) : (
                            'None'
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 1 && (
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardHeader title="Gantt Chart" />
          <CardContent>
            <Box sx={{ height: 500, overflowX: 'auto' }}>
              {ganttTasks.length > 0 ? (
                <Gantt
                  tasks={ganttTasks}
                  viewMode={ganttViewMode}
                  listCellWidth=""
                  columnWidth={60}
                />
              ) : (
                <Typography variant="body1" align="center" sx={{ py: 10 }}>
                  No tasks found for the selected project.
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Reports;
