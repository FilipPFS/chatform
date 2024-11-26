import { Client, Databases } from "appwrite";
import { appwriteConfig } from "./config";

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId);

export const databases = new Databases(client);
export default client;
