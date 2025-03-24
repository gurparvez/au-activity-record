import { Client } from 'appwrite';
import 'dotenv/config'

const projectId = process.env.APPWRITE_PROJECT_ID || ""

console.log(projectId)

const client = new Client();
client.setProject(projectId);
