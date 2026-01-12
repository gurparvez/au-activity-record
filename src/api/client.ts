import { Account, Client, Databases, Functions } from 'appwrite';

// Environment variable validation
const APPWRITE_API_URL = import.meta.env.VITE_APPWRITE_API_URL;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!APPWRITE_API_URL) {
  throw new Error('VITE_APPWRITE_API_URL environment variable is required');
}
if (!APPWRITE_PROJECT_ID) {
  throw new Error('VITE_APPWRITE_PROJECT_ID environment variable is required');
}

// Appwrite client instance
const client = new Client();
client.setEndpoint(APPWRITE_API_URL).setProject(APPWRITE_PROJECT_ID);

// Appwrite service instances
export const db = new Databases(client);
export const account = new Account(client);
export const functions = new Functions(client);

// Database configuration
export const config = {
  DB_ID: import.meta.env.VITE_DATABASE_ID || '',
  USER_COLLECTION_ID: import.meta.env.VITE_USER_COLLECTION_ID || '',
  DEPARTMENT_COLLECTION_ID: import.meta.env.VITE_DEPARTMENT_COLLECTION_ID || '',
  ACTIVITIES_COLLECTION_ID: import.meta.env.VITE_ACTIVITIES_COLLECTION_ID || '',
  CONFIRMATION_COLLECTION_ID: import.meta.env.VITE_CONFIRMATION_COLLECTION_ID || '',
} as const;
