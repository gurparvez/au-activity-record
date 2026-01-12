import { ID, Query } from 'appwrite';
import { IQAC_DEPARTMENT_ID } from '@/constants';
import { account, db, functions, config } from '../client';

export interface UserInfo {
  userId: string;
  username: string;
  email: string;
  departmentId: string;
  role: string;
  isApproved: boolean;
  departmentName: string | null;
  name: string | null;
}

export const userService = {
  registerUserRoleAndDepartment: async (
    userId: string,
    userName: string,
    userEmail: string,
    departmentId: string,
  ) => {
    try {
      const userDepartment = await db.listDocuments(config.DB_ID, config.USER_COLLECTION_ID, [
        Query.equal('userId', userId),
      ]);

      let role = 'HOD';
      if (departmentId === IQAC_DEPARTMENT_ID) {
        role = 'IQAC member';
      }

      if (userDepartment.documents.length > 0) {
        const documentId = userDepartment.documents[0].$id;
        await db.updateDocument(config.DB_ID, config.USER_COLLECTION_ID, documentId, {
          departmentId: departmentId,
          role: role,
        });
      } else {
        await db.createDocument(config.DB_ID, config.USER_COLLECTION_ID, ID.unique(), {
          userId: userId,
          userName: userName,
          userEmail: userEmail,
          departmentId: departmentId,
          role: role,
        });
      }
    } catch (error) {
      console.error('Error in registerUserDepartment:', error);
      throw error;
    }
  },

  getUserRole: async (userId: string) => {
    const docs = await db.listDocuments(config.DB_ID, config.USER_COLLECTION_ID, [
      Query.equal('userId', userId),
    ]);
    if (docs.documents.length > 0) {
      return docs.documents[0];
    }
    return undefined;
  },

  getAllUsers: async (): Promise<UserInfo[]> => {
    try {
      const userDocuments = await db.listDocuments(config.DB_ID, config.USER_COLLECTION_ID);

      const users = await Promise.all(
        userDocuments.documents.map(async (userDoc) => {
          let departmentName = null;

          if (userDoc.departmentId) {
            try {
              const department = await db.getDocument(
                config.DB_ID,
                config.DEPARTMENT_COLLECTION_ID,
                userDoc.departmentId,
              );
              departmentName = department.name || null;
            } catch (error) {
              console.error(
                `Error fetching department ${userDoc.departmentId} for user ${userDoc.userId}:`,
                error,
              );
            }
          }

          return {
            userId: userDoc.userId,
            username: userDoc.userName,
            email: userDoc.userEmail,
            departmentId: userDoc.departmentId,
            role: userDoc.role,
            isApproved: userDoc.isApproved,
            departmentName: departmentName,
            name: null,
          };
        }),
      );

      return users;
    } catch (error) {
      console.error('Error in getting users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const FUNCTION_ID = import.meta.env.VITE_APPWRITE_DELETE_USER_FUNCTION_ID || '';
      if (!FUNCTION_ID) {
        throw new Error('VITE_APPWRITE_DELETE_USER_FUNCTION_ID is not defined');
      }

      const payload = {
        databaseId: config.DB_ID,
        userId: userId,
      };

      const execution = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify(payload),
        false,
      );

      const response = JSON.parse(execution.responseBody || '{}');
      if (!response) {
        throw new Error('Internal Server Error!');
      }

      if (response.error) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  approveUser: async (userId: string) => {
    try {
      const documents = await db.listDocuments(config.DB_ID, config.USER_COLLECTION_ID, [
        Query.equal('userId', userId),
      ]);
      if (documents.documents.length < 1) {
        throw new Error(`No document found in users for the user id: ${userId}`);
      }
      const targetDocumentId = documents.documents[0].$id;
      const response = await db.updateDocument(
        config.DB_ID,
        config.USER_COLLECTION_ID,
        targetDocumentId,
        { isApproved: true },
      );
      if (!response) {
        throw new Error('Internal server error');
      }
      return true;
    } catch (error) {
      console.error('Error approving user:', error);
      throw error;
    }
  },

  updateUserRole: async (userId: string, role: string) => {
    try {
      const users = await db.listDocuments(config.DB_ID, config.USER_COLLECTION_ID, [
        Query.equal('userId', userId),
      ]);
      if (users.documents.length < 1) {
        throw new Error('No user found!');
      }

      const thisUser = await account.get();
      const thisUsers = await db.listDocuments(config.DB_ID, config.USER_COLLECTION_ID, [
        Query.equal('userId', thisUser.$id),
      ]);
      if (thisUsers.documents.length < 1) {
        throw new Error('You are not authenticated!');
      }

      const thisUserRole = thisUsers.documents[0].role;
      const documentId = users.documents[0].$id;

      // Role-based access control
      if (thisUserRole === 'IQAC member') {
        if (role === 'IQAC HOD') {
          throw new Error("IQAC members can only assign the 'IQAC member' and 'HOD' role!");
        }
      } else if (thisUserRole === 'IQAC HOD') {
        if (!['HOD', 'IQAC member', 'IQAC HOD'].includes(role)) {
          throw new Error('Invalid role selected!');
        }
      } else {
        throw new Error('You do not have permission to change roles!');
      }

      if (role === 'IQAC HOD') {
        await db.updateDocument(config.DB_ID, config.USER_COLLECTION_ID, documentId, {
          role,
          departmentId: IQAC_DEPARTMENT_ID,
        });
      } else {
        await db.updateDocument(config.DB_ID, config.USER_COLLECTION_ID, documentId, { role });
      }

      return { success: true, message: `User role updated to ${role}` };
    } catch (error) {
      console.error('Error updating role of user:', error);
      throw error;
    }
  },
};
