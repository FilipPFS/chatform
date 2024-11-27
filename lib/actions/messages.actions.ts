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
import { parseStringify } from "../utils";

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
      }
    );

    return parseStringify({ message: "New message added." });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};
