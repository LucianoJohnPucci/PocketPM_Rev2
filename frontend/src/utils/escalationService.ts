import { format, differenceInDays, parseISO } from 'date-fns';

// Define escalation levels
export enum EscalationLevel {
  NONE = 'none',
  LOW = 'low',        // 7+ days before deadline, low progress
  MEDIUM = 'medium',  // 3-7 days before deadline, low progress
  HIGH = 'high',      // 1-3 days before deadline, low progress
  CRITICAL = 'critical' // <1 day before deadline, low progress
}

// Define escalation actions
export enum EscalationAction {
  NOTIFY_ASSIGNEE = 'notify_assignee',
  NOTIFY_MANAGER = 'notify_manager',
  NOTIFY_STAKEHOLDERS = 'notify_stakeholders',
  ESCALATE_TO_EXECUTIVE = 'escalate_to_executive',
  EMERGENCY_MEETING = 'emergency_meeting'
}

// Define task interface for escalation
export interface EscalationTask {
  id: number;
  title: string;
  status: string;
  priority: string;
  due_date: string;
  completion_percentage: number;
  assignee_id?: number;
  project_id: number;
  last_updated?: string;
}

// Define escalation result interface
export interface EscalationResult {
  task: EscalationTask;
  level: EscalationLevel;
  daysUntilDue: number;
  actions: EscalationAction[];
  message: string;
  escalationPath: string[];
}

// Define thresholds for escalation
const PROGRESS_THRESHOLD = 0.1; // 10% progress per day expected
const LOW_THRESHOLD_DAYS = 7;
const MEDIUM_THRESHOLD_DAYS = 3;
const HIGH_THRESHOLD_DAYS = 1;

/**
 * Calculate escalation level based on days until due and progress
 */
export const calculateEscalationLevel = (daysUntilDue: number, completionPercentage: number, expectedProgress: number): EscalationLevel => {
  // If task is completed or has sufficient progress, no escalation needed
  if (completionPercentage >= 100 || completionPercentage >= expectedProgress) {
    return EscalationLevel.NONE;
  }

  // Determine escalation level based on days until due
  if (daysUntilDue <= 0) {
    return EscalationLevel.CRITICAL;
  } else if (daysUntilDue <= HIGH_THRESHOLD_DAYS) {
    return EscalationLevel.HIGH;
  } else if (daysUntilDue <= MEDIUM_THRESHOLD_DAYS) {
    return EscalationLevel.MEDIUM;
  } else if (daysUntilDue <= LOW_THRESHOLD_DAYS) {
    return EscalationLevel.LOW;
  }

  return EscalationLevel.NONE;
};

/**
 * Determine escalation actions based on escalation level
 */
export const determineEscalationActions = (level: EscalationLevel): EscalationAction[] => {
  switch (level) {
    case EscalationLevel.CRITICAL:
      return [
        EscalationAction.NOTIFY_ASSIGNEE,
        EscalationAction.NOTIFY_MANAGER,
        EscalationAction.NOTIFY_STAKEHOLDERS,
        EscalationAction.ESCALATE_TO_EXECUTIVE,
        EscalationAction.EMERGENCY_MEETING
      ];
    case EscalationLevel.HIGH:
      return [
        EscalationAction.NOTIFY_ASSIGNEE,
        EscalationAction.NOTIFY_MANAGER,
        EscalationAction.NOTIFY_STAKEHOLDERS
      ];
    case EscalationLevel.MEDIUM:
      return [
        EscalationAction.NOTIFY_ASSIGNEE,
        EscalationAction.NOTIFY_MANAGER
      ];
    case EscalationLevel.LOW:
      return [EscalationAction.NOTIFY_ASSIGNEE];
    default:
      return [];
  }
};

/**
 * Generate escalation message based on level and days until due
 */
export const generateEscalationMessage = (level: EscalationLevel, daysUntilDue: number, task: EscalationTask): string => {
  switch (level) {
    case EscalationLevel.CRITICAL:
      return `CRITICAL: Task "${task.title}" is ${daysUntilDue <= 0 ? 'overdue' : 'due tomorrow'} with only ${task.completion_percentage}% completion. Immediate action required!`;
    case EscalationLevel.HIGH:
      return `HIGH RISK: Task "${task.title}" is due in ${daysUntilDue} days with insufficient progress (${task.completion_percentage}%). Urgent attention needed.`;
    case EscalationLevel.MEDIUM:
      return `ATTENTION: Task "${task.title}" is due in ${daysUntilDue} days but only at ${task.completion_percentage}% completion. Action required soon.`;
    case EscalationLevel.LOW:
      return `NOTICE: Task "${task.title}" is due in ${daysUntilDue} days with ${task.completion_percentage}% completion. Progress review recommended.`;
    default:
      return '';
  }
};

/**
 * Generate escalation path (who to contact) based on escalation level
 */
export const generateEscalationPath = (level: EscalationLevel): string[] => {
  switch (level) {
    case EscalationLevel.CRITICAL:
      return ['Task Assignee', 'Project Manager', 'Department Head', 'Executive Sponsor'];
    case EscalationLevel.HIGH:
      return ['Task Assignee', 'Project Manager', 'Department Head'];
    case EscalationLevel.MEDIUM:
      return ['Task Assignee', 'Project Manager'];
    case EscalationLevel.LOW:
      return ['Task Assignee'];
    default:
      return [];
  }
};

/**
 * Process a task for escalation
 */
export const processTaskForEscalation = (task: EscalationTask): EscalationResult | null => {
  // Parse due date
  const dueDate = parseISO(task.due_date);
  const today = new Date();
  
  // Calculate days until due
  const daysUntilDue = differenceInDays(dueDate, today);
  
  // If task is completed or not started, no escalation needed
  if (task.status === 'completed' || task.status === 'cancelled') {
    return null;
  }
  
  // Calculate expected progress based on days until due
  // For simplicity, we'll use a linear model: the closer to the deadline, the higher the expected progress
  const totalDuration = 14; // Assume tasks are planned for 2 weeks on average
  const daysElapsed = totalDuration - daysUntilDue;
  const expectedProgress = Math.min(100, Math.max(0, (daysElapsed / totalDuration) * 100));
  
  // Calculate escalation level
  const level = calculateEscalationLevel(daysUntilDue, task.completion_percentage, expectedProgress);
  
  // If no escalation needed, return null
  if (level === EscalationLevel.NONE) {
    return null;
  }
  
  // Determine escalation actions
  const actions = determineEscalationActions(level);
  
  // Generate escalation message
  const message = generateEscalationMessage(level, daysUntilDue, task);
  
  // Generate escalation path
  const escalationPath = generateEscalationPath(level);
  
  return {
    task,
    level,
    daysUntilDue,
    actions,
    message,
    escalationPath
  };
};

/**
 * Process multiple tasks for escalation
 */
export const processTasksForEscalation = (tasks: EscalationTask[]): EscalationResult[] => {
  return tasks
    .map(task => processTaskForEscalation(task))
    .filter((result): result is EscalationResult => result !== null);
};
