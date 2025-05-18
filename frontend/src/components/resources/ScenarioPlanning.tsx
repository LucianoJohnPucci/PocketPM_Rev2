import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Button,
  Slider,
  FormControlLabel,
  Switch,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Check as CheckIcon,
  Compare as CompareIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Timeline as TimelineIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import {
  ProjectScenario,
  ScenarioResource,
  OptimizationConstraint,
  OptimizationResult,
  runOptimization,
  getProjectScenarios
} from '../../utils/mockScenarioService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface ScenarioPlanningProps {}

const ScenarioPlanning: React.FC<ScenarioPlanningProps> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const [scenarios, setScenarios] = useState<ProjectScenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<number>(1); // Default to current allocation
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Optimization constraints
  const [constraints, setConstraints] = useState<OptimizationConstraint>({
    maxBudget: 200000,
    maxDuration: 12,
    prioritizeDeliverySpeed: false,
    prioritizeCostSaving: false,
    maintainTeamBalance: true,
    requiredSkills: []
  });

  // Fetch scenarios on component mount
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setLoading(true);
        const data = await getProjectScenarios();
        setScenarios(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle scenario selection
  const handleScenarioSelect = (scenarioId: number) => {
    setSelectedScenarioId(scenarioId);
  };

  // Handle constraint changes
  const handleConstraintChange = (key: keyof OptimizationConstraint, value: any) => {
    setConstraints(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Run optimization
  const handleRunOptimization = async () => {
    try {
      setOptimizing(true);
      const result = await runOptimization(constraints);
      setOptimizationResult(result);
      setScenarios(result.scenarios);
      setSelectedScenarioId(result.recommendedScenarioId);
      setOptimizing(false);
    } catch (error) {
      console.error('Error running optimization:', error);
      setOptimizing(false);
    }
  };

  // Get selected scenario
  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  // Generate chart data for resource allocation comparison
  const getResourceAllocationChartData = () => {
    if (!selectedScenario) return null;

    return {
      labels: selectedScenario.resources.map(r => r.resourceName),
      datasets: [
        {
          label: 'Allocated Hours',
          data: selectedScenario.resources.map(r => r.allocatedHours),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Utilization Rate (%)',
          data: selectedScenario.resources.map(r => r.utilizationRate),
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    };
  };

  // Generate chart data for scenario comparison
  const getScenarioComparisonChartData = () => {
    return {
      labels: scenarios.map(s => s.name),
      datasets: [
        {
          label: 'Total Cost ($)',
          data: scenarios.map(s => s.totalCost),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Duration (weeks)',
          data: scenarios.map(s => s.duration * 10000), // Scale up for visibility
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    };
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get color based on utilization rate
  const getUtilizationColor = (rate: number): string => {
    if (rate > 90) return '#f44336'; // Overallocated - red
    if (rate > 75) return '#ff9800'; // High utilization - orange
    if (rate > 50) return '#4caf50'; // Good utilization - green
    return '#2196f3'; // Underutilized - blue
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Tabs for different scenario views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Scenario Details" />
          <Tab label="Optimization" />
          <Tab label="Comparison" />
        </Tabs>
      </Paper>

      {/* Scenario Details Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Scenario Selection */}
          <Grid container spacing={2} mb={3}>
            {scenarios.map(scenario => (
              <Grid item xs={12} sm={6} md={3} key={scenario.id}>
                <Card 
                  elevation={selectedScenarioId === scenario.id ? 4 : 1}
                  sx={{
                    borderRadius: 2,
                    cursor: 'pointer',
                    borderLeft: selectedScenarioId === scenario.id ? '4px solid #1976d2' : 'none',
                    bgcolor: selectedScenarioId === scenario.id ? 'rgba(25, 118, 210, 0.04)' : 'inherit',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handleScenarioSelect(scenario.id)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6" component="div">
                        {scenario.name}
                      </Typography>
                      {scenario.isOptimal && (
                        <Tooltip title="Recommended Optimal Scenario">
                          <StarIcon color="primary" />
                        </Tooltip>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {scenario.description}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">Budget:</Typography>
                      <Typography variant="body2" fontWeight="medium">{formatCurrency(scenario.budget)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">Duration:</Typography>
                      <Typography variant="body2" fontWeight="medium">{scenario.duration} weeks</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">Total Cost:</Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        color={scenario.totalCost > scenario.budget ? 'error' : 'inherit'}
                      >
                        {formatCurrency(scenario.totalCost)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Selected Scenario Details */}
          {selectedScenario && (
            <Grid container spacing={3}>
              {/* Resource Allocation Chart */}
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardHeader 
                    title="Resource Allocation" 
                    subheader={`${selectedScenario.name} - Resource hours and utilization`}
                  />
                  <Divider />
                  <CardContent>
                    <Box height={300}>
                      <Bar 
                        data={getResourceAllocationChartData() || {labels: [], datasets: []}} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Allocated Hours'
                              }
                            },
                            y1: {
                              beginAtZero: true,
                              position: 'right',
                              max: 100,
                              title: {
                                display: true,
                                text: 'Utilization Rate (%)'
                              },
                              grid: {
                                drawOnChartArea: false
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Resource Details Table */}
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardHeader 
                    title="Resource Details" 
                    subheader={`${selectedScenario.name} - Cost and allocation details`}
                  />
                  <Divider />
                  <CardContent sx={{ p: 0 }}>
                    <TableContainer component={Paper} elevation={0}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Resource</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Hours</TableCell>
                            <TableCell align="right">Rate</TableCell>
                            <TableCell align="right">Cost</TableCell>
                            <TableCell align="right">Utilization</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedScenario.resources.map((resource) => (
                            <TableRow key={resource.resourceId}>
                              <TableCell>{resource.resourceName}</TableCell>
                              <TableCell>{resource.role}</TableCell>
                              <TableCell align="right">{resource.allocatedHours}</TableCell>
                              <TableCell align="right">${resource.hourlyRate}/hr</TableCell>
                              <TableCell align="right">{formatCurrency(resource.cost)}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={`${resource.utilizationRate}%`}
                                  size="small"
                                  sx={{ 
                                    bgcolor: `${getUtilizationColor(resource.utilizationRate)}20`, 
                                    color: getUtilizationColor(resource.utilizationRate),
                                    fontWeight: 'medium'
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                  <Divider />
                  <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" component="div">
                        Total Cost: {formatCurrency(selectedScenario.totalCost)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Hours: {selectedScenario.totalHours}
                      </Typography>
                    </Box>
                    <Box>
                      <Button 
                        variant="outlined" 
                        startIcon={<SaveIcon />}
                        size="small"
                      >
                        Save Scenario
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      )}

      {/* Optimization Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Optimization Controls */}
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardHeader title="Optimization Constraints" />
              <Divider />
              <CardContent>
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>Maximum Budget</Typography>
                  <Box display="flex" alignItems="center">
                    <Slider
                      value={constraints.maxBudget}
                      min={100000}
                      max={300000}
                      step={10000}
                      onChange={(_, value) => handleConstraintChange('maxBudget', value as number)}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => formatCurrency(value)}
                      sx={{ flexGrow: 1, mr: 2 }}
                    />
                    <Typography variant="body2">{formatCurrency(constraints.maxBudget)}</Typography>
                  </Box>
                </Box>

                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>Maximum Duration (weeks)</Typography>
                  <Box display="flex" alignItems="center">
                    <Slider
                      value={constraints.maxDuration}
                      min={8}
                      max={20}
                      step={1}
                      onChange={(_, value) => handleConstraintChange('maxDuration', value as number)}
                      valueLabelDisplay="auto"
                      sx={{ flexGrow: 1, mr: 2 }}
                    />
                    <Typography variant="body2">{constraints.maxDuration} weeks</Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>Optimization Priorities</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={constraints.prioritizeDeliverySpeed}
                        onChange={(e) => handleConstraintChange('prioritizeDeliverySpeed', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Prioritize Delivery Speed"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={constraints.prioritizeCostSaving}
                        onChange={(e) => handleConstraintChange('prioritizeCostSaving', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Prioritize Cost Saving"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={constraints.maintainTeamBalance}
                        onChange={(e) => handleConstraintChange('maintainTeamBalance', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Maintain Team Balance"
                  />
                </Box>

                <Box mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={optimizing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                    onClick={handleRunOptimization}
                    disabled={optimizing}
                  >
                    {optimizing ? 'Running Optimization...' : 'Run Optimization'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Optimization Results */}
          <Grid item xs={12} md={8}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardHeader 
                title="Optimization Results" 
                action={
                  optimizationResult && (
                    <Chip 
                      icon={<CheckIcon />}
                      label="Optimization Complete"
                      color="success"
                      variant="outlined"
                    />
                  )
                }
              />
              <Divider />
              <CardContent>
                {!optimizationResult ? (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Set your optimization constraints and click "Run Optimization" to generate resource allocation scenarios.
                  </Alert>
                ) : (
                  <Box>
                    <Grid container spacing={2} mb={3}>
                      <Grid item xs={12} sm={4}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Potential Savings
                          </Typography>
                          <Typography variant="h5" color="success.main">
                            {formatCurrency(optimizationResult.potentialSavings)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            vs. current allocation
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Timeline Impact
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h5" color={optimizationResult.timelineReduction > 0 ? 'success.main' : 'text.primary'}>
                              {optimizationResult.timelineReduction > 0 ? '-' : ''}{Math.abs(optimizationResult.timelineReduction)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                              weeks
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {optimizationResult.timelineReduction > 0 ? 'reduction' : 'no change'} in timeline
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Risk Assessment
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <Typography 
                              variant="h5" 
                              color={
                                optimizationResult.riskLevel === 'Low' ? 'success.main' :
                                optimizationResult.riskLevel === 'Medium' ? 'warning.main' : 'error.main'
                              }
                            >
                              {optimizationResult.riskLevel}
                            </Typography>
                            {optimizationResult.riskLevel !== 'Low' && (
                              <WarningIcon 
                                color={optimizationResult.riskLevel === 'Medium' ? 'warning' : 'error'}
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            implementation risk level
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Alert 
                      severity="success" 
                      sx={{ mb: 3 }}
                      action={
                        <Button 
                          color="inherit" 
                          size="small"
                          onClick={() => handleScenarioSelect(optimizationResult.recommendedScenarioId)}
                        >
                          View Details
                        </Button>
                      }
                    >
                      Recommended scenario: <strong>{scenarios.find(s => s.id === optimizationResult.recommendedScenarioId)?.name}</strong>
                    </Alert>

                    <Typography variant="subtitle2" gutterBottom>Optimization Summary</Typography>
                    <Typography variant="body2" paragraph>
                      The optimization algorithm analyzed {scenarios.length} different resource allocation scenarios
                      based on your constraints. The recommended scenario balances cost efficiency and delivery timeline
                      while maintaining appropriate resource utilization levels across the team.
                    </Typography>

                    <Box display="flex" justifyContent="flex-end">
                      <Button 
                        variant="outlined" 
                        color="primary"
                        startIcon={<CompareIcon />}
                        onClick={() => setActiveTab(2)}
                      >
                        Compare Scenarios
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Comparison Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardHeader title="Scenario Comparison" />
              <Divider />
              <CardContent>
                <Box height={300} mb={4}>
                  <Bar 
                    data={getScenarioComparisonChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Total Cost ($)'
                          }
                        },
                        y1: {
                          beginAtZero: true,
                          position: 'right',
                          title: {
                            display: true,
                            text: 'Duration (weeks)'
                          },
                          grid: {
                            drawOnChartArea: false
                          },
                          ticks: {
                            callback: function(value) {
                              return Number(value) / 10000;
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Scenario</TableCell>
                        <TableCell align="right">Duration</TableCell>
                        <TableCell align="right">Total Cost</TableCell>
                        <TableCell align="right">Total Hours</TableCell>
                        <TableCell align="right">Avg. Utilization</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scenarios.map((scenario) => {
                        // Calculate average utilization
                        const avgUtilization = Math.round(
                          scenario.resources.reduce((sum, r) => sum + r.utilizationRate, 0) / scenario.resources.length
                        );
                        
                        return (
                          <TableRow 
                            key={scenario.id}
                            sx={{
                              bgcolor: selectedScenarioId === scenario.id ? 'rgba(25, 118, 210, 0.04)' : 'inherit',
                              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                            }}
                          >
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                {scenario.isOptimal && <StarIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />}
                                <Typography variant="body2" fontWeight={scenario.isOptimal ? 'bold' : 'regular'}>
                                  {scenario.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">{scenario.duration} weeks</TableCell>
                            <TableCell align="right">{formatCurrency(scenario.totalCost)}</TableCell>
                            <TableCell align="right">{scenario.totalHours}</TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={`${avgUtilization}%`}
                                size="small"
                                sx={{ 
                                  bgcolor: `${getUtilizationColor(avgUtilization)}20`, 
                                  color: getUtilizationColor(avgUtilization),
                                  fontWeight: 'medium'
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              {scenario.totalCost > scenario.budget ? (
                                <Chip label="Over Budget" size="small" color="error" variant="outlined" />
                              ) : (
                                <Chip label="Within Budget" size="small" color="success" variant="outlined" />
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => {
                                    handleScenarioSelect(scenario.id);
                                    setActiveTab(0);
                                  }}
                                >
                                  <TimelineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Compare different scenarios to find the optimal resource allocation strategy for your project.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={() => setActiveTab(1)}
                  >
                    Run New Optimization
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ScenarioPlanning;
