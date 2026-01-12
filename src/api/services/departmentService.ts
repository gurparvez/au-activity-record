import { Query } from 'appwrite';
import { db, config } from '../client';

export const departmentService = {
  getAllDepartments: async () => {
    return (await db.listDocuments(config.DB_ID, config.DEPARTMENT_COLLECTION_ID)).documents;
  },

  getUserDepartmentId: async (userId: string): Promise<string | null> => {
    try {
      const departments = await db.listDocuments(config.DB_ID, config.USER_COLLECTION_ID, [
        Query.equal('userId', userId),
      ]);
      if (departments.documents.length > 0) {
        return departments.documents[0].departmentId;
      }
      return null;
    } catch (error) {
      console.error('Error getting user department ID:', error);
      return null;
    }
  },

  getDepartment: async (departmentId: string) => {
    try {
      const department = await db.getDocument(
        config.DB_ID,
        config.DEPARTMENT_COLLECTION_ID,
        departmentId,
      );
      return department;
    } catch (error) {
      console.error('Error getting department:', error);
      return null;
    }
  },

  getUserDepartment: async (userId: string) => {
    const userDepartmentId = await departmentService.getUserDepartmentId(userId);
    if (!userDepartmentId) return null;

    const userDepartment = await departmentService.getDepartment(userDepartmentId);
    if (!userDepartment) throw new Error("User's department not found!");
    return userDepartment;
  },
};
