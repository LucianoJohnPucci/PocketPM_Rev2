// Mock data service for scenario planning and resource optimization

import { StakeholderResource } from './mockResourceService';

export interface ResourceCost {
  id: number;
  name: string;
  hourlyRate: number; // Cost per hour
  maxHoursPerWeek: number;
  minHoursPerWeek: number;
}

export interface ProjectScenario {
  id: number;
  name: string;
  description: string;
  budget: number;
  duration: number; // In weeks
  resources: ScenarioResource[];
  totalCost: number;
  totalHours: number;
  isOptimal: boolean;
}

export interface ScenarioResource {
  resourceId: number;
  resourceName: string;
  role: string;
  hourlyRate: number;
  allocatedHours: number;
  utilizationRate: number;
  cost: number;
}

export interface OptimizationConstraint {
  maxBudget: number;
  maxDuration: number; // In weeks
  prioritizeDeliverySpeed: boolean;
  prioritizeCostSaving: boolean;
  maintainTeamBalance: boolean;
  requiredSkills: string[];
}

export interface OptimizationResult {
  scenarios: ProjectScenario[];
  recommendedScenarioId: number;
  potentialSavings: number;
  timelineReduction: number; // In weeks
  riskLevel: 'Low' | 'Medium' | 'High';
}

// Mock resource cost data
const mockResourceCosts: ResourceCost[] = [
  {
    id: 1,
    name: 'John Smith',
    hourlyRate: 85,
    maxHoursPerWeek: 40,
    minHoursPerWeek: 20
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    hourlyRate: 95,
    maxHoursPerWeek: 40,
    minHoursPerWeek: 20
  },
  {
    id: 3,
    name: 'Michael Chen',
    hourlyRate: 110,
    maxHoursPerWeek: 40,
    minHoursPerWeek: 20
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    hourlyRate: 75,
    maxHoursPerWeek: 40,
    minHoursPerWeek: 20
  },
  {
    id: 5,
    name: 'David Kim',
    hourlyRate: 90,
    maxHoursPerWeek: 40,
    minHoursPerWeek: 20
  },
  {
    id: 6,
    name: 'Lisa Wang',
    hourlyRate: 80,
    maxHoursPerWeek: 40,
    minHoursPerWeek: 20
  }
];

