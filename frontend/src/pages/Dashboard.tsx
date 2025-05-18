import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { 
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { format, parseISO, differenceInDays } from 'date-fns';

// Import escalation utilities and components
import { processTasksForEscalation, EscalationTask } from '../utils/escalationService';
import EscalationPanel from '../components/escalation/EscalationPanel';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Define API URL
const API_URL = 'http://localhost:8000/api/v1';

// Define interfaces
interface DeadlineTask {
  id: number;
  title: string;
  due_date: string;
  project: string;
}

interface ProjectProgress {
  id: number;
  name: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  color: string;
}

interface Stakeholder {
  id: number;
  name: string;
  role: string;
  email: string;
}

interface StakeholderTask {
  id: number;
  title: string;
  due_date: string;
  project: string;
  status: string;
  priority: string;
  dependencies: string[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('all');
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [stakeholderTasks, setStakeholderTasks] = useState<StakeholderTask[]>([]);
  const [escalations, setEscalations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    highRiskTasks: 0,
    totalBudget: 0,
    allocatedBudget: 0,
    upcomingDeadlines: [] as DeadlineTask[],
    projectProgress: [] as ProjectProgress[],
    tasksByStatus: {
      not_started: 0,
      in_progress: 0,
      completed: 0,
      delayed: 0,
      blocked: 0,
      cancelled: 0
    },
    tasksByPriority: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    }
  });

  // Handle stakeholder selection change
  const handleStakeholderChange = (event: SelectChangeEvent) => {
    setSelectedStakeholder(event.target.value);
    fetchStakeholderTasks(event.target.value);
  };

  // Fetch stakeholder-specific tasks
  const fetchStakeholderTasks = (stakeholderId: string) => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      if (stakeholderId === 'all') {
        setStakeholderTasks([]);
      } else {
        // Mock data for stakeholder tasks
        const mockTasks: StakeholderTask[] = [
          { 
            id: 1, 
            title: `Complete API documentation for ${stakeholderId === '1' ? 'John' : stakeholderId === '2' ? 'Sarah' : 'Michael'}`, 
            due_date: '2025-05-20', 
            project: 'ForesightPM', 
            status: 'in_progress',
            priority: 'high',
            dependencies: ['Frontend setup', 'Database design']
          },
          { 
            id: 2, 
            title: `Review ${stakeholderId === '1' ? 'backend code' : stakeholderId === '2' ? 'UI design' : 'documentation'}`, 
            due_date: '2025-05-18', 
            project: 'ForesightPM', 
            status: 'not_started',
            priority: 'medium',
            dependencies: ['Initial development']
          },
          { 
            id: 3, 
            title: `Prepare ${stakeholderId === '1' ? 'technical presentation' : stakeholderId === '2' ? 'design assets' : 'project report'}`, 
            due_date: '2025-05-25', 
            project: 'ForesightPM', 
            status: 'not_started',
            priority: 'medium',
            dependencies: []
          },
          { 
            id: 4, 
            title: `${stakeholderId === '1' ? 'Implement authentication' : stakeholderId === '2' ? 'Create user dashboard' : 'Test deployment pipeline'}`, 
            due_date: '2025-05-15', 
            project: 'ForesightPM', 
            status: 'delayed',
            priority: 'critical',
            dependencies: ['API development', 'Database setup']
          },
        ];
        setStakeholderTasks(mockTasks);
      }
      setLoading(false);
    }, 500);
  };

  // Function to check for tasks approaching deadlines without progress
  const checkTasksForEscalation = () => {
    // In a real implementation, we would fetch all tasks from the API
    // For now, we'll use mock data
    const mockTasks: EscalationTask[] = [
      {
        id: 1,
        title: 'Complete API documentation',
        status: 'in_progress',
        priority: 'high',
        due_date: '2025-05-10', // 2 days from now
        completion_percentage: 20,
        assignee_id: 1,
        project_id: 1,
        last_updated: '2025-05-05'
      },
      {
        id: 2,
        title: 'Implement user authentication',
        status: 'not_started',
        priority: 'critical',
        due_date: '2025-05-09', // 1 day from now
        completion_percentage: 0,
        assignee_id: 3,
        project_id: 1,
        last_updated: '2025-05-06'
      },
      {
        id: 3,
        title: 'Design dashboard UI',
        status: 'in_progress',
        priority: 'medium',
        due_date: '2025-05-15', // 7 days from now
        completion_percentage: 30,
        assignee_id: 2,
        project_id: 1,
        last_updated: '2025-05-07'
      },
      {
        id: 4,
        title: 'Setup CI/CD pipeline',
        status: 'delayed',
        priority: 'high',
        due_date: '2025-05-08', // Today
        completion_percentage: 10,
        assignee_id: 5,
        project_id: 1,
        last_updated: '2025-05-04'
      },
      {
        id: 5,
        title: 'Write unit tests',
        status: 'in_progress',
        priority: 'medium',
        due_date: '2025-05-20', // 12 days from now
        completion_percentage: 45,
        assignee_id: 4,
        project_id: 1,
        last_updated: '2025-05-07'
      }
    ];
    
    // Process tasks for escalation
    const escalationResults = processTasksForEscalation(mockTasks);
    setEscalations(escalationResults);
  };

  useEffect(() => {
    // In a real implementation, we would fetch this data from the API
    // For now, we'll use mock data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          // Mock stakeholders data
          setStakeholders([
            { id: 1, name: 'John Smith', role: 'Developer', email: 'john@example.com' },
            { id: 2, name: 'Sarah Johnson', role: 'Designer', email: 'sarah@example.com' },
            { id: 3, name: 'Michael Brown', role: 'Project Manager', email: 'michael@example.com' },
            { id: 4, name: 'Emily Davis', role: 'QA Engineer', email: 'emily@example.com' },
            { id: 5, name: 'David Wilson', role: 'DevOps Engineer', email: 'david@example.com' }
          ]);
          
          // Check for tasks approaching deadlines without progress
          checkTasksForEscalation();
          setStats({
            totalProjects: 5,
            totalTasks: 32,
            completedTasks: 18,
            highRiskTasks: 4,
            totalBudget: 75000,
            allocatedBudget: 14400,
            upcomingDeadlines: [
              { id: 1, title: 'Complete backend API', due_date: '2025-05-15', project: 'ForesightPM' },
              { id: 2, title: 'Design dashboard UI', due_date: '2025-05-12', project: 'ForesightPM' },
              { id: 3, title: 'Implement user authentication', due_date: '2025-05-10', project: 'ForesightPM' }
            ],
            projectProgress: [
              { id: 1, name: 'ForesightPM Development', totalTasks: 15, completedTasks: 9, completionPercentage: 60, color: '#2196f3' },
              { id: 2, name: 'Marketing Campaign', totalTasks: 8, completedTasks: 2, completionPercentage: 25, color: '#ff9800' },
              { id: 3, name: 'Mobile App Development', totalTasks: 12, completedTasks: 6, completionPercentage: 50, color: '#4caf50' },
              { id: 4, name: 'User Research', totalTasks: 6, completedTasks: 6, completionPercentage: 100, color: '#9c27b0' },
              { id: 5, name: 'Infrastructure Setup', totalTasks: 4, completedTasks: 1, completionPercentage: 25, color: '#f44336' }
            ],
            tasksByStatus: {
              not_started: 8,
              in_progress: 6,
              completed: 18,
              delayed: 3,
              blocked: 1,
              cancelled: 0
            },
            tasksByPriority: {
              low: 5,
              medium: 15,
              high: 8,
              critical: 4
            }
          });
          setLoading(false);
        }, 1000);

        // In a real implementation, we would fetch data like this:
        // const response = await axios.get(`${API_URL}/dashboard/stats`);
        // setStats(response.data);
        // setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare chart data
  const statusChartData = {
    labels: ['Not Started', 'In Progress', 'Completed', 'Delayed', 'Blocked', 'Cancelled'],
    datasets: [
      {
        label: 'Tasks by Status',
        data: [
          stats.tasksByStatus.not_started,
          stats.tasksByStatus.in_progress,
          stats.tasksByStatus.completed,
          stats.tasksByStatus.delayed,
          stats.tasksByStatus.blocked,
          stats.tasksByStatus.cancelled
        ],
        backgroundColor: [
          '#9e9e9e',  // Not Started - Gray
          '#2196f3',  // In Progress - Blue
          '#4caf50',  // Completed - Green
          '#ff9800',  // Delayed - Orange
          '#f44336',  // Blocked - Red
          '#9c27b0'   // Cancelled - Purple
        ],
        borderWidth: 1,
      },
    ],
  };

  const priorityChartData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [
          stats.tasksByPriority.low,
          stats.tasksByPriority.medium,
          stats.tasksByPriority.high,
          stats.tasksByPriority.critical
        ],
        backgroundColor: [
          '#4caf50',  // Low - Green
          '#2196f3',  // Medium - Blue
          '#ff9800',  // High - Orange
          '#f44336'   // Critical - Red
        ],
        borderWidth: 1,
      },
    ],
  };

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard</Typography>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel id="stakeholder-select-label">Stakeholder View</InputLabel>
          <Select
            labelId="stakeholder-select-label"
            id="stakeholder-select"
            value={selectedStakeholder}
            label="Stakeholder View"
            onChange={handleStakeholderChange}
          >
            <MenuItem value="all">All Stakeholders</MenuItem>
            {stakeholders.map((stakeholder) => (
              <MenuItem key={stakeholder.id} value={stakeholder.id.toString()}>
                {stakeholder.name} ({stakeholder.role})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {selectedStakeholder !== 'all' && stakeholderTasks.length > 0 && (
        <Card elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
          <CardHeader 
            title={`${stakeholders.find(s => s.id.toString() === selectedStakeholder)?.name}'s Dashboard`} 
            subheader={`Role: ${stakeholders.find(s => s.id.toString() === selectedStakeholder)?.role}`}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>Assigned Tasks</Typography>
            <List>
              {stakeholderTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <ListItem>
                    <Box width="100%">
                      <Box display="flex" justifyContent="space-between">
                        <ListItemText 
                          primary={task.title} 
                          secondary={`Project: ${task.project} | Due: ${new Date(task.due_date).toLocaleDateString()}`} 
                        />
                        <Box>
                          <Typography variant="body2" sx={{
                            backgroundColor: 
                              task.priority === 'critical' ? '#f44336' :
                              task.priority === 'high' ? '#ff9800' :
                              task.priority === 'medium' ? '#2196f3' : '#4caf50',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block',
                            mr: 1
                          }}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Typography>
                          <Typography variant="body2" sx={{
                            backgroundColor: 
                              task.status === 'completed' ? '#4caf50' :
                              task.status === 'in_progress' ? '#2196f3' :
                              task.status === 'delayed' ? '#f44336' : '#9e9e9e',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block'
                          }}>
                            {task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Typography>
                        </Box>
                      </Box>
                      {task.dependencies.length > 0 && (
                        <Box mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Dependencies:</strong> {task.dependencies.join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" color="primary" onClick={() => navigate('/tasks')}>View All Tasks</Button>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* Summary Cards */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" align="center" gutterBottom>Total Projects</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h3" component="div">
                {stats.totalProjects}
              </Typography>
            </Box>
            <Button size="small" onClick={() => navigate('/projects')}>View all projects</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" align="center" gutterBottom>Budget</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <MoneyIcon sx={{ color: '#1976d2', mr: 1, fontSize: 28 }} />
              <Typography variant="h3" component="div">
                {Math.round((stats.allocatedBudget / stats.totalBudget) * 100)}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" align="center">
              ${stats.allocatedBudget.toLocaleString()} of ${stats.totalBudget.toLocaleString()}
            </Typography>
            <Button size="small" onClick={() => navigate('/budgets')}>View budget</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" align="center" gutterBottom>Total Tasks</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h3" component="div">
                {stats.totalTasks}
              </Typography>
            </Box>
            <Button size="small" onClick={() => navigate('/tasks')}>View all tasks</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" align="center" gutterBottom>Completed Tasks</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h3" component="div" sx={{ color: '#4caf50' }}>
                {stats.completedTasks}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" align="center">
              {Math.round((stats.completedTasks / stats.totalTasks) * 100)}% completion rate
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" align="center" gutterBottom>High Risk Tasks</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h3" component="div" sx={{ color: '#f44336' }}>
                {stats.highRiskTasks}
              </Typography>
            </Box>
            <Button size="small" color="error" onClick={() => navigate('/tasks?risk=high')}>View high risk tasks</Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Project Progress Chart */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardHeader 
              title="Project Progress" 
              action={
                <Button size="small" onClick={() => navigate('/projects')}>View all projects</Button>
              }
            />
            <CardContent>
              <Box>
                {stats.projectProgress.map((project) => (
                  <Box key={project.id} mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="body1">{project.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.completedTasks}/{project.totalTasks} tasks ({project.completionPercentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={project.completionPercentage} 
                      sx={{ 
                        height: 12, 
                        borderRadius: 1,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: project.color
                        }
                      }} 
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Escalation Panel - Only show when viewing all stakeholders */}
      {selectedStakeholder === 'all' && escalations.length > 0 && (
        <Box mb={4}>
          <EscalationPanel escalations={escalations} />
        </Box>
      )}

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Task Status Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader title="Tasks by Status" />
            <CardContent>
              <Box height={300} display="flex" justifyContent="center">
                <Pie data={statusChartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Priority Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader title="Tasks by Priority" />
            <CardContent>
              <Box height={300} display="flex" justifyContent="center">
                <Pie data={priorityChartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardHeader 
              title="Upcoming Deadlines" 
              action={
                <Button size="small" onClick={() => navigate('/tasks')}>View all tasks</Button>
              }
            />
            <CardContent>
              <List>
                {stats.upcomingDeadlines.length > 0 ? (
                  stats.upcomingDeadlines.map((task: any, index: number) => (
                    <React.Fragment key={task.id}>
                      <ListItem 
                        button 
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        sx={{ py: 1.5 }}
                      >
                        <ListItemText 
                          primary={task.title} 
                          secondary={`Due: ${new Date(task.due_date).toLocaleDateString()} | Project: ${task.project}`} 
                        />
                        <Typography variant="body2" color="text.secondary">
                          {Math.ceil((new Date(task.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                        </Typography>
                      </ListItem>
                      {index < stats.upcomingDeadlines.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No upcoming deadlines" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
