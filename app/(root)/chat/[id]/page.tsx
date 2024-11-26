"use client";

import { UserType } from "@/constants";
import { fetchUserById } from "@/lib/actions/user.actions";
import { appwriteConfig } from "@/lib/appwrite/config";
import Image from "next/image";
import { ID, Query } from "appwrite";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import client, { databases } from "@/lib/appwrite/client";
import { useUser } from "@/context/UserContext";
import clsx from "clsx";

const Chat = () => {
  const { currentUser } = useUser();
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const ownerId = currentUser!.$id;

  if (id === ownerId) {
    throw new Error("You can not message yourself.");
  }

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUser: UserType = await fetchUserById(id);

      setUser(fetchedUser);

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
      setMessages(allMessages);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
      (event) => {
        if (
          event.events.includes("databases.*.collections.*.documents.*.create")
        ) {
          setMessages((prev) => [...prev, event.payload]);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.messagesCollectionId,
        ID.unique(),
        {
          body: newMessage,
          senderId: ownerId,
          receiverId: id,
        }
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  return (
    <div className="flex p-5 flex-col min-h-screen gap-5">
      <header className="flex items-center gap-3">
        {user && (
          <>
            <Image
              src={user.avatar}
              alt="user avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
            <h2 className="text-xl font-semibold">{user.fullName}</h2>
          </>
        )}
      </header>
      <section className="bg-blue-100 overflow-hidden flex-1 flex flex-col rounded-sm p-4">
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {messages.map((message) => {
            console.log(message);

            return (
              <div
                key={message.$id}
                className={clsx(
                  "flex items-center gap-2",
                  message.senderId.$id === ownerId && "ml-auto"
                )}
              >
                <Image
                  src={message.senderId.avatar}
                  alt="user avatar"
                  width={40}
                  height={40}
                  className={clsx(
                    "rounded-full",
                    message.senderId.$id === ownerId && "order-2"
                  )}
                />
                <p
                  className={clsx(
                    "rounded-full py-1 px-3",
                    message.senderId.$id === ownerId
                      ? "bg-blue-200 order-1"
                      : "bg-gray-200"
                  )}
                >
                  {message.body}
                </p>
              </div>
            );
          })}
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-auto flex items-center gap-4 pt-4"
        >
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full rounded-full h-10 px-4"
          />
          <button
            type="submit"
            className="rounded-full h-10 px-7 text-white font-semibold bg-blue-600"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
};

export default Chat;
