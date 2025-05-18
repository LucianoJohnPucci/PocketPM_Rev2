import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { StakeholderResource } from '../../utils/mockResourceService';

interface WorkloadImpactPanelProps {
  stakeholders: StakeholderResource[];
  impactData: {
    currentAssigneeImpact: { id: number; newUtilizationRate: number }[];
    newAssigneeImpact: { id: number; newUtilizationRate: number } | null;
  } | null;
}

const WorkloadImpactPanel: React.FC<WorkloadImpactPanelProps> = ({ stakeholders, impactData }) => {
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

  // Get trend icon based on current and new utilization
  const getTrendIcon = (currentRate: number, newRate: number) => {
    const diff = newRate - currentRate;
    if (diff > 5) return <TrendingUpIcon fontSize="small" color="error" />;
    if (diff < -5) return <TrendingDownIcon fontSize="small" color="success" />;
    return <TrendingFlatIcon fontSize="small" color="action" />;
  };

  // Find stakeholder by id
  const findStakeholder = (id: number) => {
    return stakeholders.find(s => s.id === id);
  };

  // Check if any stakeholder would be overallocated
  const hasOverallocationRisk = () => {
    if (!impactData) return false;
    
    // Check new assignee
    if (impactData.newAssigneeImpact && impactData.newAssigneeImpact.newUtilizationRate > 90) {
      return true;
    }
    
    // Check current assignees
    return impactData.currentAssigneeImpact.some(impact => impact.newUtilizationRate > 90);
  };

  if (!impactData) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Workload Impact
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Select tasks to see workload impact
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        Workload Impact
      </Typography>

      {hasOverallocationRisk() && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          This reassignment may cause overallocation for some team members.
        </Alert>
      )}

      {/* Impact on current assignees */}
      {impactData.currentAssigneeImpact.length > 0 && (
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Current Assignees
          </Typography>
          <List dense disablePadding>
            {impactData.currentAssigneeImpact.map(impact => {
              const stakeholder = findStakeholder(impact.id);
              if (!stakeholder) return null;

              const currentRate = stakeholder.utilizationRate;
              const newRate = impact.newUtilizationRate;
              const diff = newRate - currentRate;

              return (
                <ListItem key={impact.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: getUtilizationColor(newRate),
                        fontSize: '0.875rem'
                      }}
                    >
                      {stakeholder.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {stakeholder.name}
                        </Typography>
                        {getTrendIcon(currentRate, newRate)}
                        <Typography
                          variant="caption"
                          color={diff > 0 ? 'error.main' : diff < 0 ? 'success.main' : 'text.secondary'}
                          sx={{ ml: 0.5 }}
                        >
                          {diff > 0 ? '+' : ''}{diff}%
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Box display="flex" alignItems="center">
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                              Before:
                            </Typography>
                            <Chip
                              label={`${currentRate}%`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: `${getUtilizationColor(currentRate)}20`,
                                color: getUtilizationColor(currentRate),
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          </Box>
                          <Box display="flex" alignItems="center">
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                              After:
                            </Typography>
                            <Chip
                              label={`${newRate}%`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: `${getUtilizationColor(newRate)}20`,
                                color: getUtilizationColor(newRate),
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={newRate}
                          sx={{
                            height: 6,
                            borderRadius: 1,
                            bgcolor: 'rgba(0,0,0,0.05)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getUtilizationColor(newRate)
                            }
                          }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}

      {/* Impact on new assignee */}
      {impactData.newAssigneeImpact && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            New Assignee
          </Typography>
          <List dense disablePadding>
            {(() => {
              const impact = impactData.newAssigneeImpact;
              const stakeholder = findStakeholder(impact.id);
              if (!stakeholder) return null;

              const currentRate = stakeholder.utilizationRate;
              const newRate = impact.newUtilizationRate;
              const diff = newRate - currentRate;

              return (
                <ListItem disablePadding>
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: getUtilizationColor(newRate),
                        fontSize: '0.875rem'
                      }}
                    >
                      {stakeholder.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {stakeholder.name}
                        </Typography>
                        {getTrendIcon(currentRate, newRate)}
                        <Typography
                          variant="caption"
                          color={diff > 0 ? 'error.main' : diff < 0 ? 'success.main' : 'text.secondary'}
                          sx={{ ml: 0.5 }}
                        >
                          {diff > 0 ? '+' : ''}{diff}%
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Box display="flex" alignItems="center">
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                              Before:
                            </Typography>
                            <Chip
                              label={`${currentRate}%`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: `${getUtilizationColor(currentRate)}20`,
                                color: getUtilizationColor(currentRate),
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          </Box>
                          <Box display="flex" alignItems="center">
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                              After:
                            </Typography>
                            <Chip
                              label={`${newRate}%`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: `${getUtilizationColor(newRate)}20`,
                                color: getUtilizationColor(newRate),
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={newRate}
                          sx={{
                            height: 6,
                            borderRadius: 1,
                            bgcolor: 'rgba(0,0,0,0.05)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getUtilizationColor(newRate)
                            }
                          }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              );
            })()}
          </List>
        </Box>
      )}

      {/* Summary */}
      <Box mt="auto" pt={2}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          This shows the projected impact of task reassignment on team member workloads.
        </Typography>
      </Box>
    </Paper>
  );
};

export default WorkloadImpactPanel;
