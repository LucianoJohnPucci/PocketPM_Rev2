// Mock data service for task allocation and reassignment

import { StakeholderResource } from './mockResourceService';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  dueDate: string;
  estimatedHours: number;
  completionPercentage: number;
  assigneeId: number | null;
  projectId: number;
  tags: string[];
}

export interface TaskAllocationSummary {
  stakeholders: StakeholderResource[];
  tasks: Task[];
  unassignedTasks: number;
  overallocatedStakeholders: number;
  underallocatedStakeholders: number;
}

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Design user dashboard',
    description: 'Create wireframes and mockups for the main user dashboard',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2025-05-20',
    estimatedHours: 16,
    completionPercentage: 60,
    assigneeId: 3, // Michael Chen (UX Designer)
    projectId: 1,
    tags: ['design', 'ui', 'dashboard']
  },
  {
    id: 2,
    title: 'Implement authentication service',
    description: 'Develop the authentication service with JWT support',
    priority: 'critical',
    status: 'in_progress',
    dueDate: '2025-05-15',
    estimatedHours: 24,
    completionPercentage: 40,
    assigneeId: 5, // David Kim (Backend Developer)
    projectId: 1,
    tags: ['backend', 'auth', 'security']
  },
  {
    id: 3,
    title: 'Create API documentation',
    description: 'Document all API endpoints using Swagger',
    priority: 'medium',
    status: 'not_started',
    dueDate: '2025-05-25',
    estimatedHours: 12,
    completionPercentage: 0,
    assigneeId: 5, // David Kim (Backend Developer)
    projectId: 1,
    tags: ['documentation', 'api']
  },
  {
    id: 4,
    title: 'Implement data visualization components',
    description: 'Create reusable chart components for the dashboard',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2025-05-18',
    estimatedHours: 20,
    completionPercentage: 30,
    assigneeId: 2, // Sarah Johnson (Lead Developer)
    projectId: 1,
    tags: ['frontend', 'charts', 'components']
  },
  {
    id: 5,
    title: 'Write unit tests for authentication',
    description: 'Create comprehensive test suite for auth service',
    priority: 'medium',
    status: 'not_started',
    dueDate: '2025-05-22',
    estimatedHours: 10,
    completionPercentage: 0,
    assigneeId: 4, // Emily Rodriguez (QA Engineer)
    projectId: 1,
    tags: ['testing', 'auth', 'quality']
  },
  {
    id: 6,
    title: 'Optimize database queries',
    description: 'Improve performance of dashboard queries',
    priority: 'high',
    status: 'not_started',
    dueDate: '2025-05-19',
    estimatedHours: 14,
    completionPercentage: 0,
    assigneeId: 5, // David Kim (Backend Developer)
    projectId: 1,
    tags: ['database', 'performance', 'optimization']
  },
  {
    id: 7,
    title: 'Create user onboarding flow',
    description: 'Design and implement user onboarding experience',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2025-05-28',
    estimatedHours: 18,
    completionPercentage: 20,
    assigneeId: 3, // Michael Chen (UX Designer)
    projectId: 1,
    tags: ['design', 'onboarding', 'user-experience']
  },
  {
    id: 8,
    title: 'Implement notification system',
    description: 'Create real-time notification system for users',
    priority: 'medium',
    status: 'not_started',
    dueDate: '2025-05-30',
    estimatedHours: 22,
    completionPercentage: 0,
    assigneeId: 2, // Sarah Johnson (Lead Developer)
    projectId: 1,
    tags: ['frontend', 'notifications', 'real-time']
  },
  {
    id: 9,
    title: 'Conduct usability testing',
    description: 'Organize and run usability tests with sample users',
    priority: 'high',
    status: 'not_started',
    dueDate: '2025-06-05',
    estimatedHours: 16,
    completionPercentage: 0,
    assigneeId: 4, // Emily Rodriguez (QA Engineer)
    projectId: 1,
    tags: ['testing', 'usability', 'user-experience']
  },
  {
    id: 10,
    title: 'Create project documentation',
    description: 'Document project architecture and setup instructions',
    priority: 'low',
    status: 'not_started',
    dueDate: '2025-06-10',
    estimatedHours: 8,
    completionPercentage: 0,
    assigneeId: 1, // John Smith (Project Manager)
    projectId: 1,
    tags: ['documentation', 'project']
  },
  {
    id: 11,
    title: 'Implement export functionality',
    description: 'Add ability to export reports as PDF and CSV',
    priority: 'medium',
    status: 'not_started',
    dueDate: '2025-06-02',
    estimatedHours: 12,
    completionPercentage: 0,
    assigneeId: 2, // Sarah Johnson (Lead Developer)
    projectId: 1,
    tags: ['frontend', 'export', 'reports']
  },
  {
    id: 12,
    title: 'Set up CI/CD pipeline',
    description: 'Configure continuous integration and deployment',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2025-05-16',
    estimatedHours: 10,
    completionPercentage: 70,
    assigneeId: 1, // John Smith (Project Manager)
    projectId: 1,
    tags: ['devops', 'ci-cd', 'automation']
  },
  {
    id: 13,
    title: 'Implement data analytics module',
    description: 'Create analytics module for tracking user behavior',
    priority: 'medium',
    status: 'not_started',
    dueDate: '2025-06-08',
    estimatedHours: 20,
    completionPercentage: 0,
    assigneeId: 6, // Lisa Wang (Data Analyst)
    projectId: 1,
    tags: ['analytics', 'data', 'tracking']
  },
  {
    id: 14,
    title: 'Create user management interface',
    description: 'Build admin interface for user management',
    priority: 'medium',
    status: 'not_started',
    dueDate: '2025-06-01',
    estimatedHours: 16,
    completionPercentage: 0,
    assigneeId: 2, // Sarah Johnson (Lead Developer)
    projectId: 1,
    tags: ['frontend', 'admin', 'user-management']
  },
  {
    id: 15,
    title: 'Implement role-based access control',
    description: 'Add RBAC to restrict access based on user roles',
    priority: 'high',
    status: 'not_started',
    dueDate: '2025-05-25',
    estimatedHours: 18,
    completionPercentage: 0,
    assigneeId: 5, // David Kim (Backend Developer)
    projectId: 1,
    tags: ['backend', 'security', 'access-control']
  },
  {
    id: 16,
    title: 'Optimize frontend performance',
    description: 'Improve load times and rendering performance',
    priority: 'medium',
    status: 'not_started',
    dueDate: '2025-06-05',
    estimatedHours: 14,
    completionPercentage: 0,
    assigneeId: 2, // Sarah Johnson (Lead Developer)
    projectId: 1,
    tags: ['frontend', 'performance', 'optimization']
  },
  {
    id: 17,
    title: 'Create data visualization dashboard',
    description: 'Build interactive dashboard for data visualization',
    priority: 'high',
    status: 'not_started',
    dueDate: '2025-06-10',
    estimatedHours: 24,
    completionPercentage: 0,
    assigneeId: 6, // Lisa Wang (Data Analyst)
    projectId: 1,
    tags: ['data', 'dashboard', 'visualization']
  },
  {
    id: 18,
    title: 'Implement search functionality',
    description: 'Add global search feature with filters',
    priority: 'medium',
    status: 'not_started',
    dueDate: '2025-06-03',
    estimatedHours: 16,
    completionPercentage: 0,
    assigneeId: null, // Unassigned
    projectId: 1,
    tags: ['frontend', 'search', 'filters']
  },
  {
    id: 19,
    title: 'Create user feedback system',
    description: 'Implement system for collecting user feedback',
    priority: 'low',
    status: 'not_started',
    dueDate: '2025-06-15',
    estimatedHours: 12,
    completionPercentage: 0,
    assigneeId: null, // Unassigned
    projectId: 1,
    tags: ['feedback', 'user-experience']
  },
  {
    id: 20,
    title: 'Implement multi-language support',
    description: 'Add internationalization to the application',
    priority: 'low',
    status: 'not_started',
    dueDate: '2025-06-20',
    estimatedHours: 20,
    completionPercentage: 0,
    assigneeId: null, // Unassigned
    projectId: 1,
    tags: ['i18n', 'localization', 'languages']
  }
];

