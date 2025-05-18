import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Assignment as TaskIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

// Define API URL
const API_URL = 'http://localhost:8000/api/v1';

interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: string;
  created_at: string;
  members: any[];
  tasks: any[];
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    // In a real implementation, we would fetch this data from the API
    // For now, we'll use mock data
    const fetchProject = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          setProject({
            id: 1,
            name: 'ForesightPM Development',
            description: 'Development of the ForesightPM application',
            start_date: '2025-05-01',
            end_date: '2025-08-01',
            budget: 50000,
            status: 'in_progress',
            created_at: '2025-05-01T00:00:00',
            members: [
              { id: 1, username: 'johndoe', full_name: 'John Doe' },
              { id: 2, username: 'janedoe', full_name: 'Jane Doe' }
            ],
            tasks: [
              { 
                id: 1, 
                title: 'Design database schema', 
                status: 'completed',
                priority: 'high',
                due_date: '2025-05-05',
                assignee: { id: 1, username: 'johndoe', full_name: 'John Doe' }
              },
              { 
                id: 2, 
                title: 'Implement user authentication', 
                status: 'in_progress',
                priority: 'critical',
                due_date: '2025-05-10',
                assignee: { id: 2, username: 'janedoe', full_name: 'Jane Doe' }
              },
              { 
                id: 3, 
                title: 'Design dashboard UI', 
                status: 'not_started',
                priority: 'medium',
                due_date: '2025-05-15',
                assignee: null
              }
            ]
          });
          setLoading(false);
        }, 1000);

        // In a real implementation, we would fetch data like this:
        // const response = await axios.get(`${API_URL}/projects/${id}`);
        // setProject(response.data);
        // setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load project');
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteProject = async () => {
    try {
      // In a real implementation, we would send a delete request to the API
      console.log('Deleting project:', id);
      
      // Navigate back to projects list
      navigate('/projects');
      
      // In a real implementation, we would do this:
      // await axios.delete(`${API_URL}/projects/${id}`);
      // navigate('/projects');
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
      setDeleteDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return '#9e9e9e'; // Gray
      case 'in_progress':
        return '#2196f3'; // Blue
      case 'completed':
        return '#4caf50'; // Green
      case 'on_hold':
        return '#ff9800'; // Orange
      case 'cancelled':
        return '#f44336'; // Red
      default:
        return '#9e9e9e'; // Gray
    }
  };

  const getTaskStatusColor = (status: string) => {
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

  if (!project) {
    return (
      <Box p={3}>
        <Alert severity="error">Project not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Project Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="h4" component="h1">
              {project.name}
            </Typography>
            <Chip 
              label={project.status.replace('_', ' ')} 
              size="small" 
              sx={{ 
                ml: 2,
                backgroundColor: getStatusColor(project.status),
                color: 'white',
                textTransform: 'capitalize'
              }} 
            />
          </Box>
          <Typography variant="body1" color="text.secondary">
            {project.description || 'No description provided'}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => console.log('Edit project')}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteDialogOpen}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Project Info Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Timeline</Typography>
              </Box>
              <Typography variant="body2">
                <strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                <strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Budget</Typography>
              </Box>
              <Typography variant="body2">
                <strong>Total Budget:</strong> ${project.budget.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Team</Typography>
              </Box>
              <Typography variant="body2">
                <strong>Team Size:</strong> {project.members.length} members
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TaskIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Tasks</Typography>
              </Box>
              <Typography variant="body2">
                <strong>Total Tasks:</strong> {project.tasks.length}
              </Typography>
              <Typography variant="body2">
                <strong>Completed:</strong> {project.tasks.filter(task => task.status === 'completed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Tasks" />
          <Tab label="Team" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>
        {/* Tasks Tab */}
        {tabValue === 0 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Project Tasks</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/tasks')}
                size="small"
              >
                Add Task
              </Button>
            </Box>
            
            {project.tasks.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Typography variant="body1" color="text.secondary">
                  No tasks found for this project
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/tasks')}
                  sx={{ mt: 2 }}
                >
                  Add First Task
                </Button>
              </Box>
            ) : (
              <List>
                {project.tasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem 
                      button 
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      sx={{ py: 1.5, borderRadius: 1, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                      secondaryAction={
                        <Box display="flex" alignItems="center">
                          <Chip 
                            label={task.status.replace('_', ' ')} 
                            size="small" 
                            sx={{ 
                              mr: 1,
                              backgroundColor: getTaskStatusColor(task.status),
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
                      }
                    >
                      <ListItemText 
                        primary={task.title} 
                        secondary={
                          <Box component="span" display="flex" alignItems="center">
                            <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                            <Box component="span" sx={{ mx: 1 }}>•</Box>
                            <PeopleIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                            <span>{task.assignee ? (task.assignee.full_name || task.assignee.username) : 'Unassigned'}</span>
                          </Box>
                        } 
                      />
                    </ListItem>
                    {index < project.tasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* Team Tab */}
        {tabValue === 1 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Project Team</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => console.log('Add team member')}
                size="small"
              >
                Add Member
              </Button>
            </Box>
            
            {project.members.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Typography variant="body1" color="text.secondary">
                  No team members found for this project
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => console.log('Add team member')}
                  sx={{ mt: 2 }}
                >
                  Add First Member
                </Button>
              </Box>
            ) : (
              <List>
                {project.members.map((member, index) => (
                  <React.Fragment key={member.id}>
                    <ListItem 
                      sx={{ py: 1.5 }}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => console.log('Remove member', member.id)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <Avatar sx={{ mr: 2 }}>{member.full_name ? member.full_name[0] : member.username[0]}</Avatar>
                      <ListItemText 
                        primary={member.full_name || member.username} 
                        secondary={member.username} 
                      />
                    </ListItem>
                    {index < project.members.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this project? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteProject} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails;
