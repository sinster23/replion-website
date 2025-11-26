export interface DashboardStats {
  totalAutomations: number;
  activeAutomations: number;
  pausedAutomations: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
}

export interface RecentActivity {
  id: string;
  automationId: string;
  automationName: string;
  type: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  timestamp: string;
  details: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string | null;
  type: 'AUTO_LIKE' | 'AUTO_FOLLOW' | 'AUTO_COMMENT' | 'AUTO_UNFOLLOW' | 'SCHEDULED_POST' | 'STORY_VIEW' | 'DM_AUTOMATION';
  status: 'ACTIVE' | 'PAUSED' | 'FAILED' | 'COMPLETED';
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  lastExecutedAt: string | null;
  integration: {
    platform: string;
    username: string;
  };
  config: any;
  schedule: any;
  dailyLimit: number | null;
  hourlyLimit: number | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Integration {
  id: string;
  platform: string;
  username: string;
  isActive: boolean;
}