// Mock service functions
export const getTaskAllocationSummary = async (): Promise<TaskAllocationSummary> => {
  // Import dynamically to avoid circular dependency
  const { getAllStakeholders } = await import('./mockResourceService');
  const stakeholders = await getAllStakeholders();
  
  // Ensure some tasks are assigned to each stakeholder for demonstration purposes
  const stakeholderIds = stakeholders.map(s => s.id);
  
  // Assign some tasks to stakeholders if they don't have any
  mockTasks.forEach((task, index) => {
    // Distribute tasks among stakeholders for demonstration
    if (index < 10) { // First 10 tasks
      const stakeholderId = stakeholderIds[index % stakeholderIds.length];
      mockTasks[index].assigneeId = stakeholderId;
    }
  });
  
  // Ensure at least 3 tasks are unassigned for demonstration
  for (let i = 10; i < 13 && i < mockTasks.length; i++) {
    mockTasks[i].assigneeId = null;
  }
  
  console.log('Getting task allocation summary...');
  console.log('Stakeholders:', stakeholders);
  console.log('Tasks:', mockTasks);
  console.log('Unassigned tasks count:', mockTasks.filter(task => task.assigneeId === null).length);
  
  return {
    stakeholders,
    tasks: [...mockTasks],
    unassignedTasks: mockTasks.filter(task => task.assigneeId === null).length,
    overallocatedStakeholders: stakeholders.filter(s => s.utilizationRate > 90).length,
    underallocatedStakeholders: stakeholders.filter(s => s.utilizationRate < 50).length
  };
};

