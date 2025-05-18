import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Warning as WarningIcon,
  NotificationsActive as NotificationsActiveIcon,
  ArrowUpward as ArrowUpwardIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { EscalationResult, EscalationLevel, EscalationAction } from '../../utils/escalationService';

interface EscalationPanelProps {
  escalations: EscalationResult[];
}

const EscalationPanel: React.FC<EscalationPanelProps> = ({ escalations }) => {
  const [selectedEscalation, setSelectedEscalation] = React.useState<EscalationResult | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleEscalationClick = (escalation: EscalationResult) => {
    setSelectedEscalation(escalation);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const getEscalationLevelColor = (level: EscalationLevel): string => {
    switch (level) {
      case EscalationLevel.CRITICAL:
        return '#d32f2f'; // red
      case EscalationLevel.HIGH:
        return '#f57c00'; // orange
      case EscalationLevel.MEDIUM:
        return '#fbc02d'; // amber
      case EscalationLevel.LOW:
        return '#0288d1'; // blue
      default:
        return '#757575'; // grey
    }
  };

  const getEscalationIcon = (level: EscalationLevel) => {
    switch (level) {
      case EscalationLevel.CRITICAL:
        return <NotificationsActiveIcon color="error" />;
      case EscalationLevel.HIGH:
        return <WarningIcon sx={{ color: '#f57c00' }} />;
      case EscalationLevel.MEDIUM:
        return <WarningIcon sx={{ color: '#fbc02d' }} />;
      case EscalationLevel.LOW:
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon color="disabled" />;
    }
  };

  const getActionIcon = (action: EscalationAction) => {
    switch (action) {
      case EscalationAction.NOTIFY_ASSIGNEE:
        return <PersonIcon fontSize="small" />;
      case EscalationAction.NOTIFY_MANAGER:
        return <PersonIcon fontSize="small" />;
      case EscalationAction.NOTIFY_STAKEHOLDERS:
        return <GroupIcon fontSize="small" />;
      case EscalationAction.ESCALATE_TO_EXECUTIVE:
        return <BusinessIcon fontSize="small" />;
      case EscalationAction.EMERGENCY_MEETING:
        return <NotificationsActiveIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getActionLabel = (action: EscalationAction): string => {
    switch (action) {
      case EscalationAction.NOTIFY_ASSIGNEE:
        return 'Notify Assignee';
      case EscalationAction.NOTIFY_MANAGER:
        return 'Notify Manager';
      case EscalationAction.NOTIFY_STAKEHOLDERS:
        return 'Notify Stakeholders';
      case EscalationAction.ESCALATE_TO_EXECUTIVE:
        return 'Escalate to Executive';
      case EscalationAction.EMERGENCY_MEETING:
        return 'Call Emergency Meeting';
      default:
        return action;
    }
  };

  if (escalations.length === 0) {
    return null;
  }

  return (
    <>
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          <Typography variant="h6">Escalation Protocols</Typography>
        </Box>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          {escalations.length} task{escalations.length !== 1 ? 's' : ''} requiring attention due to approaching deadlines without sufficient progress.
        </Alert>
        
        <List>
          {escalations.map((escalation, index) => (
            <React.Fragment key={escalation.task.id}>
              <ListItem 
                alignItems="flex-start"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } 
                }}
                onClick={() => handleEscalationClick(escalation)}
              >
                <Box display="flex" width="100%" alignItems="center">
                  <Box mr={2}>
                    {getEscalationIcon(escalation.level)}
                  </Box>
                  <Box flexGrow={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight="medium">
                        {escalation.task.title}
                      </Typography>
                      <Chip 
                        label={escalation.level.toUpperCase()} 
                        size="small"
                        sx={{ 
                          backgroundColor: getEscalationLevelColor(escalation.level),
                          color: 'white',
                          fontWeight: 'bold'
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Due in {escalation.daysUntilDue <= 0 ? 'TODAY' : `${escalation.daysUntilDue} days`} u2022 
                      {escalation.task.completion_percentage}% complete
                    </Typography>
                  </Box>
                  <Box ml={2}>
                    <Tooltip title="View Escalation Details">
                      <IconButton size="small" color="primary">
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </ListItem>
              {index < escalations.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Escalation Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedEscalation && (
          <>
            <DialogTitle sx={{ 
              backgroundColor: getEscalationLevelColor(selectedEscalation.level),
              color: 'white',
              display: 'flex',
              alignItems: 'center'
            }}>
              {getEscalationIcon(selectedEscalation.level)}
              <Box ml={1}>
                {selectedEscalation.level.toUpperCase()} ESCALATION
              </Box>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <DialogContentText component="div">
                <Typography variant="h6" gutterBottom>
                  {selectedEscalation.task.title}
                </Typography>
                
                <Alert severity="warning" sx={{ mb: 3 }}>
                  {selectedEscalation.message}
                </Alert>
                
                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Task Details
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <Chip label={`Due: ${new Date(selectedEscalation.task.due_date).toLocaleDateString()}`} />
                    <Chip label={`Progress: ${selectedEscalation.task.completion_percentage}%`} />
                    <Chip 
                      label={`Status: ${selectedEscalation.task.status.replace('_', ' ').toUpperCase()}`} 
                      color={selectedEscalation.task.status === 'in_progress' ? 'primary' : 'default'}
                    />
                    <Chip 
                      label={`Priority: ${selectedEscalation.task.priority.toUpperCase()}`} 
                      color={selectedEscalation.task.priority === 'high' || selectedEscalation.task.priority === 'critical' ? 'error' : 'default'}
                    />
                  </Box>
                </Box>
                
                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Escalation Path
                  </Typography>
                  <Stepper activeStep={-1} orientation="vertical">
                    {selectedEscalation.escalationPath.map((step, index) => (
                      <Step key={index} active>
                        <StepLabel>{step}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Recommended Actions
                  </Typography>
                  <List>
                    {selectedEscalation.actions.map((action, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={
                            <Box display="flex" alignItems="center">
                              {getActionIcon(action)}
                              <Box ml={1}>{getActionLabel(action)}</Box>
                            </Box>
                          } 
                        />
                        <Button variant="outlined" size="small">
                          Execute
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" color="primary">
                Acknowledge & Take Action
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default EscalationPanel;