// Mock project scenarios
const mockScenarios: ProjectScenario[] = [
  {
    id: 1,
    name: 'Current Allocation',
    description: 'Current resource allocation across the project',
    budget: 120000,
    duration: 12,
    resources: [
      {
        resourceId: 1,
        resourceName: 'John Smith',
        role: 'Project Manager',
        hourlyRate: 85,
        allocatedHours: 480,
        utilizationRate: 95,
        cost: 40800
      },
      {
        resourceId: 2,
        resourceName: 'Sarah Johnson',
        role: 'Lead Developer',
        hourlyRate: 95,
        allocatedHours: 420,
        utilizationRate: 87,
        cost: 39900
      },
      {
        resourceId: 3,
        resourceName: 'Michael Chen',
        role: 'UX Designer',
        hourlyRate: 110,
        allocatedHours: 360,
        utilizationRate: 75,
        cost: 39600
      },
      {
        resourceId: 4,
        resourceName: 'Emily Rodriguez',
        role: 'QA Engineer',
        hourlyRate: 75,
        allocatedHours: 312,
        utilizationRate: 65,
        cost: 23400
      },
      {
        resourceId: 5,
        resourceName: 'David Kim',
        role: 'Backend Developer',
        hourlyRate: 90,
        allocatedHours: 444,
        utilizationRate: 92,
        cost: 39960
      },
      {
        resourceId: 6,
        resourceName: 'Lisa Wang',
        role: 'Data Analyst',
        hourlyRate: 80,
        allocatedHours: 216,
        utilizationRate: 45,
        cost: 17280
      }
    ],
    totalCost: 200940,
    totalHours: 2232,
    isOptimal: false
  },
  {
    id: 2,
    name: 'Budget Optimization',
    description: 'Optimized for minimal budget impact',
    budget: 100000,
    duration: 14,
    resources: [
      {
        resourceId: 1,
        resourceName: 'John Smith',
        role: 'Project Manager',
        hourlyRate: 85,
        allocatedHours: 420,
        utilizationRate: 75,
        cost: 35700
      },
      {
        resourceId: 2,
        resourceName: 'Sarah Johnson',
        role: 'Lead Developer',
        hourlyRate: 95,
        allocatedHours: 400,
        utilizationRate: 71,
        cost: 38000
      },
      {
        resourceId: 3,
        resourceName: 'Michael Chen',
        role: 'UX Designer',
        hourlyRate: 110,
        allocatedHours: 280,
        utilizationRate: 50,
        cost: 30800
      },
      {
        resourceId: 4,
        resourceName: 'Emily Rodriguez',
        role: 'QA Engineer',
        hourlyRate: 75,
        allocatedHours: 350,
        utilizationRate: 62,
        cost: 26250
      },
      {
        resourceId: 5,
        resourceName: 'David Kim',
        role: 'Backend Developer',
        hourlyRate: 90,
        allocatedHours: 400,
        utilizationRate: 71,
        cost: 36000
      },
      {
        resourceId: 6,
        resourceName: 'Lisa Wang',
        role: 'Data Analyst',
        hourlyRate: 80,
        allocatedHours: 140,
        utilizationRate: 25,
        cost: 11200
      }
    ],
    totalCost: 177950,
    totalHours: 1990,
    isOptimal: false
  },
  {
    id: 3,
    name: 'Time Optimization',
    description: 'Optimized for fastest delivery time',
    budget: 150000,
    duration: 10,
    resources: [
      {
        resourceId: 1,
        resourceName: 'John Smith',
        role: 'Project Manager',
        hourlyRate: 85,
        allocatedHours: 400,
        utilizationRate: 100,
        cost: 34000
      },
      {
        resourceId: 2,
        resourceName: 'Sarah Johnson',
        role: 'Lead Developer',
        hourlyRate: 95,
        allocatedHours: 400,
        utilizationRate: 100,
        cost: 38000
      },
      {
        resourceId: 3,
        resourceName: 'Michael Chen',
        role: 'UX Designer',
        hourlyRate: 110,
        allocatedHours: 400,
        utilizationRate: 100,
        cost: 44000
      },
      {
        resourceId: 4,
        resourceName: 'Emily Rodriguez',
        role: 'QA Engineer',
        hourlyRate: 75,
        allocatedHours: 400,
        utilizationRate: 100,
        cost: 30000
      },
      {
        resourceId: 5,
        resourceName: 'David Kim',
        role: 'Backend Developer',
        hourlyRate: 90,
        allocatedHours: 400,
        utilizationRate: 100,
        cost: 36000
      },
      {
        resourceId: 6,
        resourceName: 'Lisa Wang',
        role: 'Data Analyst',
        hourlyRate: 80,
        allocatedHours: 300,
        utilizationRate: 75,
        cost: 24000
      }
    ],
    totalCost: 206000,
    totalHours: 2300,
    isOptimal: false
  },
  {
    id: 4,
    name: 'Balanced Optimization',
    description: 'Balanced approach optimizing both cost and time',
    budget: 120000,
    duration: 12,
    resources: [
      {
        resourceId: 1,
        resourceName: 'John Smith',
        role: 'Project Manager',
        hourlyRate: 85,
        allocatedHours: 360,
        utilizationRate: 75,
        cost: 30600
      },
      {
        resourceId: 2,
        resourceName: 'Sarah Johnson',
        role: 'Lead Developer',
        hourlyRate: 95,
        allocatedHours: 384,
        utilizationRate: 80,
        cost: 36480
      },
      {
        resourceId: 3,
        resourceName: 'Michael Chen',
        role: 'UX Designer',
        hourlyRate: 110,
        allocatedHours: 336,
        utilizationRate: 70,
        cost: 36960
      },
      {
        resourceId: 4,
        resourceName: 'Emily Rodriguez',
        role: 'QA Engineer',
        hourlyRate: 75,
        allocatedHours: 336,
        utilizationRate: 70,
        cost: 25200
      },
      {
        resourceId: 5,
        resourceName: 'David Kim',
        role: 'Backend Developer',
        hourlyRate: 90,
        allocatedHours: 384,
        utilizationRate: 80,
        cost: 34560
      },
      {
        resourceId: 6,
        resourceName: 'Lisa Wang',
        role: 'Data Analyst',
        hourlyRate: 80,
        allocatedHours: 240,
        utilizationRate: 50,
        cost: 19200
      }
    ],
    totalCost: 183000,
    totalHours: 2040,
    isOptimal: true
  }
];

// Mock optimization result
const mockOptimizationResult: OptimizationResult = {
  scenarios: mockScenarios,
  recommendedScenarioId: 4,
  potentialSavings: 17940, // Compared to current allocation
  timelineReduction: 0, // Same timeline as current
  riskLevel: 'Low'
};

// Mock service functions
export const getResourceCosts = (): Promise<ResourceCost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockResourceCosts]);
    }, 300);
  });
};

export const getProjectScenarios = (): Promise<ProjectScenario[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockScenarios]);
    }, 500);
  });
};

export const getScenarioById = (id: number): Promise<ProjectScenario | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockScenarios.find(s => s.id === id));
    }, 300);
  });
};

export const runOptimization = (
  constraints: OptimizationConstraint
): Promise<OptimizationResult> => {
  return new Promise((resolve) => {
    // In a real implementation, this would run an optimization algorithm
    // based on the provided constraints
    setTimeout(() => {
      resolve({
        ...mockOptimizationResult,
        // Adjust recommendation based on constraints
        recommendedScenarioId: constraints.prioritizeCostSaving ? 2 : 
                              constraints.prioritizeDeliverySpeed ? 3 : 4
      });
    }, 1500); // Simulate longer processing time for optimization
  });
};
