import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon,
  Timer as TimerIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';
import { Task } from '../../utils/mockTaskAllocationService';
import { format, isPast, isToday, differenceInDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  isSelected?: boolean;
  onClick?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isDragging = false, 
  isSelected = false,
  onClick 
}) => {
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

  // Format due date and calculate days remaining
  const formatDueDate = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const daysRemaining = differenceInDays(dueDate, today);
    
    let color = '#757575'; // Default gray
    if (isPast(dueDate)) {
      color = '#d32f2f'; // Red for past due
    } else if (isToday(dueDate)) {
      color = '#f57c00'; // Orange for due today
    } else if (daysRemaining <= 2) {
      color = '#f57c00'; // Orange for due soon
    }
    
    return {
      formattedDate: format(dueDate, 'MMM d'),
      daysRemaining,
      color
    };
  };

  const { formattedDate, color: dueDateColor } = formatDueDate(task.dueDate);

  return (
    <Card 
      elevation={isDragging ? 6 : isSelected ? 3 : 1} 
      sx={{
        mb: 1.5,
        borderRadius: 2,
        cursor: 'pointer',
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
        bgcolor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
        opacity: isDragging ? 0.7 : 1,
        '&:hover': {
          boxShadow: 3,
          bgcolor: isSelected ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.02)'
        },
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'visible'
      }}
      onClick={() => onClick && onClick(task)}
    >
      {/* Drag Handle Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: -12,
          transform: 'translateY(-50%)',
          color: getPriorityColor(task.priority),
          opacity: 0.7,
          '&:hover': { opacity: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>

      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        {/* Task Title with Priority Badge */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box flexGrow={1}>
            <Typography variant="subtitle2" fontWeight="medium" sx={{ lineHeight: 1.3 }}>
              {task.title}
            </Typography>
          </Box>
          <Tooltip title={`Priority: ${task.priority}`}>
            <Chip
              icon={<FlagIcon fontSize="small" />}
              label={task.priority}
              size="small"
              sx={{
                height: 20,
                ml: 0.5,
                fontSize: '0.65rem',
                bgcolor: `${getPriorityColor(task.priority)}20`,
                color: getPriorityColor(task.priority),
                '& .MuiChip-label': { p: '0 0.75px' },
                '& .MuiChip-icon': { ml: 0.5, mr: -0.25 }
              }}
            />
          </Tooltip>
        </Box>

        {/* Task Description (truncated) */}
        <Typography variant="caption" color="text.secondary" sx={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          mt: 0.5,
          lineHeight: 1.2
        }}>
          {task.description}
        </Typography>
        
        {/* Task Tags */}
        {task.tags && task.tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.75}>
            {task.tags.slice(0, 2).map(tag => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  '& .MuiChip-label': { p: '0 0.75px' }
                }}
              />
            ))}
            {task.tags.length > 2 && (
              <Tooltip title={task.tags.slice(2).join(', ')}>
                <Chip
                  label={`+${task.tags.length - 2}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    '& .MuiChip-label': { p: '0 0.75px' }
                  }}
                />
              </Tooltip>
            )}
          </Box>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        {/* Task Metrics */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {/* Due Date */}
          <Tooltip title={`Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')}`}>
            <Box display="flex" alignItems="center" sx={{ color: dueDateColor }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: dueDateColor, fontWeight: 'medium' }}>
                {formattedDate}
              </Typography>
            </Box>
          </Tooltip>
          
          {/* Hours Estimate */}
          <Tooltip title={`${task.estimatedHours} hours estimated`}>
            <Box display="flex" alignItems="center">
              <TimerIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption">
                {task.estimatedHours}h
              </Typography>
            </Box>
          </Tooltip>
          
          {/* Status */}
          <Chip
            label={task.status.replace('_', ' ')}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              '& .MuiChip-label': { p: '0 0.75px' }
            }}
          />
        </Box>
        
        {/* Progress Bar */}
        <Box mt={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" fontWeight="bold">
              {task.completionPercentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={task.completionPercentage}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                bgcolor: task.completionPercentage === 100 ? '#4caf50' : '#2196f3'
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
