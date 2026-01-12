/**
 * Legacy API module - maintained for backward compatibility.
 *
 * New code should import directly from the service modules:
 * - import { authService } from '@/api/services/authService';
 * - import { userService } from '@/api/services/userService';
 * - import { departmentService } from '@/api/services/departmentService';
 * - import { activityService } from '@/api/services/activityService';
 * - import { documentService } from '@/api/services/documentService';
 * - import { confirmationService } from '@/api/services/confirmationService';
 */

import { db, account } from './client';
import { authService } from './services/authService';
import { userService } from './services/userService';
import { departmentService } from './services/departmentService';
import { activityService } from './services/activityService';
import { documentService } from './services/documentService';
import { confirmationService } from './services/confirmationService';

// Re-export db and account for backward compatibility
export { db, account };

/**
 * @deprecated Use individual service modules instead.
 * This class is maintained for backward compatibility only.
 */
class MyAppwrite {

  // Auth methods
  registerUser = authService.registerUser;
  sendUserVerificationEmail = authService.sendUserVerificationEmail;
  loginWithGoogle = authService.loginWithGoogle;
  loginUser = authService.loginUser;
  updateUserEmailVerification = authService.updateUserEmailVerification;

  // User methods
  registerUserRoleAndDepartment = userService.registerUserRoleAndDepartment;
  getUserRole = userService.getUserRole;
  getAllUsers = userService.getAllUsers;
  deleteUser = userService.deleteUser;
  approveUser = userService.approveUser;
  updateUserRole = userService.updateUserRole;

  // Department methods
  getAllDepartments = departmentService.getAllDepartments;
  getUserDepartmentId = departmentService.getUserDepartmentId;
  getDepartment = departmentService.getDepartment;
  getUserDepartment = departmentService.getUserDepartment;

  // Activity methods
  createNewActivityCollection = activityService.createNewActivityCollection;
  getAllActivities = activityService.getAllActivities;
  updateActivityCollection = activityService.updateActivityCollection;
  getDocumentsOfActivity = activityService.getDocumentsOfActivity;
  deleteActivity = activityService.deleteActivity;

  // Document methods
  createDocument = documentService.createDocument;
  getDocument = documentService.getDocument;
  updateDocument = documentService.updateDocument;
  deleteDocument = documentService.deleteDocument;

  // Confirmation methods
  getConfirmationDataOfDepartment = confirmationService.getConfirmationDataOfDepartment;
  updateConfirmationDataOfDepartment = confirmationService.updateConfirmationDataOfDepartment;
  getConfirmationData = confirmationService.getConfirmationData;
}

export const myAppwrite = new MyAppwrite();
