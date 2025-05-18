import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Import components and services
import StakeholderDashboard from '../components/resources/StakeholderDashboard';
import ResourceSummary from '../components/resources/ResourceSummary';
import ScenarioPlanning from '../components/resources/ScenarioPlanning';
import ResourceAllocation from '../components/resources/ResourceAllocation';
import { 
  getResourceAllocationData, 
  ResourceAllocationData,
  StakeholderResource 
} from '../utils/mockResourceService';

const Resources: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [resourceData, setResourceData] = useState<ResourceAllocationData | null>(null);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Fetch resource data
  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        setLoading(true);
        
        // Fetch resource allocation data from the mock service
        const data = await getResourceAllocationData();
        setResourceData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load resource data');
        setLoading(false);
      }
    };
    
    fetchResourceData();
  }, []);

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Resource Management</Typography>
      
      {/* Tabs for different resource views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Stakeholder Dashboard" />
          <Tab label="Resource Allocation" />
          <Tab label="Scenario Planning" />
        </Tabs>
      </Paper>
      
      {/* Resource Summary */}
      {resourceData && <ResourceSummary data={resourceData} />}
      
      {/* Tab content */}
      {activeTab === 0 && resourceData && (
        <Box>
          <Typography variant="h5" gutterBottom>Stakeholder Task Distribution</Typography>
          <Typography variant="body1" paragraph>
            This dashboard shows task distribution by quantity and priority for each stakeholder.
            Use this view to identify overallocated and underallocated team members.
          </Typography>
          
          {/* Stakeholder Dashboard Component */}
          <StakeholderDashboard stakeholders={resourceData.stakeholders} />
        </Box>
      )}
      
      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>Resource Allocation</Typography>
          <Typography variant="body1" paragraph>
            This section provides tools to reallocate tasks between stakeholders to optimize workload distribution.
            Drag and drop tasks between stakeholders to balance workloads.
          </Typography>
          
          {/* Resource Allocation Component */}
          <ResourceAllocation />
        </Box>
      )}
      
      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>Scenario Planning</Typography>
          <Typography variant="body1" paragraph>
            This section enables scenario planning to optimize resource allocation against budget constraints.
            Use the tools below to create and compare different resource allocation scenarios.
          </Typography>
          
          {/* Scenario Planning Component */}
          <ScenarioPlanning />
        </Box>
      )}
    </Box>
  );
};

export default Resources;
