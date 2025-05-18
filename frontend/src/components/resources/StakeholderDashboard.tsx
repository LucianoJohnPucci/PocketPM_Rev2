import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  LinearProgress,
  Chip,
  Avatar,
  Badge,
  Tooltip
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend);

// Define interfaces
interface StakeholderResource {
  id: number;
  name: string;
  role: string;
  email: string;
  totalTasks: number;
  completedTasks: number;
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  utilizationRate: number; // Percentage of capacity utilized
  availableHours: number;
  allocatedHours: number;
}

interface StakeholderDashboardProps {
  stakeholders: StakeholderResource[];
}

const StakeholderDashboard: React.FC<StakeholderDashboardProps> = ({ stakeholders }) => {
  // Generate task quantity chart data for a stakeholder
  const getTaskQuantityChartData = (stakeholder: StakeholderResource) => {
    return {
      labels: ['Completed', 'In Progress'],
      datasets: [
        {
          data: [stakeholder.completedTasks, stakeholder.totalTasks - stakeholder.completedTasks],
          backgroundColor: ['#4caf50', '#2196f3'],
          borderWidth: 1,
        },
      ],
    };
  };

  // Generate task priority chart data for a stakeholder
  const getTaskPriorityChartData = (stakeholder: StakeholderResource) => {
    return {
      labels: ['Low', 'Medium', 'High', 'Critical'],
      datasets: [
        {
          data: [
            stakeholder.tasksByPriority.low,
            stakeholder.tasksByPriority.medium,
            stakeholder.tasksByPriority.high,
            stakeholder.tasksByPriority.critical,
          ],
          backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336'],
          borderWidth: 1,
        },
      ],
    };
  };

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

  return (
    <Grid container spacing={3}>
      {stakeholders.map((stakeholder) => (
        <Grid item xs={12} md={6} lg={4} key={stakeholder.id}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardHeader
              title={
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: getUtilizationColor(stakeholder.utilizationRate), mr: 1 }}>
                    {stakeholder.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" noWrap>
                    {stakeholder.name}
                  </Typography>
                </Box>
              }
              subheader={
                <Box display="flex" alignItems="center" mt={0.5}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {stakeholder.role}
                  </Typography>
                  <Chip 
                    label={`${getUtilizationStatus(stakeholder.utilizationRate)}`}
                    size="small"
                    sx={{ 
                      bgcolor: `${getUtilizationColor(stakeholder.utilizationRate)}20`, 
                      color: getUtilizationColor(stakeholder.utilizationRate),
                      fontWeight: 'medium',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Resource Utilization
                </Typography>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Box flexGrow={1} mr={2}>
                    <LinearProgress
                      variant="determinate"
                      value={stakeholder.utilizationRate}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getUtilizationColor(stakeholder.utilizationRate),
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {stakeholder.utilizationRate}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {stakeholder.allocatedHours} of {stakeholder.availableHours} hours allocated
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                    Task Completion
                  </Typography>
                  <Box height={120}>
                    <Pie 
                      data={getTaskQuantityChartData(stakeholder)} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              boxWidth: 10,
                              font: {
                                size: 10
                              }
                            }
                          }
                        }
                      }} 
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" align="center" display="block">
                    {stakeholder.completedTasks} of {stakeholder.totalTasks} tasks completed
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                    Task Priority
                  </Typography>
                  <Box height={120}>
                    <Pie 
                      data={getTaskPriorityChartData(stakeholder)} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              boxWidth: 10,
                              font: {
                                size: 10
                              }
                            }
                          }
                        }
                      }} 
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" align="center" display="block">
                    {stakeholder.tasksByPriority.high + stakeholder.tasksByPriority.critical} high priority tasks
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StakeholderDashboard;
