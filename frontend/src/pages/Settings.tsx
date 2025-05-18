import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  MenuItem,
  Menu
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  SmartToy as AIIcon,
  Language as LanguageIcon,
  Help as HelpIcon,
  ExitToApp as LogOutIcon,
  ChevronRight as ChevronRightIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  
  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [aiRecommendationsEnabled, setAiRecommendationsEnabled] = useState<boolean>(true);
  
  // State for language menu
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English (US)');
  
  // State for logout confirmation dialog
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);
  
  // Handle toggle changes
  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };
  
  const handleAIRecommendationsToggle = () => {
    setAiRecommendationsEnabled(!aiRecommendationsEnabled);
  };
  
  // Handle language menu
  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchorEl(event.currentTarget);
  };
  
  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null);
  };
  
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    handleLanguageMenuClose();
  };
  
  // Handle logout
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };
  
  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();
    navigate('/login');
  };
  
  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };
  
  // Handle help & support
  const handleHelpClick = () => {
    navigate('/help');
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      {/* Preferences Section */}
      <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ pb: 0 }}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>
            PREFERENCES
          </Typography>
          
          <List disablePadding>
            {/* Notifications */}
            <ListItem>
              <ListItemIcon>
                <Box sx={{ bgcolor: '#e3f2fd', borderRadius: '50%', p: 1, display: 'flex' }}>
                  <NotificationsIcon sx={{ color: '#2196f3' }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Notifications" 
                secondary="Enable push notifications"
              />
              <ListItemSecondaryAction>
                <Switch 
                  edge="end"
                  checked={notificationsEnabled}
                  onChange={handleNotificationsToggle}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            {/* Dark Mode */}
            <ListItem>
              <ListItemIcon>
                <Box sx={{ bgcolor: '#f3e5f5', borderRadius: '50%', p: 1, display: 'flex' }}>
                  <DarkModeIcon sx={{ color: '#9c27b0' }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Dark Mode" 
                secondary="Switch to dark theme"
              />
              <ListItemSecondaryAction>
                <Switch 
                  edge="end"
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            {/* AI Recommendations */}
            <ListItem>
              <ListItemIcon>
                <Box sx={{ bgcolor: '#e8f5e9', borderRadius: '50%', p: 1, display: 'flex' }}>
                  <AIIcon sx={{ color: '#4caf50' }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="AI Recommendations" 
                secondary="Get smart suggestions"
              />
              <ListItemSecondaryAction>
                <Switch 
                  edge="end"
                  checked={aiRecommendationsEnabled}
                  onChange={handleAIRecommendationsToggle}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            {/* Language */}
            <ListItem button onClick={handleLanguageMenuOpen}>
              <ListItemIcon>
                <Box sx={{ bgcolor: '#e3f2fd', borderRadius: '50%', p: 1, display: 'flex' }}>
                  <LanguageIcon sx={{ color: '#2196f3' }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Language" 
                secondary={selectedLanguage}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={handleLanguageMenuOpen}>
                  <ChevronRightIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      {/* Support Section */}
      <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ pb: 0 }}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>
            SUPPORT
          </Typography>
          
          <List disablePadding>
            {/* Help & Support */}
            <ListItem button onClick={handleHelpClick}>
              <ListItemIcon>
                <Box sx={{ bgcolor: '#e8f5e9', borderRadius: '50%', p: 1, display: 'flex' }}>
                  <HelpIcon sx={{ color: '#4caf50' }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Help & Support" 
                secondary="FAQs and contact support"
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={handleHelpClick}>
                  <ChevronRightIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            {/* Log Out */}
            <ListItem button onClick={handleLogoutClick}>
              <ListItemIcon>
                <Box sx={{ bgcolor: '#ffebee', borderRadius: '50%', p: 1, display: 'flex' }}>
                  <LogOutIcon sx={{ color: '#f44336' }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Log Out" 
                secondary="Sign out of your account"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      {/* Language Menu */}
      <Menu
        anchorEl={languageMenuAnchorEl}
        open={Boolean(languageMenuAnchorEl)}
        onClose={handleLanguageMenuClose}
      >
        <MenuItem onClick={() => handleLanguageSelect('English (US)')} selected={selectedLanguage === 'English (US)'}>
          English (US)
        </MenuItem>
        <MenuItem onClick={() => handleLanguageSelect('Spanish')} selected={selectedLanguage === 'Spanish'}>
          Spanish
        </MenuItem>
        <MenuItem onClick={() => handleLanguageSelect('French')} selected={selectedLanguage === 'French'}>
          French
        </MenuItem>
        <MenuItem onClick={() => handleLanguageSelect('German')} selected={selectedLanguage === 'German'}>
          German
        </MenuItem>
        <MenuItem onClick={() => handleLanguageSelect('Japanese')} selected={selectedLanguage === 'Japanese'}>
          Japanese
        </MenuItem>
      </Menu>
      
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out of your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="error">
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
