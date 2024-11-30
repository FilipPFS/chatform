"use client";

import { MessageType, UserType } from "@/constants";
import { fetchUserById } from "@/lib/actions/user.actions";
import { appwriteConfig } from "@/lib/appwrite/config";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import client from "@/lib/appwrite/client";
import { useUser } from "@/context/UserContext";
import { fetchMessagesWithUser } from "@/lib/actions/messages.actions";
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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
        console.log(event);

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
    <div className="flex flex-col sm:min-h-screen min-h-[calc(100vh-80px)] max-h-screen sm:p-4 sm:gap-5 overflow-hidden">
      <header className="flex items-center gap-3 px-4 py-5 sm:px-0 sm:py-0">
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
      <section className="bg-blue-100 flex-1 flex flex-col rounded-sm p-4 overflow-auto">
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto remove-scrollbar">
          {messages.map((message) => (
            <MessageBlock
              key={message.$id}
              message={message}
              ownerId={ownerId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <CreateMessageForm ownerId={ownerId} id={id} />
      </section>
    </div>
  );
};

export default Chat;
