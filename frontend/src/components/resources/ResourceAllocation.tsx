import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Snackbar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  FilterNone as FilterNoneIcon
} from '@mui/icons-material';
import { 
  getTaskAllocationSummary, 
  getUnassignedTasks,
  assignTask,
  bulkAssignTasks,
  calculateReassignmentImpact,
  Task
} from '../../utils/mockTaskAllocationService';
import { StakeholderResource } from '../../utils/mockResourceService';
import { useAuth } from '../../contexts/AuthContext';
import StakeholderColumn from './StakeholderColumn';
import TaskDetailPanel from './TaskDetailPanel';
import WorkloadImpactPanel from './WorkloadImpactPanel';
import TaskFilterBar, { TaskFilters, FilterPreset } from './TaskFilterBar';
import TaskCard from './TaskCard';
import { isAfter, isBefore, isToday, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface ResourceAllocationProps {}

const ResourceAllocation: React.FC<ResourceAllocationProps> = () => {
  const { user } = useAuth();
  const isProjectManager = user?.role === 'project_manager' || user?.role === 'admin';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stakeholders, setStakeholders] = useState<StakeholderResource[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [unassignedTasks, setUnassignedTasks] = useState<Task[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [draggingTaskIds, setDraggingTaskIds] = useState<number[]>([]);
  const [draggingOverStakeholderId, setDraggingOverStakeholderId] = useState<number | null>(null);
  const [impactData, setImpactData] = useState<{
    currentAssigneeImpact: { id: number; newUtilizationRate: number }[];
    newAssigneeImpact: { id: number; newUtilizationRate: number } | null;
  } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });
  
  // Task filters
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    priority: [],
    status: [],
    dueDate: '',
    sortBy: 'due_date_asc',
    tags: [],
    assignees: null,
    estimatedHoursMin: null,
    estimatedHoursMax: null,
    completionMin: null,
    completionMax: null,
    showCompletedTasks: true
  });

  // Fetch task allocation data
  const fetchTaskAllocationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const summary = await getTaskAllocationSummary();
      setStakeholders(summary.stakeholders);
      setTasks(summary.tasks);
      
      const unassigned = await getUnassignedTasks();
      setUnassignedTasks(unassigned);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load resource allocation data');
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    console.log('Fetching task allocation data...');
    fetchTaskAllocationData();
  }, [fetchTaskAllocationData]);

  // Debug logs
  useEffect(() => {
    console.log('Stakeholders:', stakeholders);
    console.log('Tasks:', tasks);
    console.log('Unassigned Tasks:', unassignedTasks);
  }, [stakeholders, tasks, unassignedTasks]);

  // Handle task selection
  const handleTaskClick = (task: Task) => {
    setSelectedTaskIds(prev => {
      const isSelected = prev.includes(task.id);
      if (isSelected) {
        return prev.filter(id => id !== task.id);
      } else {
        return [...prev, task.id];
      }
    });
  };

  // Handle task drag start
  const handleTaskDragStart = (taskIds: number[]) => {
    setDraggingTaskIds(taskIds);
  };

  // Handle task drag end
  const handleTaskDragEnd = () => {
    setDraggingTaskIds([]);
    setDraggingOverStakeholderId(null);
  };

  // Handle stakeholder drag over
  const handleStakeholderDragOver = (stakeholderId: number | null) => {
    setDraggingOverStakeholderId(stakeholderId);
    
    // Calculate impact of reassignment
    if (draggingTaskIds.length > 0) {
      calculateReassignmentImpact(draggingTaskIds, stakeholderId)
        .then(impact => {
          setImpactData(impact);
        })
        .catch(err => {
          console.error('Failed to calculate reassignment impact:', err);
        });
    }
  };

  // Handle task drop on stakeholder
  const handleTaskDrop = async (stakeholderId: number | null, taskIds: number[]) => {
    try {
      await bulkAssignTasks(taskIds, stakeholderId);
      
      // Update local state
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (taskIds.includes(task.id)) {
            return { ...task, assigneeId: stakeholderId };
          }
          return task;
        });
      });
      
      // Update unassigned tasks
      if (stakeholderId === null) {
        setUnassignedTasks(prev => [...prev, ...tasks.filter(t => taskIds.includes(t.id))]);
      } else {
        setUnassignedTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
      }
      
      // Clear selection and impact data
      setSelectedTaskIds([]);
      setImpactData(null);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Successfully reassigned ${taskIds.length} task${taskIds.length > 1 ? 's' : ''}`,
        severity: 'success'
      });
      
      // Refresh data to get updated utilization rates
      fetchTaskAllocationData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to reassign tasks',
        severity: 'error'
      });
    }
  };

  // Handle task assignment from detail panel
  const handleTaskAssign = async (taskIds: number[], assigneeId: number | null) => {
    try {
      await bulkAssignTasks(taskIds, assigneeId);
      
      // Update local state
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (taskIds.includes(task.id)) {
            return { ...task, assigneeId };
          }
          return task;
        });
      });
      
      // Update unassigned tasks
      if (assigneeId === null) {
        setUnassignedTasks(prev => [...prev, ...tasks.filter(t => taskIds.includes(t.id))]);
      } else {
        setUnassignedTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
      }
      
      // Clear selection and impact data
      setSelectedTaskIds([]);
      setImpactData(null);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Successfully assigned ${taskIds.length} task${taskIds.length > 1 ? 's' : ''}`,
        severity: 'success'
      });
      
      // Refresh data to get updated utilization rates
      fetchTaskAllocationData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to assign tasks',
        severity: 'error'
      });
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      priority: [],
      status: [],
      dueDate: '',
      sortBy: 'due_date_asc',
      tags: [],
      assignees: null,
      estimatedHoursMin: null,
      estimatedHoursMax: null,
      completionMin: null,
      completionMax: null,
      showCompletedTasks: true
    });
  };
  
  // Handle save filter preset
  const handleSaveFilterPreset = async (preset: Omit<FilterPreset, 'id'>) => {
    try {
      const { saveFilterPreset } = await import('../../utils/mockFilterPresetService');
      await saveFilterPreset(preset);
      
      // Update the current filters with the saved name
      setFilters({
        ...filters,
        savedFilterName: preset.name
      });
      
      setSnackbar({
        open: true,
        message: `Filter preset '${preset.name}' saved successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving filter preset:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save filter preset',
        severity: 'error'
      });
    }
  };
  
  // Handle load filter preset
  const handleLoadFilterPreset = (preset: FilterPreset) => {
    // Apply the preset filters
    setFilters(preset.filters);
    
    setSnackbar({
      open: true,
      message: `Loaded preset: ${preset.name}`,
      severity: 'info'
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter tasks based on current filters
  const filterTasks = (taskList: Task[]): Task[] => {
    return taskList.filter(task => {
      // Search filter
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !task.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
        return false;
      }
      
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false;
      }
      
      // Show/hide completed tasks
      if (!filters.showCompletedTasks && task.status === 'completed') {
        return false;
      }
      
      // Tags filter
      if (filters.tags.length > 0) {
        // If task has no tags or none of the selected tags match
        if (!task.tags || !task.tags.some(tag => filters.tags.includes(tag))) {
          return false;
        }
      }
      
      // Assignee filter
      if (filters.assignees && filters.assignees.length > 0) {
        // Handle null assigneeId case
        if (task.assigneeId === null || !filters.assignees.includes(task.assigneeId)) {
          return false;
        }
      }
      
      // Estimated hours range filter
      if (filters.estimatedHoursMin !== null && filters.estimatedHoursMin > 0 && task.estimatedHours < filters.estimatedHoursMin) {
        return false;
      }
      if (filters.estimatedHoursMax !== null && filters.estimatedHoursMax > 0 && task.estimatedHours > filters.estimatedHoursMax) {
        return false;
      }
      
      // Completion percentage range filter
      if (filters.completionMin !== null && filters.completionMin > 0 && task.completionPercentage < filters.completionMin) {
        return false;
      }
      if (filters.completionMax !== null && filters.completionMax > 0 && task.completionPercentage > filters.completionMax) {
        return false;
      }
      
      // Due date filter
      if (filters.dueDate) {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        
        switch (filters.dueDate) {
          case 'overdue':
            if (!isBefore(dueDate, today)) return false;
            break;
          case 'today':
            if (!isToday(dueDate)) return false;
            break;
          case 'this_week': {
            const weekStart = startOfWeek(today);
            const weekEnd = endOfWeek(today);
            if (!(isAfter(dueDate, weekStart) && isBefore(dueDate, weekEnd))) return false;
            break;
          }
          case 'next_week': {
            const nextWeekStart = addDays(startOfWeek(today), 7);
            const nextWeekEnd = addDays(endOfWeek(today), 7);
            if (!(isAfter(dueDate, nextWeekStart) && isBefore(dueDate, nextWeekEnd))) return false;
            break;
          }
          case 'this_month': {
            const monthStart = startOfMonth(today);
            const monthEnd = endOfMonth(today);
            if (!(isAfter(dueDate, monthStart) && isBefore(dueDate, monthEnd))) return false;
            break;
          }
        }
      }
      
      return true;
    });
  };

  // Sort tasks based on current sort option
  const sortTasks = (taskList: Task[]): Task[] => {
    return [...taskList].sort((a, b) => {
      switch (filters.sortBy) {
        case 'due_date_asc':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'due_date_desc':
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'priority_desc': {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'priority_asc': {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'estimated_hours_desc':
          return b.estimatedHours - a.estimatedHours;
        case 'estimated_hours_asc':
          return a.estimatedHours - b.estimatedHours;
        case 'completion_desc':
          return b.completionPercentage - a.completionPercentage;
        case 'completion_asc':
          return a.completionPercentage - b.completionPercentage;
        default:
          return 0;
      }
    });
  };

  // Get filtered and sorted tasks for each stakeholder
  const getStakeholderTasks = (stakeholderId: number): Task[] => {
    const stakeholderTasks = tasks.filter(task => task.assigneeId === stakeholderId);
    return sortTasks(filterTasks(stakeholderTasks));
  };

  // Get filtered and sorted unassigned tasks
  const getFilteredUnassignedTasks = (): Task[] => {
    return sortTasks(filterTasks(unassignedTasks));
  };

  // Get selected tasks
  const getSelectedTasks = (): Task[] => {
    return tasks.filter(task => selectedTaskIds.includes(task.id));
  };

  // Temporarily disabled role check to ensure stakeholder columns are visible
  // if (!isProjectManager) {
  //   return (
  //     <Alert severity="info" sx={{ mb: 2 }}>
  //       Resource allocation is only available to Project Managers.
  //     </Alert>
  //   );
  // }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Task Filter Bar */}
      {/* <TaskFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onSavePreset={handleSaveFilterPreset}
        onLoadPreset={handleLoadFilterPreset}
      />
      
      {/* Main Content */}
      <Grid container spacing={2}>
        {/* Stakeholder Columns */}
        <Grid item xs={12} md={selectedTaskIds.length > 0 ? 8 : 12}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            {/* Action Bar */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}
            >
              <Typography variant="subtitle1">
                Resource Allocation
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={fetchTaskAllocationData}
                  sx={{ mr: 1 }}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={() => {
                    setSnackbar({
                      open: true,
                      message: 'Resource allocation saved successfully',
                      severity: 'success'
                    });
                  }}
                >
                  Save Allocation
                </Button>
              </Box>
            </Box>

            {/* Stakeholder Grid */}
            <Grid container spacing={2} sx={{ flexGrow: 1, minHeight: 500 }}>
              {/* Unassigned Tasks Column */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    bgcolor: draggingOverStakeholderId === null ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                    transition: 'background-color 0.2s ease',
                    border: draggingOverStakeholderId === null ? '1px dashed #1976d2' : '1px solid transparent'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleStakeholderDragOver(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const taskIds = e.dataTransfer.getData('taskIds');
                    if (taskIds) {
                      handleTaskDrop(null, JSON.parse(taskIds));
                    }
                  }}
                >
                  <Box p={2} pb={1}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <FilterNoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        Unassigned Tasks
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Drag tasks here to unassign them
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      flexGrow: 1,
                      overflowY: 'auto',
                      p: 1.5,
                      minHeight: 100
                    }}
                  >
                    {getFilteredUnassignedTasks().map(task => (
                      <Box
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('taskIds', JSON.stringify([task.id]));
                          handleTaskDragStart([task.id]);
                        }}
                        onDragEnd={handleTaskDragEnd}
                      >
                        <TaskCard
                          task={task}
                          isSelected={selectedTaskIds.includes(task.id)}
                          onClick={handleTaskClick}
                        />
                      </Box>
                    ))}

                    {getFilteredUnassignedTasks().length === 0 && (
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'text.secondary',
                          p: 2,
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No unassigned tasks
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Stakeholder Columns */}
              {stakeholders.map(stakeholder => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={stakeholder.id}>
                  <Box
                    draggable={selectedTaskIds.length > 0}
                    onDragStart={(e) => {
                      if (selectedTaskIds.length > 0) {
                        e.dataTransfer.setData('taskIds', JSON.stringify(selectedTaskIds));
                        handleTaskDragStart(selectedTaskIds);
                      }
                    }}
                    onDragEnd={handleTaskDragEnd}
                  >
                    <StakeholderColumn
                      stakeholder={stakeholder}
                      tasks={getStakeholderTasks(stakeholder.id)}
                      selectedTaskIds={selectedTaskIds}
                      onTaskClick={handleTaskClick}
                      onDrop={(taskIds) => handleTaskDrop(stakeholder.id, taskIds)}
                      isDraggingOver={draggingOverStakeholderId === stakeholder.id}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Task Details and Impact Panel */}
        {selectedTaskIds.length > 0 && (
          <Grid item xs={12} md={4}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <TaskDetailPanel
                  selectedTasks={getSelectedTasks()}
                  stakeholders={stakeholders}
                  onClose={() => setSelectedTaskIds([])}
                  onAssign={handleTaskAssign}
                />
              </Grid>
              <Grid item xs={12}>
                <WorkloadImpactPanel
                  stakeholders={stakeholders}
                  impactData={impactData}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default ResourceAllocation;
