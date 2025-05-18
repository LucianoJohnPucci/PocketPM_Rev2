import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Divider,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { ResourceAllocationData } from '../../utils/mockResourceService';

interface ResourceSummaryProps {
  data: ResourceAllocationData;
}

const ResourceSummary: React.FC<ResourceSummaryProps> = ({ data }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Average Utilization */}
      <Grid item xs={12} md={6} lg={3}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Average Utilization
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'medium', mr: 1 }}>
                {data.averageUtilizationRate}%
              </Typography>
              {data.averageUtilizationRate > 80 ? (
                <TrendingUpIcon color="error" />
              ) : data.averageUtilizationRate < 50 ? (
                <TrendingDownIcon color="info" />
              ) : (
                <CheckCircleIcon color="success" />
              )}
            </Box>
            <LinearProgress
              variant="determinate"
              value={data.averageUtilizationRate}
              sx={{
                height: 8,
                borderRadius: 1,
                mb: 1,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor:
                    data.averageUtilizationRate > 80
                      ? '#f44336'
                      : data.averageUtilizationRate > 60
                      ? '#4caf50'
                      : '#2196f3',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {data.averageUtilizationRate > 80
                ? 'Team is approaching capacity limits'
                : data.averageUtilizationRate < 50
                ? 'Resources are underutilized'
                : 'Team is optimally allocated'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Allocation Status */}
      <Grid item xs={12} md={6} lg={3}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Allocation Status
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'medium' }}>
                {data.totalStakeholders}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                Stakeholders
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Chip
                size="small"
                icon={<WarningIcon />}
                label={`${data.overallocatedCount} Overallocated`}
                sx={{ bgcolor: '#ffebee', color: '#d32f2f', fontWeight: 'medium', fontSize: '0.75rem' }}
              />
              <Chip
                size="small"
                icon={<TrendingDownIcon />}
                label={`${data.underallocatedCount} Underallocated`}
                sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 'medium', fontSize: '0.75rem' }}
              />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" alignItems="center">
              <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2" color="text.secondary">
                {data.optimallyAllocatedCount} stakeholders optimally allocated
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Task Distribution */}
      <Grid item xs={12} md={6} lg={3}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Task Distribution
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'medium' }}>
                {data.stakeholders.reduce((sum, s) => sum + s.totalTasks, 0)}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                Total Tasks
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Completion Rate
              </Typography>
              <Box display="flex" alignItems="center">
                <Box flexGrow={1} mr={2}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (data.stakeholders.reduce((sum, s) => sum + s.completedTasks, 0) /
                        data.stakeholders.reduce((sum, s) => sum + s.totalTasks, 0)) *
                      100
                    }
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4caf50',
                      },
                    }}
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(
                    (data.stakeholders.reduce((sum, s) => sum + s.completedTasks, 0) /
                      data.stakeholders.reduce((sum, s) => sum + s.totalTasks, 0)) *
                      100
                  )}%
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Priority Distribution */}
      <Grid item xs={12} md={6} lg={3}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Priority Distribution
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                High & Critical Tasks
              </Typography>
              <Box display="flex" alignItems="center">
                <Box flexGrow={1} mr={2}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (data.stakeholders.reduce(
                        (sum, s) => sum + s.tasksByPriority.high + s.tasksByPriority.critical,
                        0
                      ) /
                        data.stakeholders.reduce((sum, s) => sum + s.totalTasks, 0)) *
                      100
                    }
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#f44336',
                      },
                    }}
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(
                    (data.stakeholders.reduce(
                      (sum, s) => sum + s.tasksByPriority.high + s.tasksByPriority.critical,
                      0
                    ) /
                      data.stakeholders.reduce((sum, s) => sum + s.totalTasks, 0)) *
                      100
                  )}%
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Low & Medium Tasks
              </Typography>
              <Box display="flex" alignItems="center">
                <Box flexGrow={1} mr={2}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (data.stakeholders.reduce(
                        (sum, s) => sum + s.tasksByPriority.low + s.tasksByPriority.medium,
                        0
                      ) /
                        data.stakeholders.reduce((sum, s) => sum + s.totalTasks, 0)) *
                      100
                    }
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#2196f3',
                      },
                    }}
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(
                    (data.stakeholders.reduce(
                      (sum, s) => sum + s.tasksByPriority.low + s.tasksByPriority.medium,
                      0
                    ) /
                      data.stakeholders.reduce((sum, s) => sum + s.totalTasks, 0)) *
                      100
                  )}%
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ResourceSummary;
