import { rootUrl } from '@/constants';
import { Account, Client, OAuthProvider } from 'appwrite';

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
const apiUrl = import.meta.env.VITE_APPWRITE_API_URL || '';

const client = new Client();
client.setEndpoint(apiUrl).setProject(projectId);

export const account = new Account(client);
export { ID } from 'appwrite';

class MyAppwrite {
  loginWithGoogle = async () => {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      `${rootUrl}/auth`, // redirect here on success
      `${rootUrl}/auth`, // redirect here on failure
      // ['repo', 'user'] // scopes
    );
  };

  // TODO: Implement getUserTeam
  getUserTeam = async (userId: string) => {
    return {
      id: "hod",
      name: "HOD",
    }
  }
}

export const myAppwrite = new MyAppwrite();
