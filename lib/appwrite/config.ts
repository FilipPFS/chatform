export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  messagesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION!,
  secretKey: process.env.NEXT_APPWRITE_SECRET!,
};