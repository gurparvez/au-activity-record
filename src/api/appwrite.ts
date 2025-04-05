import { ROOT_URL } from '@/constants';
import { Account, AppwriteException, Client, Databases, ID, OAuthProvider, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
const API_URL = import.meta.env.VITE_APPWRITE_API_URL || '';
const DB_ID = import.meta.env.VITE_DATABASE_ID || '';
const USER_COLLECTION_ID = import.meta.env.VITE_USER_COLLECTION_ID || '';
const DEPARTMENT_COLLECTION_ID = import.meta.env.VITE_DEPARTMENT_COLLECTION_ID || '';

const client = new Client();
client.setEndpoint(API_URL).setProject(PROJECT_ID);

export const db = new Databases(client);
export const account = new Account(client);

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

  updateUserEmailVerification = async (userId: string, token: string) => {
    const result = await account.updateVerification(
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

  getAllDepartments = async () => {
    return (await db.listDocuments(DB_ID, DEPARTMENT_COLLECTION_ID)).documents;
  };

  getUserDepartment = async (userId: string) => {
    console.log(userId);
    try {
      const departments = await db.listDocuments(DB_ID, USER_COLLECTION_ID, [
        Query.equal('userId', userId),
      ]);
      if (departments.documents.length > 0) {
        return departments.documents[0]; // Return the department
      }
      return null; // Return null if no department is found
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getDepartment = async (departmentId: string) => {}

  loginWithGoogle = async () => {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      `${ROOT_URL}/`, // redirect here on success
      `${ROOT_URL}/`, // redirect here on failure
      // ['repo', 'user'] // scopes
    );
  };
}

export const myAppwrite = new MyAppwrite();
