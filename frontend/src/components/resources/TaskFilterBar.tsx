import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Typography,
  Collapse,
  Divider,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  Snackbar,
  Alert,
  ListItemButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon,
  Label as LabelIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  RestoreFromTrash as ResetIcon,
  Tune as TuneIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';

export interface FilterPreset {
  id: string;
  name: string;
  filters: TaskFilters;
  isDefault?: boolean;
}

export interface TaskFilters {
  search: string;
  priority: string[];
  status: string[];
  dueDate: string;
  sortBy: string;
  tags: string[];
  assignees: number[] | null;
  estimatedHoursMin: number | null;
  estimatedHoursMax: number | null;
  completionMin: number | null;
  completionMax: number | null;
  showCompletedTasks: boolean;
  savedFilterName?: string;
}

interface TaskFilterBarProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
  onClearFilters: () => void;
  onSavePreset?: (preset: Omit<FilterPreset, 'id'>) => void;
  onLoadPreset?: (preset: FilterPreset) => void;
}

const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  onSavePreset,
  onLoadPreset
}) => {
  // UI state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [presetMenuAnchorEl, setPresetMenuAnchorEl] = useState<HTMLElement | null>(null);
  
  // Filter preset state
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<FilterPreset | null>(null);
  const [savePresetDialogOpen, setSavePresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [isDefaultPreset, setIsDefaultPreset] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  
  // Available tags for filtering
  const [availableTags, setAvailableTags] = useState<string[]>([
    'design', 'ui', 'dashboard', 'backend', 'auth', 'security', 'documentation',
    'api', 'frontend', 'charts', 'components', 'testing', 'quality', 'database',
    'performance', 'optimization', 'onboarding', 'user-experience', 'notifications',
    'real-time', 'usability', 'project', 'export', 'reports', 'devops', 'ci-cd',
    'automation', 'analytics', 'data', 'tracking', 'admin', 'user-management',
    'access-control', 'i18n', 'localization', 'languages'
  ]);
  
  // Load filter presets on component mount
  useEffect(() => {
    const loadPresets = async () => {
      try {
        // Import dynamically to avoid circular dependencies
        const { getFilterPresets, getDefaultPreset } = await import('../../utils/mockFilterPresetService');
        const presetList = await getFilterPresets();
        setPresets(presetList);
        
        // Load default preset if available
        const defaultPreset = await getDefaultPreset();
        if (defaultPreset && onLoadPreset) {
          setSelectedPreset(defaultPreset);
        }
      } catch (error) {
        console.error('Error loading filter presets:', error);
        setSnackbarMessage('Failed to load filter presets');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
    
    loadPresets();
  }, [onLoadPreset]);
  
  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Open tags popover
  const handleTagsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close tags popover
  const handleTagsClose = () => {
    setAnchorEl(null);
  };
  
  // Open presets menu
  const handlePresetsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPresetMenuAnchorEl(event.currentTarget);
  };
  
  // Close presets menu
  const handlePresetsMenuClose = () => {
    setPresetMenuAnchorEl(null);
  };
  
  // Open save preset dialog
  const handleSavePresetClick = () => {
    setPresetName(filters.savedFilterName || '');
    setIsDefaultPreset(false);
    setSavePresetDialogOpen(true);
    handlePresetsMenuClose();
  };
  
  // Close save preset dialog
  const handleSavePresetDialogClose = () => {
    setSavePresetDialogOpen(false);
  };
  
  // Save preset
  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      setSnackbarMessage('Please enter a name for the preset');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    try {
      const newPreset: Omit<FilterPreset, 'id'> = {
        name: presetName,
        filters: {
          ...filters,
          savedFilterName: presetName
        },
        isDefault: isDefaultPreset
      };
      
      if (onSavePreset) {
        onSavePreset(newPreset);
      } else {
        // If no external handler, use the mock service directly
        const { saveFilterPreset } = await import('../../utils/mockFilterPresetService');
        const savedPreset = await saveFilterPreset(newPreset);
        
        // Update local state
        setPresets([...presets, savedPreset]);
        if (isDefaultPreset) {
          setSelectedPreset(savedPreset);
        }
      }
      
      setSnackbarMessage(`Filter preset '${presetName}' saved successfully`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSavePresetDialogOpen(false);
    } catch (error) {
      console.error('Error saving filter preset:', error);
      setSnackbarMessage('Failed to save filter preset');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Load preset
  const handleLoadPreset = (preset: FilterPreset) => {
    if (onLoadPreset) {
      onLoadPreset(preset);
    } else {
      // If no external handler, update filters directly
      onFilterChange(preset.filters);
    }
    
    setSelectedPreset(preset);
    handlePresetsMenuClose();
  };
  
  // Delete preset
  const handleDeletePreset = async (preset: FilterPreset) => {
    try {
      const { deleteFilterPreset } = await import('../../utils/mockFilterPresetService');
      await deleteFilterPreset(preset.id);
      
      // Update local state
      const updatedPresets = presets.filter(p => p.id !== preset.id);
      setPresets(updatedPresets);
      
      // If the deleted preset was selected, clear selection
      if (selectedPreset && selectedPreset.id === preset.id) {
        setSelectedPreset(null);
      }
      
      setSnackbarMessage(`Filter preset '${preset.name}' deleted`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting filter preset:', error);
      setSnackbarMessage('Failed to delete filter preset');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Set default preset
  const handleSetDefaultPreset = async (preset: FilterPreset) => {
    try {
      const { setDefaultPreset } = await import('../../utils/mockFilterPresetService');
      await setDefaultPreset(preset.id);
      
      // Update local state
      const updatedPresets = presets.map(p => ({
        ...p,
        isDefault: p.id === preset.id
      }));
      setPresets(updatedPresets);
      
      setSnackbarMessage(`'${preset.name}' set as default preset`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error setting default preset:', error);
      setSnackbarMessage('Failed to set default preset');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: event.target.value
    });
  };

  // Handle priority filter change
  const handlePriorityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFilterChange({
      ...filters,
      priority: typeof value === 'string' ? value.split(',') : value
    });
  };

  // Handle status filter change
  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFilterChange({
      ...filters,
      status: typeof value === 'string' ? value.split(',') : value
    });
  };

  // Handle due date filter change
  const handleDueDateChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      dueDate: event.target.value as string
    });
  };

  // Handle sort by change
  const handleSortByChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      sortBy: event.target.value as string
    });
  };

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFilterChange({
      ...filters,
      tags: newTags
    });
  };

  // Handle show completed tasks toggle
  const handleShowCompletedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      showCompletedTasks: event.target.checked
    });
  };

  // Clear search
  const handleClearSearch = () => {
    onFilterChange({
      ...filters,
      search: ''
    });
  };
  
  // Get active filter count
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.search) count++;
    if (filters.priority.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.dueDate) count++;
    if (filters.tags.length > 0) count++;
    if (filters.assignees && filters.assignees.length > 0) count++;
    if (filters.estimatedHoursMin !== null || filters.estimatedHoursMax !== null) count++;
    if (filters.completionMin !== null || filters.completionMax !== null) count++;
    if (!filters.showCompletedTasks) count++;
    return count;
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'tags-popover' : undefined;
  const activeFilterCount = getActiveFilterCount();

  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: showAdvancedFilters ? 1 : 2,
          borderRadius: 2,
          borderBottomLeftRadius: showAdvancedFilters ? 0 : 2,
          borderBottomRightRadius: showAdvancedFilters ? 0 : 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            mb: showAdvancedFilters ? 2 : 0
          }}
        >
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: filters.search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    edge="end"
                    aria-label="clear search"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />

          {/* Priority Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              multiple
              value={filters.priority}
              onChange={handlePriorityChange}
              label="Priority"
              startAdornment={
                <InputAdornment position="start">
                  <FlagIcon fontSize="small" sx={{ color: filters.priority.length ? 'primary.main' : 'inherit' }} />
                </InputAdornment>
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              multiple
              value={filters.status}
              onChange={handleStatusChange}
              label="Status"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip 
                      key={value} 
                      label={value.replace('_', ' ')} 
                      size="small" 
                    />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="not_started">Not Started</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>

          {/* Due Date Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="due-date-filter-label">Due Date</InputLabel>
            <Select
              labelId="due-date-filter-label"
              value={filters.dueDate}
              onChange={handleDueDateChange}
              label="Due Date"
              startAdornment={
                <InputAdornment position="start">
                  <AccessTimeIcon fontSize="small" sx={{ color: filters.dueDate ? 'primary.main' : 'inherit' }} />
                </InputAdornment>
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
              <MenuItem value="today">Due Today</MenuItem>
              <MenuItem value="this_week">Due This Week</MenuItem>
              <MenuItem value="next_week">Due Next Week</MenuItem>
              <MenuItem value="this_month">Due This Month</MenuItem>
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={filters.sortBy}
              onChange={handleSortByChange}
              label="Sort By"
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="due_date_asc">Due Date (Earliest)</MenuItem>
              <MenuItem value="due_date_desc">Due Date (Latest)</MenuItem>
              <MenuItem value="priority_desc">Priority (Highest)</MenuItem>
              <MenuItem value="priority_asc">Priority (Lowest)</MenuItem>
              <MenuItem value="estimated_hours_desc">Hours (Highest)</MenuItem>
              <MenuItem value="estimated_hours_asc">Hours (Lowest)</MenuItem>
              <MenuItem value="completion_desc">Completion % (Highest)</MenuItem>
              <MenuItem value="completion_asc">Completion % (Lowest)</MenuItem>
            </Select>
          </FormControl>

          {/* Filter Presets Button */}
          <Tooltip title="Filter presets">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handlePresetsMenuOpen}
              startIcon={selectedPreset ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              sx={{ ml: 'auto' }}
            >
              {selectedPreset ? selectedPreset.name : 'Presets'}
            </Button>
          </Tooltip>
          
          {/* Advanced Filters Toggle */}
          <Tooltip title="Advanced filters">
            <Badge
              badgeContent={activeFilterCount > 0 ? activeFilterCount : 0}
              color="primary"
            >
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={toggleAdvancedFilters}
                endIcon={showAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                startIcon={<TuneIcon />}
              >
                Advanced
              </Button>
            </Badge>
          </Tooltip>

          {/* Clear Filters */}
          <Tooltip title="Clear all filters">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<FilterListIcon />}
              onClick={onClearFilters}
              disabled={activeFilterCount === 0}
            >
              Clear
            </Button>
          </Tooltip>
        </Box>

        {/* Advanced Filters Section */}
        <Collapse in={showAdvancedFilters}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
            {/* Tags Filter */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 300 }}>
                {filters.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onDelete={() => handleTagToggle(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<LabelIcon />}
                  onClick={handleTagsClick}
                  sx={{ mt: filters.tags.length > 0 ? 0.5 : 0 }}
                >
                  Add Tags
                </Button>
              </Box>
            </Box>

            {/* Show Completed Tasks */}
            <Box sx={{ ml: 'auto' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.showCompletedTasks}
                    onChange={handleShowCompletedChange}
                    color="primary"
                  />
                }
                label="Show completed tasks"
              />
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Tags Popover */}
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleTagsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300, maxHeight: 300, overflow: 'auto' }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Tags
          </Typography>
          <List dense>
            {availableTags.map(tag => (
              <ListItem key={tag} dense button onClick={() => handleTagToggle(tag)}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Checkbox
                    edge="start"
                    checked={filters.tags.includes(tag)}
                    tabIndex={-1}
                    disableRipple
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText primary={tag} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
      
      {/* Filter Presets Menu */}
      <Menu
        anchorEl={presetMenuAnchorEl}
        open={Boolean(presetMenuAnchorEl)}
        onClose={handlePresetsMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 250, maxHeight: 400, overflow: 'auto' }}>
          <MenuItem onClick={handleSavePresetClick}>
            <ListItemIcon>
              <SaveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Save current filters" />
          </MenuItem>
          
          {presets.length > 0 && <Divider sx={{ my: 1 }} />}
          
          {presets.map(preset => (
            <MenuItem key={preset.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemButton
                onClick={() => handleLoadPreset(preset)}
                dense
                sx={{ flexGrow: 1, py: 0 }}
              >
                <ListItemIcon>
                  {preset.isDefault ? (
                    <StarIcon fontSize="small" color="primary" />
                  ) : (
                    <BookmarkIcon fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText primary={preset.name} />
              </ListItemButton>
              
              <Box sx={{ display: 'flex' }}>
                {!preset.isDefault && (
                  <IconButton
                    size="small"
                    onClick={() => handleSetDefaultPreset(preset)}
                    title="Set as default"
                  >
                    <StarBorderIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={() => handleDeletePreset(preset)}
                  title="Delete preset"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </MenuItem>
          ))}
        </Box>
      </Menu>
      
      {/* Save Preset Dialog */}
      <Dialog open={savePresetDialogOpen} onClose={handleSavePresetDialogClose}>
        <DialogTitle>Save Filter Preset</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Preset Name"
            type="text"
            fullWidth
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isDefaultPreset}
                onChange={(e) => setIsDefaultPreset(e.target.checked)}
              />
            }
            label="Set as default preset"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSavePresetDialogClose}>Cancel</Button>
          <Button onClick={handleSavePreset} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskFilterBar;
