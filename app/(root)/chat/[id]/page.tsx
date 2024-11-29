"use client";

import { MessageType, UserType } from "@/constants";
import { fetchUserById } from "@/lib/actions/user.actions";
import { appwriteConfig } from "@/lib/appwrite/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import client, { databases } from "@/lib/appwrite/client";
import { useUser } from "@/context/UserContext";
import {
  createNewMessage,
  fetchMessagesWithUser,
} from "@/lib/actions/messages.actions";
import MessageBlock from "@/components/MessageBlock";
import CreateMessageForm from "@/components/CreateMessageForm";
import { RealtimeResponseEvent } from "appwrite";

const Chat = () => {
  const { currentUser } = useUser();
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const ownerId = currentUser!.$id;

  if (id === ownerId) {
    throw new Error("You can not message yourself.");
  }

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUser: UserType = await fetchUserById(id);
      const allMessages = await fetchMessagesWithUser({ ownerId, id });

      setUser(fetchedUser);
      setMessages(allMessages);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
      (event: RealtimeResponseEvent<MessageType>) => {
        if (
          event.events.includes("databases.*.collections.*.documents.*.create")
        ) {
          setMessages((prev) => [...prev, event.payload]);
        } else if (
          event.events.includes("databases.*.collections.*.documents.*.delete")
        ) {
          setMessages((prev) =>
            prev.filter((message) => message.$id !== event.payload.$id)
          );
        }
      }
    );

    return () => unsubscribe();
  }, [client, appwriteConfig.databaseId, appwriteConfig.messagesCollectionId]);

  return (
    <div className="flex flex-col sm:min-h-screen min-h-[calc(100vh-80px)] p-4 gap-5">
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
      <section className="bg-blue-100 flex-1 flex flex-col rounded-sm p-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {messages.map((message) => (
            <MessageBlock
              key={message.$id}
              message={message}
              ownerId={ownerId}
            />
          ))}
        </div>
        <CreateMessageForm ownerId={ownerId} id={id} />
      </section>
    </div>
  );
};

export default Chat;
