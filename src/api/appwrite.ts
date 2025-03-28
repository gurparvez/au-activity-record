import { Account, Client } from 'appwrite';

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
const apiUrl = import.meta.env.VITE_APPWRITE_API_URL || '';

const client = new Client();
client.setEndpoint(apiUrl).setProject(projectId);

export const account = new Account(client);
export {ID} from 'appwrite';
