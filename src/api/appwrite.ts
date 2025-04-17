import { ROOT_URL } from '@/constants';
import { ActivityDetail, ActivityDocument } from '@/types';
import { Account, Client, Databases, Functions, ID, OAuthProvider, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
const API_URL = import.meta.env.VITE_APPWRITE_API_URL || '';
const DB_ID = import.meta.env.VITE_DATABASE_ID || '';
const USER_COLLECTION_ID = import.meta.env.VITE_USER_COLLECTION_ID || '';
const DEPARTMENT_COLLECTION_ID = import.meta.env.VITE_DEPARTMENT_COLLECTION_ID || '';
const ACTIVITIES_COLLECTION_ID = import.meta.env.VITE_ACTIVITIES_COLLECTION_ID || '';

const client = new Client();
client.setEndpoint(API_URL).setProject(PROJECT_ID);

export const db = new Databases(client);
export const account = new Account(client);
const functions = new Functions(client);

class MyAppwrite {
  registerUser = async (name: string, email: string, password: string) => {
    const user = await account.create(ID.unique(), email, password, name);
    await db.createDocument(DB_ID, USER_COLLECTION_ID, ID.unique(), {
      userId: user.$id,
      departmentId: '',
    });
    await this.loginUser(email, password);
  };

  sendUserVerificationEmail = async () => {
    return await account.createVerification(`${ROOT_URL}/update-verification`);
  };

  loginWithGoogle = async () => {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      `${ROOT_URL}/`, // redirect here on success
      `${ROOT_URL}/`, // redirect here on failure
      // ['repo', 'user'] // scopes
    );
  };

  loginUser = async (email: string, password: string) => {
    try {
      const currentSession = await account.getSession('current');
      if (currentSession) {
        await account.deleteSession('current');
      }

      await account.createEmailPasswordSession(email, password);
    } catch (error) {
      await account.createEmailPasswordSession(email, password);
    }
  };

  updateUserEmailVerification = async (userId: string, token: string) => {
    await account.updateVerification(
      userId, // userId
      token, // secret
    );
  };

  registerUserDepartment = async (userId: string, departmentId: string) => {
    try {
      const userDepartment = await db.listDocuments(DB_ID, USER_COLLECTION_ID, [
        Query.equal('userId', userId),
      ]);

      // If a document exists, update it
      if (userDepartment.documents.length > 0) {
        const documentId = userDepartment.documents[0].$id;
        await db.updateDocument('[DB_ID]', '[USER_COLLECTION_ID]', documentId, {
          departmentId: departmentId,
        });
        console.log(`Updated department for user ${userId}`);
      }
      // If no document exists, create a new one
      else {
        await db.createDocument(DB_ID, USER_COLLECTION_ID, ID.unique(), {
          userId: userId,
          departmentId: departmentId,
        });
        console.log(`Created new department record for user ${userId}`);
      }
    } catch (error) {
      console.error('Error in registerUserDepartment:', error);
      throw error; // Re-throw to let the caller handle it
    }
  };

  getUserRole = async (userId: string) => {
    const docs = await db.listDocuments(DB_ID, USER_COLLECTION_ID, [Query.equal('userId', userId)]);
    if (docs.documents.length > 0) {
      return docs.documents[0].role; // Return the role of the user
    }
  };

  getAllDepartments = async () => {
    return (await db.listDocuments(DB_ID, DEPARTMENT_COLLECTION_ID)).documents;
  };

  getUserDepartmentId = async (userId: string) => {
    try {
      const departments = await db.listDocuments(DB_ID, USER_COLLECTION_ID, [
        Query.equal('userId', userId),
      ]);
      if (departments.documents.length > 0) {
        return departments.documents[0].departmentId; // Return the department's id
      }
      return null; // Return null if no department is found
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getDepartment = async (departmentId: string) => {
    try {
      const department = await db.getDocument(DB_ID, DEPARTMENT_COLLECTION_ID, departmentId);
      return department;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getUserDepartment = async (userId: string) => {
    const userDepartmentId = await this.getUserDepartmentId(userId);
    if (!userDepartmentId) throw new Error('Department not found!');

    const userDepartment = await this.getDepartment(userDepartmentId);
    if (!userDepartment) throw new Error("User's department not found!");
    return userDepartment;
  };

  createNewActivityCollection = async (name: string, attributes: any[]) => {
    const user = await account.get();

    try {
      const FUNCTION_ID = import.meta.env.VITE_APPWRITE_CREATE_COLLECTION_FUNCTION_ID || '';
      if (!FUNCTION_ID) {
        throw new Error('VITE_APPWRITE_CREATE_COLLECTION_FUNCTION_ID is not defined');
      }

      const payload = {
        databaseId: DB_ID,
        collectionName: name,
        attributes: attributes,
        isActivity: true,
        userId: user.$id,
      };

      const execution = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify(payload), // Payload must be a string
        false, // Asynchronous execution (set to true if you want async)
      );

      const response = JSON.parse(execution.responseBody || '{}');
      if (!response) {
        throw new Error('Internal Server Error!');
      }

      if (response.error) {
        throw new Error(response.error);
      }

      console.log(`Activity collection created: ${response.message}`);
      return response;
    } catch (error) {
      console.error('Error creating activity collection:', error);
      throw error;
    }
  };

  getAllActivities = async (): Promise<ActivityDetail[]> => {
    try {
      // Step 1: Fetch all documents from the activities collection
      const activitiesResponse = await db.listDocuments(DB_ID, ACTIVITIES_COLLECTION_ID);
      const activities: ActivityDocument[] = activitiesResponse.documents as unknown as ActivityDocument[];

      // Step 2: For each activity, get document count and last updated date
      const activityDetails = await Promise.all(
        activities.map(async (activity: ActivityDocument): Promise<ActivityDetail> => {
          const activityId = activity.activity_id;

          try {
            // Get total document count in the activity collection
            const documentsResponse = await db.listDocuments(DB_ID, activityId);
            const documentCount = documentsResponse.total;

            // Get the most recently updated document (sorted by $updatedAt DESC)
            const latestDocumentResponse = await db.listDocuments(DB_ID, activityId, [
              Query.orderDesc('$updatedAt'),
              Query.limit(1),
            ]);

            const lastUpdated = latestDocumentResponse.documents.length > 0
              ? latestDocumentResponse.documents[0].$updatedAt
              : null;

            return {
              title: activity.title,
              count: documentCount,
              lastFilled: lastUpdated ? new Date(lastUpdated).toISOString().split('T')[0] : 'Never',
            };
          } catch (error) {
            console.error(`Error fetching details for activity ${activityId}:`, error);
            return {
              title: activity.title,
              count: 0,
              lastFilled: 'Error',
            };
          }
        })
      );

      return activityDetails;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Failed to fetch activities');
    }
  };
}

export const myAppwrite = new MyAppwrite();
