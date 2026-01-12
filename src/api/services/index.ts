export { authService } from './authService';
export { userService, type UserInfo } from './userService';
export { departmentService } from './departmentService';
export { activityService, type DetailedActivity, type GetAllActivitiesResult } from './activityService';
export { documentService } from './documentService';
export { confirmationService } from './confirmationService';

// Re-export types from main types file
export type { ActivityAttribute } from '@/types';
