// Mock data service for resource allocation and stakeholder information

export interface StakeholderResource {
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
  department?: string; // Optional department field
}

export interface ResourceAllocationData {
  totalStakeholders: number;
  overallocatedCount: number;
  underallocatedCount: number;
  optimallyAllocatedCount: number;
  averageUtilizationRate: number;
  stakeholders: StakeholderResource[];
}

// Mock stakeholder resource data
const mockStakeholders: StakeholderResource[] = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Project Manager',
    email: 'john.smith@example.com',
    totalTasks: 24,
    completedTasks: 18,
    tasksByPriority: {
      low: 5,
      medium: 8,
      high: 7,
      critical: 4
    },
    utilizationRate: 95,
    availableHours: 40,
    allocatedHours: 38,
    department: 'Management'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Lead Developer',
    email: 'sarah.johnson@example.com',
    totalTasks: 18,
    completedTasks: 12,
    tasksByPriority: {
      low: 3,
      medium: 7,
      high: 6,
      critical: 2
    },
    utilizationRate: 87,
    availableHours: 40,
    allocatedHours: 35
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'UX Designer',
    email: 'michael.chen@example.com',
    totalTasks: 15,
    completedTasks: 10,
    tasksByPriority: {
      low: 4,
      medium: 6,
      high: 4,
      critical: 1
    },
    utilizationRate: 75,
    availableHours: 40,
    allocatedHours: 30
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    role: 'QA Engineer',
    email: 'emily.rodriguez@example.com',
    totalTasks: 20,
    completedTasks: 15,
    tasksByPriority: {
      low: 6,
      medium: 9,
      high: 3,
      critical: 2
    },
    utilizationRate: 65,
    availableHours: 40,
    allocatedHours: 26
  },
  {
    id: 5,
    name: 'David Kim',
    role: 'Backend Developer',
    email: 'david.kim@example.com',
    totalTasks: 16,
    completedTasks: 8,
    tasksByPriority: {
      low: 2,
      medium: 5,
      high: 7,
      critical: 2
    },
    utilizationRate: 92,
    availableHours: 40,
    allocatedHours: 37
  },
  {
    id: 6,
    name: 'Lisa Wang',
    role: 'Data Analyst',
    email: 'lisa.wang@example.com',
    totalTasks: 12,
    completedTasks: 7,
    tasksByPriority: {
      low: 3,
      medium: 4,
      high: 3,
      critical: 2
    },
    utilizationRate: 45,
    availableHours: 40,
    allocatedHours: 18
  }
];

// Calculate resource allocation summary data
const calculateResourceAllocationData = (): ResourceAllocationData => {
  const totalStakeholders = mockStakeholders.length;
  const overallocatedCount = mockStakeholders.filter(s => s.utilizationRate > 90).length;
  const underallocatedCount = mockStakeholders.filter(s => s.utilizationRate < 50).length;
  const optimallyAllocatedCount = totalStakeholders - overallocatedCount - underallocatedCount;
  const averageUtilizationRate = Math.round(
    mockStakeholders.reduce((sum, s) => sum + s.utilizationRate, 0) / totalStakeholders
  );

  return {
    totalStakeholders,
    overallocatedCount,
    underallocatedCount,
    optimallyAllocatedCount,
    averageUtilizationRate,
    stakeholders: mockStakeholders
  };
};

// Mock service functions
export const getResourceAllocationData = (): Promise<ResourceAllocationData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(calculateResourceAllocationData());
    }, 500); // Simulate network delay
  });
};

export const getStakeholderById = (id: number): Promise<StakeholderResource | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStakeholders.find(s => s.id === id));
    }, 300);
  });
};

export const getAllStakeholders = async (): Promise<StakeholderResource[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Returning stakeholders from mockResourceService:', mockStakeholders);
      resolve([...mockStakeholders]);
    }, 300);
  });
};
