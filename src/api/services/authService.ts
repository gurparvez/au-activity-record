import { ID, OAuthProvider } from 'appwrite';
import { ROOT_URL } from '@/constants';
import { account, db, config } from '../client';

export const authService = {
  registerUser: async (name: string, email: string, password: string) => {
    const user = await account.create(ID.unique(), email, password, name);
    await db.createDocument(config.DB_ID, config.USER_COLLECTION_ID, ID.unique(), {
      userId: user.$id,
      userName: name,
      userEmail: email,
      departmentId: '',
      approved: false,
    });
    await authService.loginUser(email, password);
  },

  sendUserVerificationEmail: async () => {
    return await account.createVerification(`${ROOT_URL}/update-verification`);
  },

  loginWithGoogle: async () => {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      `${ROOT_URL}/`,
      `${ROOT_URL}/`,
    );
  },

  loginUser: async (email: string, password: string) => {
    try {
      const currentSession = await account.getSession('current');
      if (currentSession) {
        await account.deleteSession('current');
      }
      await account.createEmailPasswordSession(email, password);
    } catch {
      await account.createEmailPasswordSession(email, password);
    }
  },

  updateUserEmailVerification: async (userId: string, token: string) => {
    await account.updateVerification(userId, token);
  },

  getCurrentUser: async () => {
    return await account.get();
  },
};
