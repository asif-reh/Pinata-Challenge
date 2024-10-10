import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);

export { client };