export const getTasksByAssignee = async (assigneeId: number | null): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTasks.filter(task => task.assigneeId === assigneeId));
    }, 300);
  });
};

export const getUnassignedTasks = async (): Promise<Task[]> => {
  return getTasksByAssignee(null);
};

export const assignTask = async (taskId: number, assigneeId: number | null): Promise<Task> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const taskIndex = mockTasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        mockTasks[taskIndex] = {
          ...mockTasks[taskIndex],
          assigneeId
        };
        resolve(mockTasks[taskIndex]);
      } else {
        throw new Error('Task not found');
      }
    }, 300);
  });
};

export const bulkAssignTasks = async (taskIds: number[], assigneeId: number | null): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedTasks: Task[] = [];
      
      taskIds.forEach(taskId => {
        const taskIndex = mockTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          mockTasks[taskIndex] = {
            ...mockTasks[taskIndex],
            assigneeId
          };
          updatedTasks.push(mockTasks[taskIndex]);
        }
      });
      
      resolve(updatedTasks);
    }, 500);
  });
};

// Calculate impact of task reassignment on stakeholder utilization
export const calculateReassignmentImpact = async (taskIds: number[], newAssigneeId: number | null): Promise<{
  currentAssigneeImpact: { id: number; newUtilizationRate: number }[];
  newAssigneeImpact: { id: number; newUtilizationRate: number } | null;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Import dynamically to avoid circular dependency
      import('./mockResourceService').then(({ getAllStakeholders }) => {
        getAllStakeholders().then(stakeholders => {
          const tasksToReassign = mockTasks.filter(t => taskIds.includes(t.id));
          // Use Array.from instead of spread operator with Set to avoid TS2802 error
          const currentAssigneeIds = Array.from(
            new Set(tasksToReassign.map(t => t.assigneeId).filter(id => id !== null))
          ) as number[];
          
          // Calculate total hours being reassigned from each current assignee
          const hoursPerCurrentAssignee: Record<number, number> = {};
          currentAssigneeIds.forEach(id => { hoursPerCurrentAssignee[id] = 0; });
          
          tasksToReassign.forEach(task => {
            if (task.assigneeId !== null) {
              hoursPerCurrentAssignee[task.assigneeId] += task.estimatedHours * (1 - task.completionPercentage / 100);
            }
          });
          
          // Calculate total hours being assigned to new assignee
          const totalHoursToNewAssignee = tasksToReassign.reduce(
            (sum, task) => sum + task.estimatedHours * (1 - task.completionPercentage / 100), 
            0
          );
          
          // Calculate impact on current assignees
          const currentAssigneeImpact = currentAssigneeIds.map(id => {
            const stakeholder = stakeholders.find(s => s.id === id);
            if (!stakeholder) return { id, newUtilizationRate: 0 };
            
            const currentAllocatedHours = stakeholder.allocatedHours;
            const newAllocatedHours = currentAllocatedHours - hoursPerCurrentAssignee[id];
            const newUtilizationRate = Math.round((newAllocatedHours / stakeholder.availableHours) * 100);
            
            return { id, newUtilizationRate };
          });
          
          // Calculate impact on new assignee
          let newAssigneeImpact = null;
          if (newAssigneeId !== null) {
            const newAssignee = stakeholders.find(s => s.id === newAssigneeId);
            if (newAssignee) {
              const currentAllocatedHours = newAssignee.allocatedHours;
              const newAllocatedHours = currentAllocatedHours + totalHoursToNewAssignee;
              const newUtilizationRate = Math.round((newAllocatedHours / newAssignee.availableHours) * 100);
              
              newAssigneeImpact = { id: newAssigneeId, newUtilizationRate };
            }
          }
          
          resolve({
            currentAssigneeImpact,
            newAssigneeImpact
          });
        });
      });
    }, 300);
  });
};
