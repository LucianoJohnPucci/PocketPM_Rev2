// Mock service for managing filter presets
import { FilterPreset, TaskFilters } from '../components/resources/TaskFilterBar';
import { v4 as uuidv4 } from 'uuid';

// Local storage key for filter presets
const FILTER_PRESETS_STORAGE_KEY = 'foresightpm_filter_presets';
const DEFAULT_PRESET_STORAGE_KEY = 'foresightpm_default_filter_preset';

// Default presets
const defaultPresets: FilterPreset[] = [
  {
    id: 'high-priority-tasks',
    name: 'High Priority Tasks',
    filters: {
      search: '',
      priority: ['critical', 'high'],
      status: [],
      dueDate: '',
      sortBy: 'priority_desc',
      tags: [],
      assignees: null,
      estimatedHoursMin: null,
      estimatedHoursMax: null,
      completionMin: null,
      completionMax: null,
      showCompletedTasks: false,
      savedFilterName: 'High Priority Tasks'
    },
    isDefault: false
  },
  {
    id: 'overdue-tasks',
    name: 'Overdue Tasks',
    filters: {
      search: '',
      priority: [],
      status: ['not_started', 'in_progress', 'blocked'],
      dueDate: 'overdue',
      sortBy: 'due_date_asc',
      tags: [],
      assignees: null,
      estimatedHoursMin: null,
      estimatedHoursMax: null,
      completionMin: null,
      completionMax: null,
      showCompletedTasks: false,
      savedFilterName: 'Overdue Tasks'
    },
    isDefault: false
  },
  {
    id: 'this-week-tasks',
    name: 'This Week Tasks',
    filters: {
      search: '',
      priority: [],
      status: [],
      dueDate: 'this_week',
      sortBy: 'due_date_asc',
      tags: [],
      assignees: null,
      estimatedHoursMin: null,
      estimatedHoursMax: null,
      completionMin: null,
      completionMax: null,
      showCompletedTasks: true,
      savedFilterName: 'This Week Tasks'
    },
    isDefault: false
  }
];

// Initialize presets in localStorage if they don't exist
const initializePresets = (): void => {
  const existingPresets = localStorage.getItem(FILTER_PRESETS_STORAGE_KEY);
  if (!existingPresets) {
    localStorage.setItem(FILTER_PRESETS_STORAGE_KEY, JSON.stringify(defaultPresets));
  }
};

// Get all filter presets
export const getFilterPresets = async (): Promise<FilterPreset[]> => {
  // Initialize if needed
  initializePresets();
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const presetsJson = localStorage.getItem(FILTER_PRESETS_STORAGE_KEY);
      const presets = presetsJson ? JSON.parse(presetsJson) : defaultPresets;
      resolve(presets);
    }, 300);
  });
};

// Save a new filter preset
export const saveFilterPreset = async (preset: Omit<FilterPreset, 'id'>): Promise<FilterPreset> => {
  // Generate ID if not provided
  const newPreset: FilterPreset = {
    ...preset,
    id: uuidv4()
  };
  
  return new Promise((resolve) => {
    setTimeout(async () => {
      const presets = await getFilterPresets();
      const updatedPresets = [...presets, newPreset];
      
      localStorage.setItem(FILTER_PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
      
      // If this is set as default, update default preset
      if (newPreset.isDefault) {
        await setDefaultPreset(newPreset.id);
      }
      
      resolve(newPreset);
    }, 300);
  });
};

// Update an existing filter preset
export const updateFilterPreset = async (preset: FilterPreset): Promise<FilterPreset> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const presets = await getFilterPresets();
      const index = presets.findIndex(p => p.id === preset.id);
      
      if (index === -1) {
        reject(new Error(`Preset with id ${preset.id} not found`));
        return;
      }
      
      const updatedPresets = [...presets];
      updatedPresets[index] = preset;
      
      localStorage.setItem(FILTER_PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
      
      // If this is set as default, update default preset
      if (preset.isDefault) {
        await setDefaultPreset(preset.id);
      }
      
      resolve(preset);
    }, 300);
  });
};

// Delete a filter preset
export const deleteFilterPreset = async (presetId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const presets = await getFilterPresets();
      const index = presets.findIndex(p => p.id === presetId);
      
      if (index === -1) {
        reject(new Error(`Preset with id ${presetId} not found`));
        return;
      }
      
      const updatedPresets = presets.filter(p => p.id !== presetId);
      localStorage.setItem(FILTER_PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
      
      // If this was the default preset, clear the default
      const defaultPresetId = localStorage.getItem(DEFAULT_PRESET_STORAGE_KEY);
      if (defaultPresetId === presetId) {
        localStorage.removeItem(DEFAULT_PRESET_STORAGE_KEY);
      }
      
      resolve();
    }, 300);
  });
};

// Set a preset as the default
export const setDefaultPreset = async (presetId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const presets = await getFilterPresets();
      const preset = presets.find(p => p.id === presetId);
      
      if (!preset) {
        reject(new Error(`Preset with id ${presetId} not found`));
        return;
      }
      
      // Update all presets to remove isDefault flag
      const updatedPresets = presets.map(p => ({
        ...p,
        isDefault: p.id === presetId
      }));
      
      localStorage.setItem(FILTER_PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
      localStorage.setItem(DEFAULT_PRESET_STORAGE_KEY, presetId);
      
      resolve();
    }, 300);
  });
};

// Get the default preset
export const getDefaultPreset = async (): Promise<FilterPreset | null> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const defaultPresetId = localStorage.getItem(DEFAULT_PRESET_STORAGE_KEY);
      
      if (!defaultPresetId) {
        resolve(null);
        return;
      }
      
      const presets = await getFilterPresets();
      const defaultPreset = presets.find(p => p.id === defaultPresetId) || null;
      
      resolve(defaultPreset);
    }, 300);
  });
};
