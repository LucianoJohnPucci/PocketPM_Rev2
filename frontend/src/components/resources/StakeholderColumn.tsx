import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  LinearProgress,
  Tooltip,
  Badge,
  Avatar,
  Chip
} from '@mui/material';
import { StakeholderResource } from '../../utils/mockResourceService';
import { Task } from '../../utils/mockTaskAllocationService';
import TaskCard from './TaskCard';

interface StakeholderColumnProps {
  stakeholder: StakeholderResource;
  tasks: Task[];
  selectedTaskIds: number[];
  onTaskClick: (task: Task) => void;
  onDrop: (taskIds: number[]) => void;
  isDraggingOver: boolean;
}

const StakeholderColumn: React.FC<StakeholderColumnProps> = ({
  stakeholder,
  tasks,
  selectedTaskIds,
  onTaskClick,
  onDrop,
  isDraggingOver
}) => {
  // Get utilization color based on rate
  const getUtilizationColor = (rate: number): string => {
    if (rate > 90) return '#f44336'; // Overallocated - red
    if (rate > 75) return '#ff9800'; // High utilization - orange
    if (rate > 50) return '#4caf50'; // Good utilization - green
    return '#2196f3'; // Underutilized - blue
  };

  // Get utilization status text
  const getUtilizationStatus = (rate: number): string => {
    if (rate > 90) return 'Overallocated';
    if (rate > 75) return 'High';
    if (rate > 50) return 'Optimal';
    return 'Underallocated';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskIds = e.dataTransfer.getData('taskIds');
    if (taskIds) {
      onDrop(JSON.parse(taskIds));
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        bgcolor: isDraggingOver ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
        transition: 'background-color 0.2s ease',
        border: isDraggingOver ? '1px dashed #1976d2' : '1px solid transparent'
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Stakeholder Header */}
      <Box p={2} pb={1}>
        <Box display="flex" alignItems="center" mb={1}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Tooltip title={`${tasks.length} tasks assigned`}>
                <Chip
                  label={tasks.length}
                  size="small"
                  color="primary"
                  sx={{ height: 20, minWidth: 20, fontSize: '0.75rem' }}
                />
              </Tooltip>
            }
          >
            <Avatar
              sx={{
                bgcolor: getUtilizationColor(stakeholder.utilizationRate),
                width: 40,
                height: 40
              }}
            >
              {stakeholder.name.charAt(0)}
            </Avatar>
          </Badge>
          <Box ml={1.5}>
            <Typography variant="subtitle1" fontWeight="medium">
              {stakeholder.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stakeholder.role}
            </Typography>
          </Box>
        </Box>

        {/* Utilization Bar */}
        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="caption" color="text.secondary">
              Utilization
            </Typography>
            <Chip
              label={getUtilizationStatus(stakeholder.utilizationRate)}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: `${getUtilizationColor(stakeholder.utilizationRate)}20`,
                color: getUtilizationColor(stakeholder.utilizationRate),
                '& .MuiChip-label': { px: 1 }
              }}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1} mr={1}>
              <LinearProgress
                variant="determinate"
                value={stakeholder.utilizationRate}
                sx={{
                  height: 6,
                  borderRadius: 1,
                  bgcolor: 'rgba(0,0,0,0.05)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: getUtilizationColor(stakeholder.utilizationRate)
                  }
                }}
              />
            </Box>
            <Typography variant="caption" fontWeight="bold">
              {stakeholder.utilizationRate}%
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {stakeholder.allocatedHours} of {stakeholder.availableHours} hours
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Tasks List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 1.5,
          minHeight: 100
        }}
      >
        {tasks.length === 0 ? (
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
              No tasks assigned
            </Typography>
          </Box>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              isSelected={selectedTaskIds.includes(task.id)}
              onClick={onTaskClick}
            />
          ))
        )}
      </Box>
    </Paper>
  );
};

export default StakeholderColumn;
