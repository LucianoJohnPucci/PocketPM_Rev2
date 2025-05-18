import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AIChatWindow from '../components/AIChatWindow';

// Define API URL
const API_URL = 'http://localhost:8000/api/v1';

interface Task {
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
}

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  // Main container for the two-column layout
  // The existing logic will now be part of the right panel
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project_id: '',
    assignee_id: '',
    search: ''
  });

  useEffect(() => {
    // In a real implementation, we would fetch this data from the API
    // For now, we'll use mock data
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          setTasks([
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
              }
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
              }
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
              assignee_id: null,
              creator_id: 1,
              created_at: '2025-05-01T00:00:00',
              project: {
                id: 1,
                name: 'ForesightPM Development'
              },
              assignee: null
            }
          ]);
          
          setProjects([
            { id: 1, name: 'ForesightPM Development' },
            { id: 2, name: 'Marketing Campaign' }
          ]);
          
          setUsers([
            { id: 1, username: 'johndoe', full_name: 'John Doe' },
            { id: 2, username: 'janedoe', full_name: 'Jane Doe' },
            { id: 3, username: 'bobsmith', full_name: 'Bob Smith' },
            { id: 4, username: 'alicejones', full_name: 'Alice Jones' }
          ]);
          
          setLoading(false);
        }, 1000);

        // In a real implementation, we would fetch data like this:
        // const response = await axios.get(`${API_URL}/tasks`);
        // setTasks(response.data);
        // const projectsResponse = await axios.get(`${API_URL}/projects`);
        // setProjects(projectsResponse.data);
        // const usersResponse = await axios.get(`${API_URL}/users`);
        // setUsers(usersResponse.data);
        // setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'not_started',
      priority: 'medium',
      start_date: null,
      due_date: null,
      estimated_hours: '',
      project_id: '',
      assignee_id: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Task title is required'),
      description: Yup.string(),
      status: Yup.string().required('Status is required'),
      priority: Yup.string().required('Priority is required'),
      start_date: Yup.date().nullable(),
      due_date: Yup.date().nullable()
        .min(
          Yup.ref('start_date'),
          'Due date must be after start date'
        ),
      estimated_hours: Yup.number().min(0, 'Estimated hours must be a positive number'),
      project_id: Yup.number().required('Project is required'),
      assignee_id: Yup.number().nullable()
    }),
    onSubmit: async (values) => {
      try {
        // In a real implementation, we would send this data to the API
        console.log('Creating task:', values);
        
        // Simulate API call
        const newTask: Task = {
          id: tasks.length + 1,
          title: values.title,
          description: values.description || '',
          status: values.status,
          priority: values.priority,
          start_date: values.start_date ? new Date(values.start_date).toISOString().split('T')[0] : '',
          due_date: values.due_date ? new Date(values.due_date).toISOString().split('T')[0] : '',
          estimated_hours: Number(values.estimated_hours) || 0,
          actual_hours: 0,
          completion_percentage: 0,
          risk_score: Math.random() * 10, // Random risk score for demo
          project_id: Number(values.project_id),
          assignee_id: values.assignee_id ? Number(values.assignee_id) : null,
          creator_id: 1, // Current user ID (hardcoded for demo)
          created_at: new Date().toISOString(),
          project: projects.find(p => p.id === Number(values.project_id)) || { id: 0, name: '' },
          assignee: values.assignee_id ? users.find(u => u.id === Number(values.assignee_id)) || null : null
        };
        
        setTasks([...tasks, newTask]);
        handleCloseDialog();
        
        // In a real implementation, we would do this:
        // const response = await axios.post(`${API_URL}/tasks`, values);
        // setTasks([...tasks, response.data]);
        // handleCloseDialog();
      } catch (err: any) {
        setError(err.message || 'Failed to create task');
      }
    },
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name as string]: value
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.project_id && task.project_id !== Number(filters.project_id)) return false;
    if (filters.assignee_id && task.assignee_id !== Number(filters.assignee_id)) return false;
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return '#9e9e9e'; // Gray
      case 'in_progress':
        return '#2196f3'; // Blue
      case 'completed':
        return '#4caf50'; // Green
      case 'delayed':
        return '#ff9800'; // Orange
      case 'blocked':
        return '#f44336'; // Red
      case 'cancelled':
        return '#9c27b0'; // Purple
      default:
        return '#9e9e9e'; // Gray
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return '#4caf50'; // Green
      case 'medium':
        return '#2196f3'; // Blue
      case 'high':
        return '#ff9800'; // Orange
      case 'critical':
        return '#f44336'; // Red
      default:
        return '#9e9e9e'; // Gray
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 7.5) return '#f44336'; // Red
    if (riskScore >= 5) return '#ff9800'; // Orange
    if (riskScore >= 2.5) return '#2196f3'; // Blue
    return '#4caf50'; // Green
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2} sx={{ p: 2, height: 'calc(100vh - 64px - 48px)', overflow: 'hidden' }}>
        <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e0e0e0', pr: 2 }}>
          <AIChatWindow />
        </Grid>
        <Grid item xs={12} md={8} sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', pl: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4">Tasks</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
        >
          New Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card elevation={1} sx={{ mb: 4, p: 2 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} alignItems="center">
          <TextField
            name="search"
            label="Search"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={handleFilterChange}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              name="status"
              value={filters.status}
              label="Status"
              onChange={(event: SelectChangeEvent) => {
                handleFilterChange({
                  target: {
                    name: event.target.name,
                    value: event.target.value
                  }
                } as React.ChangeEvent<HTMLInputElement>)
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="not_started">Not Started</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="delayed">Delayed</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              name="priority"
              value={filters.priority}
              label="Priority"
              onChange={(event: SelectChangeEvent) => {
                handleFilterChange({
                  target: {
                    name: event.target.name,
                    value: event.target.value
                  }
                } as React.ChangeEvent<HTMLInputElement>)
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="project-filter-label">Project</InputLabel>
            <Select
              labelId="project-filter-label"
              name="project_id"
              value={filters.project_id}
              label="Project"
              onChange={(event: SelectChangeEvent) => {
                handleFilterChange({
                  target: {
                    name: event.target.name,
                    value: event.target.value
                  }
                } as React.ChangeEvent<HTMLInputElement>)
              }}
            >
              <MenuItem value="">All Projects</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="assignee-filter-label">Assignee</InputLabel>
            <Select
              labelId="assignee-filter-label"
              name="assignee_id"
              value={filters.assignee_id}
              label="Assignee"
              onChange={(event: SelectChangeEvent) => {
                handleFilterChange({
                  target: {
                    name: event.target.name,
                    value: event.target.value
                  }
                } as React.ChangeEvent<HTMLInputElement>)
              }}
            >
              <MenuItem value="">All Assignees</MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.full_name || user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Card>

      {filteredTasks.length === 0 ? (
        <Box textAlign="center" py={5}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ mt: 2 }}
          >
            Create your first task
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} key={task.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" mb={2}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="h6" component="div">
                          {task.title}
                        </Typography>
                        {task.risk_score > 7 && (
                          <Tooltip title={`High Risk Score: ${task.risk_score.toFixed(1)}/10`}>
                            <WarningIcon color="error" sx={{ ml: 1 }} />
                          </Tooltip>
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {task.description || 'No description provided'}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" gap={1} alignItems="flex-start">
                      <Chip 
                        label={task.status.replace('_', ' ')} 
                        size="small" 
                        sx={{ 
                          backgroundColor: getStatusColor(task.status),
                          color: 'white',
                          textTransform: 'capitalize'
                        }} 
                      />
                      
                      <Chip 
                        label={task.priority} 
                        size="small" 
                        sx={{ 
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          textTransform: 'capitalize'
                        }} 
                      />
                    </Box>
                  </Box>
                  
                  <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                    <Box display="flex" alignItems="center">
                      <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {task.assignee ? (task.assignee.full_name || task.assignee.username) : 'Unassigned'}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <FlagIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Project: {task.project.name}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box mb={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        Progress: {task.completion_percentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Risk: {task.risk_score.toFixed(1)}/10
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={task.completion_percentage} 
                      sx={{ height: 8, borderRadius: 4 }} 
                    />
                  </Box>
                  
                  <Box display="flex" justifyContent="flex-end">
                    <Button 
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Task Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              margin="normal"
            />
            
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              margin="normal"
            />
            
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="project-label">Project</InputLabel>
                  <Select
                    labelId="project-label"
                    id="project_id"
                    name="project_id"
                    value={formik.values.project_id}
                    onChange={formik.handleChange}
                    label="Project"
                    error={formik.touched.project_id && Boolean(formik.errors.project_id)}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="assignee-label">Assignee</InputLabel>
                  <Select
                    labelId="assignee-label"
                    id="assignee_id"
                    name="assignee_id"
                    value={formik.values.assignee_id}
                    onChange={formik.handleChange}
                    label="Assignee"
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.full_name || user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    label="Status"
                  >
                    <MenuItem value="not_started">Not Started</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="delayed">Delayed</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    id="priority"
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={formik.values.start_date}
                    onChange={(date) => formik.setFieldValue('start_date', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.start_date && Boolean(formik.errors.start_date),
                        helperText: formik.touched.start_date && (formik.errors.start_date as string)
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Due Date"
                    value={formik.values.due_date}
                    onChange={(date) => formik.setFieldValue('due_date', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.due_date && Boolean(formik.errors.due_date),
                        helperText: formik.touched.due_date && (formik.errors.due_date as string)
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="estimated_hours"
                  name="estimated_hours"
                  label="Estimated Hours"
                  type="number"
                  value={formik.values.estimated_hours}
                  onChange={formik.handleChange}
                  error={formik.touched.estimated_hours && Boolean(formik.errors.estimated_hours)}
                  helperText={formik.touched.estimated_hours && formik.errors.estimated_hours}
                  InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? <CircularProgress size={24} /> : 'Create Task'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
          </Box>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default Tasks;
