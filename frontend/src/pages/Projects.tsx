import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Define API URL
const API_URL = 'http://localhost:8000/api/v1';

interface User {
  id: number;
  username: string;
  full_name?: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: string;
  created_at: string;
  members: User[];
  tasks: any[];
}

interface ProjectFormValues {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: string;
  member_ids: number[];
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // In a real implementation, we would fetch this data from the API
    // For now, we'll use mock data
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          setProjects([
            {
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
                { id: 1, title: 'Design database schema', status: 'completed' },
                { id: 2, title: 'Implement user authentication', status: 'in_progress' },
                { id: 3, title: 'Design dashboard UI', status: 'not_started' }
              ]
            },
            {
              id: 2,
              name: 'Marketing Campaign',
              description: 'Marketing campaign for the ForesightPM launch',
              start_date: '2025-07-01',
              end_date: '2025-09-01',
              budget: 25000,
              status: 'planning',
              created_at: '2025-05-01T00:00:00',
              members: [
                { id: 2, username: 'janedoe', full_name: 'Jane Doe' },
                { id: 3, username: 'bobsmith', full_name: 'Bob Smith' }
              ],
              tasks: [
                { id: 4, title: 'Create marketing materials', status: 'not_started' },
                { id: 5, title: 'Plan social media strategy', status: 'not_started' }
              ]
            }
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
        // const response = await axios.get(`${API_URL}/projects`);
        // setProjects(response.data);
        // const usersResponse = await axios.get(`${API_URL}/users`);
        // setUsers(usersResponse.data);
        // setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const formik = useFormik<ProjectFormValues>({
    initialValues: {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      budget: 0,
      status: 'planning',
      member_ids: []
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Project name is required'),
      description: Yup.string(),
      start_date: Yup.date().required('Start date is required'),
      end_date: Yup.date().required('End date is required')
        .min(
          Yup.ref('start_date'),
          'End date must be after start date'
        ),
      budget: Yup.number().min(0, 'Budget must be a positive number'),
      status: Yup.string().required('Status is required'),
      member_ids: Yup.array().of(Yup.number()),
    }),
    onSubmit: async (values) => {
      try {
        // In a real implementation, we would send this data to the API
        console.log('Creating project:', values);
        
        // Simulate API call
        const newProject = {
          id: projects.length + 1,
          name: values.name,
          description: values.description,
          start_date: values.start_date ? new Date(values.start_date).toISOString().split('T')[0] : '',
          end_date: values.end_date ? new Date(values.end_date).toISOString().split('T')[0] : '',
          budget: Number(values.budget) || 0,
          status: values.status,
          created_at: new Date().toISOString(),
          members: users.filter(user => values.member_ids.includes(user.id as number)),
          tasks: []
        };
        
        setProjects([...projects, newProject as Project]);
        handleCloseDialog();
        
        // In a real implementation, we would do this:
        // const response = await axios.post(`${API_URL}/projects`, values);
        // setProjects([...projects, response.data]);
        // handleCloseDialog();
      } catch (err: any) {
        setError(err.message || 'Failed to create project');
      }
    },
  });

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {projects.length === 0 ? (
        <Box textAlign="center" py={5}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects found
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ mt: 2 }}
          >
            Create your first project
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h5" component="div" gutterBottom>
                      {project.name}
                    </Typography>
                    <Chip 
                      label={project.status.replace('_', ' ')} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getStatusColor(project.status),
                        color: 'white',
                        textTransform: 'capitalize'
                      }} 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description || 'No description provided'}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <MoneyIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Budget: ${project.budget.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {project.members.length} team members
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center">
                    <AssignmentIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {project.tasks.length} tasks
                    </Typography>
                  </Box>
                </CardContent>
                
                <Box p={2} pt={0}>
                  <Button 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    fullWidth
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Project Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Project Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
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
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box display="flex" gap={2} mt={2}>
                <DatePicker
                  label="Start Date"
                  value={formik.values.start_date}
                  onChange={(date) => formik.setFieldValue('start_date', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.start_date && Boolean(formik.errors.start_date),
                      helperText: formik.touched.start_date && formik.errors.start_date as string
                    }
                  }}
                />
                
                <DatePicker
                  label="End Date"
                  value={formik.values.end_date}
                  onChange={(date) => formik.setFieldValue('end_date', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.end_date && Boolean(formik.errors.end_date),
                      helperText: formik.touched.end_date && formik.errors.end_date as string
                    }
                  }}
                />
              </Box>
            </LocalizationProvider>
            
            <TextField
              fullWidth
              id="budget"
              name="budget"
              label="Budget ($)"
              type="number"
              value={formik.values.budget}
              onChange={formik.handleChange}
              error={formik.touched.budget && Boolean(formik.errors.budget)}
              helperText={formik.touched.budget && formik.errors.budget}
              margin="normal"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                label="Status"
              >
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="members-label">Team Members</InputLabel>
              <Select
                labelId="members-label"
                id="member_ids"
                name="member_ids"
                multiple
                value={formik.values.member_ids}
                onChange={formik.handleChange}
                label="Team Members"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as number[]).map((value) => {
                      const user = users.find(u => u.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={user ? (user.full_name || user.username) : value} 
                          size="small" 
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.full_name || user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? <CircularProgress size={24} /> : 'Create Project'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Projects;
