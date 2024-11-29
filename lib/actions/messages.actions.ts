"use server";

import { Databases, ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import {
  Conversations,
  GroupedMessages,
  MessageType,
  NewMessage,
} from "@/constants";
import { constructFileUrl, extractFileId, parseStringify } from "../utils";
import { fetchCurrentUser } from "./user.actions";

const handleError = (error: unknown, message: string) => {
  console.log(error);
  throw error;
};

export const fetchConversations = async (currentUserId: string) => {
  const { databases } = await createAdminClient();
  try {
    const conversations = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [
        Query.or([
          Query.equal("senderId", [currentUserId]),
          Query.contains("receiverId", [currentUserId]),
        ]),
      ]
    );

    return conversations.documents as MessageType[];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export const groupConversationsByParticipants = async ({
  messages,
}: Conversations) => {
  const groupedMessages: GroupedMessages = {};

  messages.forEach((message) => {
    const key = [message.senderId.$id, message.receiverId].sort().join("_");

    if (!groupedMessages[key]) {
      groupedMessages[key] = [];
    }

    groupedMessages[key].push(message);
  });

  Object.keys(groupedMessages).forEach((key) => {
    groupedMessages[key].reverse();
  });

  return Object.values(groupedMessages); // Convert grouped conversations back to an array
};

export const fetchMessagesWithUser = async ({
  ownerId,
  id,
}: {
  ownerId: string;
  id: string;
}) => {
  const { databases } = await createAdminClient();
  try {
    const messagesFromOwnerToUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("senderId", ownerId), Query.equal("receiverId", id)]
    );

    const messagesFromUserToOwner = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("senderId", id), Query.equal("receiverId", ownerId)]
    );

    const allMessages = [
      ...messagesFromOwnerToUser.documents,
      ...messagesFromUserToOwner.documents,
    ].sort(
      (a, b) =>
        new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
    );

    return parseStringify(allMessages);
  } catch (error) {
    console.log(error);
  }
};

export const createNewMessage = async ({
  newMessage,
  ownerId,
  id,
  imageUrl,
}: NewMessage) => {
  const { databases } = await createAdminClient();
  try {
    const message = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        body: newMessage,
        senderId: ownerId,
        receiverId: id,
        imageUrl,
      }
    );

    return parseStringify({ message: "New message added." });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export const deleteMessage = async (messageId: string) => {
  const { databases, storage } = await createAdminClient();
  try {
    const messageInDb = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("$id", messageId)]
    );

    if (!messageInDb) throw new Error("Message with that ID doesn't exist.");

    if (messageInDb.documents[0].imageUrl) {
      const bucketFileId = extractFileId(messageInDb.documents[0].imageUrl);

      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }

    const message = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId
    );

    return parseStringify({ message: "Message deleted." });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return;
  }
};

export const updloadFile = async (file: File) => {
  const { storage } = await createAdminClient();

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );

    const fileUrl = constructFileUrl(uploadedFile.$id);

    if (!fileUrl) throw new Error("File Url doesn't exist.");

    return fileUrl;
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};
