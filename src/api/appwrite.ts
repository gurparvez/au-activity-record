import { rootUrl } from '@/constants';
import { Account, Client, OAuthProvider } from 'appwrite';

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
const apiUrl = import.meta.env.VITE_APPWRITE_API_URL || '';

const client = new Client();
client.setEndpoint(apiUrl).setProject(projectId);

export const account = new Account(client);
export { ID } from 'appwrite';

export const loginWithGoogle = () => {
  account.createOAuth2Session(
    OAuthProvider.Google,
    rootUrl, // redirect here on success
    rootUrl, // redirect here on failure
    // ['repo', 'user'] // scopes
  );
};
