import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Close as CloseIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Label as LabelIcon
} from '@mui/icons-material';
import { Task } from '../../utils/mockTaskAllocationService';
import { StakeholderResource } from '../../utils/mockResourceService';
import { format } from 'date-fns';

interface TaskDetailPanelProps {
  selectedTasks: Task[];
  stakeholders: StakeholderResource[];
  onClose: () => void;
  onAssign: (taskIds: number[], assigneeId: number | null) => void;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({
  selectedTasks,
  stakeholders,
  onClose,
  onAssign
}) => {
  const [selectedAssignee, setSelectedAssignee] = React.useState<string>('');

  // Reset selected assignee when selected tasks change
  React.useEffect(() => {
    setSelectedAssignee('');
  }, [selectedTasks]);

  // Handle assignee change
  const handleAssigneeChange = (event: SelectChangeEvent) => {
    setSelectedAssignee(event.target.value);
  };

  // Handle assign button click
  const handleAssign = () => {
    const taskIds = selectedTasks.map(task => task.id);
    const assigneeId = selectedAssignee === 'unassigned' 
      ? null 
      : selectedAssignee 
        ? parseInt(selectedAssignee, 10) 
        : null;
    
    onAssign(taskIds, assigneeId);
    setSelectedAssignee('');
  };

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#0288d1';
      case 'low': return '#388e3c';
      default: return '#757575';
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#388e3c';
      case 'in_progress': return '#0288d1';
      case 'not_started': return '#757575';
      case 'blocked': return '#d32f2f';
      default: return '#757575';
    }
  };

  // Calculate total estimated hours
  const totalEstimatedHours = selectedTasks.reduce(
    (sum, task) => sum + task.estimatedHours,
    0
  );

  // Calculate average completion percentage
  const averageCompletion = selectedTasks.length
    ? Math.round(
        selectedTasks.reduce((sum, task) => sum + task.completionPercentage, 0) /
          selectedTasks.length
      )
    : 0;

  // Group tasks by assignee
  const tasksByAssignee: Record<string, number> = {};
  selectedTasks.forEach(task => {
    const assigneeId = task.assigneeId === null ? 'unassigned' : `${task.assigneeId}`;
    tasksByAssignee[assigneeId] = (tasksByAssignee[assigneeId] || 0) + 1;
  });

  // Get assignee name by id
  const getAssigneeName = (assigneeId: number | null): string => {
    if (assigneeId === null) return 'Unassigned';
    const assignee = stakeholders.find(s => s.id === assigneeId);
    return assignee ? assignee.name : 'Unknown';
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="subtitle1">
          {selectedTasks.length === 1
            ? 'Task Details'
            : `${selectedTasks.length} Tasks Selected`}
        </Typography>
        <IconButton size="small" color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
        {selectedTasks.length === 1 ? (
          // Single task details
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              {selectedTasks[0].title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {selectedTasks[0].description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <FlagIcon sx={{ color: getPriorityColor(selectedTasks[0].priority) }} />
                </ListItemIcon>
                <ListItemText
                  primary="Priority"
                  secondary={
                    <Chip
                      label={selectedTasks[0].priority}
                      size="small"
                      sx={{
                        bgcolor: `${getPriorityColor(selectedTasks[0].priority)}20`,
                        color: getPriorityColor(selectedTasks[0].priority),
                        fontWeight: 'medium',
                        mt: 0.5
                      }}
                    />
                  }
                />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CalendarIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Status"
                  secondary={
                    <Chip
                      label={selectedTasks[0].status.replace('_', ' ')}
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(selectedTasks[0].status)}20`,
                        color: getStatusColor(selectedTasks[0].status),
                        fontWeight: 'medium',
                        mt: 0.5
                      }}
                    />
                  }
                />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AccessTimeIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Due Date"
                  secondary={format(new Date(selectedTasks[0].dueDate), 'MMMM d, yyyy')}
                />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PersonIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Assigned To"
                  secondary={getAssigneeName(selectedTasks[0].assigneeId)}
                />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <DescriptionIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Estimated Hours"
                  secondary={`${selectedTasks[0].estimatedHours} hours`}
                />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LabelIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Tags"
                  secondary={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {selectedTasks[0].tags.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Completion Progress
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Box flexGrow={1} mr={2}>
                <LinearProgress
                  variant="determinate"
                  value={selectedTasks[0].completionPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 1
                  }}
                />
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {selectedTasks[0].completionPercentage}%
              </Typography>
            </Box>
          </Box>
        ) : (
          // Multiple tasks summary
          <Box p={2}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Tasks Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Estimated Hours
              </Typography>
              <Typography variant="h5">{totalEstimatedHours} hours</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Completion
              </Typography>
              <Box display="flex" alignItems="center">
                <Box flexGrow={1} mr={2}>
                  <LinearProgress
                    variant="determinate"
                    value={averageCompletion}
                    sx={{
                      height: 8,
                      borderRadius: 1
                    }}
                  />
                </Box>
                <Typography variant="body2" fontWeight="medium">
                  {averageCompletion}%
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Current Assignment
            </Typography>

            <List dense disablePadding>
              {Object.entries(tasksByAssignee).map(([assigneeId, count]) => (
                <ListItem key={assigneeId} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={getAssigneeName(assigneeId === 'unassigned' ? null : parseInt(assigneeId, 10))}
                    secondary={`${count} task${count > 1 ? 's' : ''}`}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Task List
            </Typography>

            <List dense disablePadding>
              {selectedTasks.map(task => (
                <ListItem key={task.id} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FlagIcon sx={{ color: getPriorityColor(task.priority) }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    secondary={`${task.estimatedHours} hours · ${task.completionPercentage}% complete`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>

      {/* Footer - Reassignment Controls */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" gutterBottom>
          Reassign Task{selectedTasks.length > 1 ? 's' : ''}
        </Typography>

        <Box display="flex" alignItems="flex-end" gap={1}>
          <FormControl fullWidth size="small" sx={{ mb: 1 }}>
            <InputLabel id="assignee-select-label">Assignee</InputLabel>
            <Select
              labelId="assignee-select-label"
              value={selectedAssignee}
              label="Assignee"
              onChange={handleAssigneeChange}
            >
              <MenuItem value="unassigned">Unassigned</MenuItem>
              {stakeholders.map(stakeholder => (
                <MenuItem key={stakeholder.id} value={stakeholder.id.toString()}>
                  {stakeholder.name} ({stakeholder.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            disabled={!selectedAssignee}
            onClick={handleAssign}
            sx={{ mb: 1 }}
          >
            Assign
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskDetailPanel;
