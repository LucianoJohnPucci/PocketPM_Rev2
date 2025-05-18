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
  TextField,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Assignment as TaskIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  Comment as CommentIcon,
  Link as LinkIcon
} from '@mui/icons-material';

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
  creator: {
    id: number;
    username: string;
    full_name: string;
  };
  dependencies: any[];
  comments: any[];
}

interface RiskPrediction {
  risk_score: number;
  risk_level: string;
  contributing_factors: Record<string, number>;
  mitigation_suggestions: string[];
}

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [riskPrediction, setRiskPrediction] = useState<RiskPrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');

  useEffect(() => {
    // In a real implementation, we would fetch this data from the API
    // For now, we'll use mock data
    const fetchTask = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          setTask({
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
            creator: {
              id: 1,
              username: 'johndoe',
              full_name: 'John Doe'
            },
            dependencies: [
              {
                id: 1,
                prerequisite_task_id: 1,
                dependent_task_id: 2,
                dependency_type: 'finish-to-start',
                prerequisite_task: {
                  id: 1,
                  title: 'Design database schema',
                  status: 'completed'
                }
              }
            ],
            comments: [
              {
                id: 1,
                content: 'I\'ve started working on this. Will update the progress soon.',
                created_at: '2025-05-05T10:00:00',
                user: {
                  id: 2,
                  username: 'janedoe',
                  full_name: 'Jane Doe'
                }
              },
              {
                id: 2,
                content: 'Make sure to follow the security best practices for JWT implementation.',
                created_at: '2025-05-05T11:30:00',
                user: {
                  id: 1,
                  username: 'johndoe',
                  full_name: 'John Doe'
                }
              }
            ]
          });
          
          setRiskPrediction({
            risk_score: 7.8,
            risk_level: 'High',
            contributing_factors: {
              'priority_level': 0.35,
              'dependency_count': 0.25,
              'estimated_hours': 0.20,
              'days_until_due': 0.15,
              'task_complexity': 0.05
            },
            mitigation_suggestions: [
              'Consider breaking down this complex task into smaller, more manageable subtasks.',
              'Allocate additional resources to ensure timely completion.',
              'Implement more frequent progress tracking to identify issues early.'
            ]
          });
          
          setLoading(false);
        }, 1000);

        // In a real implementation, we would fetch data like this:
        // const response = await axios.get(`${API_URL}/tasks/${id}`);
        // setTask(response.data);
        // const riskResponse = await axios.get(`${API_URL}/risk-prediction/task/${id}`);
        // setRiskPrediction(riskResponse.data);
        // setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load task');
        setLoading(false);
      }
    };

    fetchTask();
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

  const handleDeleteTask = async () => {
    try {
      // In a real implementation, we would send a delete request to the API
      console.log('Deleting task:', id);
      
      // Navigate back to tasks list
      navigate('/tasks');
      
      // In a real implementation, we would do this:
      // await axios.delete(`${API_URL}/tasks/${id}`);
      // navigate('/tasks');
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      setDeleteDialogOpen(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      // In a real implementation, we would send a post request to the API
      console.log('Adding comment:', commentText);
      
      // Simulate adding a comment
      if (task) {
        const newComment = {
          id: task.comments.length + 1,
          content: commentText,
          created_at: new Date().toISOString(),
          user: {
            id: 1, // Current user ID (hardcoded for demo)
            username: 'johndoe',
            full_name: 'John Doe'
          }
        };
        
        setTask({
          ...task,
          comments: [...task.comments, newComment]
        });
        
        setCommentText('');
      }
      
      // In a real implementation, we would do this:
      // const response = await axios.post(`${API_URL}/tasks/${id}/comments`, { content: commentText });
      // setTask({
      //   ...task,
      //   comments: [...task.comments, response.data]
      // });
      // setCommentText('');
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
    }
  };

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

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!task) {
    return (
      <Box p={3}>
        <Alert severity="error">Task not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Task Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="h4" component="h1">
              {task.title}
            </Typography>
            <Box display="flex" gap={1} ml={2}>
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
          <Typography variant="body1" color="text.secondary">
            {task.description || 'No description provided'}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => console.log('Edit task')}
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

      {/* Task Info Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Timeline</Typography>
              </Box>
              <Typography variant="body2">
                <strong>Start Date:</strong> {task.start_date ? new Date(task.start_date).toLocaleDateString() : 'Not set'}
              </Typography>
              <Typography variant="body2">
                <strong>Due Date:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not set'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">People</Typography>
              </Box>
              <Typography variant="body2">
                <strong>Assignee:</strong> {task.assignee ? (task.assignee.full_name || task.assignee.username) : 'Unassigned'}
              </Typography>
              <Typography variant="body2">
                <strong>Creator:</strong> {task.creator.full_name || task.creator.username}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TaskIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Effort</Typography>
              </Box>
              <Typography variant="body2">
                <strong>Estimated:</strong> {task.estimated_hours} hours
              </Typography>
              <Typography variant="body2">
                <strong>Actual:</strong> {task.actual_hours} hours
              </Typography>
              <Typography variant="body2">
                <strong>Progress:</strong> {task.completion_percentage}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={task.completion_percentage} 
                sx={{ height: 8, borderRadius: 4, mt: 1 }} 
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%', 
              borderRadius: 2,
              backgroundColor: getRiskColor(task.risk_score),
              color: 'white'
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <WarningIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Risk Score</Typography>
              </Box>
              <Typography variant="h3" align="center" sx={{ mb: 1 }}>
                {task.risk_score.toFixed(1)}/10
              </Typography>
              <Typography variant="body2" align="center">
                {riskPrediction?.risk_level || 'Unknown'} Risk
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Comments" />
          <Tab label="Dependencies" />
          <Tab label="Risk Analysis" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>
        {/* Comments Tab */}
        {tabValue === 0 && (
          <Box>
            <Box mb={3}>
              <TextField
                fullWidth
                label="Add a comment"
                multiline
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                variant="outlined"
                placeholder="Type your comment here..."
              />
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  Add Comment
                </Button>
              </Box>
            </Box>
            
            {task.comments.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Typography variant="body1" color="text.secondary">
                  No comments yet
                </Typography>
              </Box>
            ) : (
              <List>
                {task.comments.map((comment, index) => (
                  <React.Fragment key={comment.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ py: 2 }}
                    >
                      <Avatar sx={{ mr: 2, mt: 1 }}>
                        {comment.user.full_name ? comment.user.full_name[0] : comment.user.username[0]}
                      </Avatar>
                      <ListItemText 
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle1">
                              {comment.user.full_name || comment.user.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(comment.created_at).toLocaleString()}
                            </Typography>
                          </Box>
                        } 
                        secondary={
                          <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{ mt: 1 }}
                          >
                            {comment.content}
                          </Typography>
                        } 
                      />
                    </ListItem>
                    {index < task.comments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* Dependencies Tab */}
        {tabValue === 1 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Task Dependencies</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => console.log('Add dependency')}
                size="small"
              >
                Add Dependency
              </Button>
            </Box>
            
            {task.dependencies.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Typography variant="body1" color="text.secondary">
                  No dependencies for this task
                </Typography>
              </Box>
            ) : (
              <List>
                {task.dependencies.map((dependency, index) => (
                  <React.Fragment key={dependency.id}>
                    <ListItem 
                      sx={{ py: 2 }}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => console.log('Remove dependency', dependency.id)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText 
                        primary={
                          <Box display="flex" alignItems="center">
                            <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="body1">
                              This task depends on: <strong>{dependency.prerequisite_task.title}</strong>
                            </Typography>
                          </Box>
                        } 
                        secondary={
                          <Box mt={1}>
                            <Typography variant="body2" color="text.secondary">
                              Dependency Type: {dependency.dependency_type.replace('-', ' to ')}
                            </Typography>
                            <Box display="flex" alignItems="center" mt={0.5}>
                              <Typography variant="body2" mr={1}>Status:</Typography>
                              <Chip 
                                label={dependency.prerequisite_task.status.replace('_', ' ')} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: getStatusColor(dependency.prerequisite_task.status),
                                  color: 'white',
                                  textTransform: 'capitalize'
                                }} 
                              />
                            </Box>
                          </Box>
                        } 
                      />
                    </ListItem>
                    {index < task.dependencies.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* Risk Analysis Tab */}
        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Risk Analysis</Typography>
            
            {!riskPrediction ? (
              <Box textAlign="center" py={3}>
                <Typography variant="body1" color="text.secondary">
                  No risk analysis available for this task
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Risk Factors</Typography>
                      <List>
                        {Object.entries(riskPrediction.contributing_factors)
                          .sort(([, a], [, b]) => b - a)
                          .map(([factor, weight]) => (
                            <ListItem key={factor}>
                              <ListItemText 
                                primary={
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body1">
                                      {factor.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                                    </Typography>
                                    <Typography variant="body2">
                                      {(weight * 100).toFixed(0)}% impact
                                    </Typography>
                                  </Box>
                                } 
                                secondary={
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={weight * 100} 
                                    sx={{ height: 6, borderRadius: 3, mt: 1 }} 
                                  />
                                }
                              />
                            </ListItem>
                          ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Mitigation Suggestions</Typography>
                      <List>
                        {riskPrediction.mitigation_suggestions.map((suggestion, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={suggestion} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDetails;
