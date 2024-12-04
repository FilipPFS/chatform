"use client";

import { MessageType, UserType } from "@/constants";
import {
  blockUser,
  fetchUserById,
  unblockUser,
} from "@/lib/actions/user.actions";
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
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const { currentUser } = useUser();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;
  const [user, setUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const ownerId = currentUser!.$id;
  const [sessionUserBlocked, setSessionUserBlocked] = useState<boolean | null>(
    null
  );

  const isBlocked =
    currentUser!.blockedUsers.length > 0 &&
    currentUser!.blockedUsers.includes(id);

  if (id === ownerId) {
    throw new Error("You can not message yourself.");
  }

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUser: UserType = await fetchUserById(id);
      const allMessages = await fetchMessagesWithUser({ ownerId, id });

      if (
        fetchedUser.blockedUsers.length > 0 &&
        fetchedUser.blockedUsers.includes(ownerId)
      ) {
        setSessionUserBlocked(true);
      }

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
          console.log(event.payload);
          if (
            (event.payload.receiverId === id &&
              event.payload.senderId.$id === ownerId) ||
            (event.payload.receiverId === ownerId &&
              event.payload.senderId.$id === id)
          ) {
            setMessages((prev) => [...prev, event.payload]);
          }
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

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.usersCollectionId}.documents`,
      (event: RealtimeResponseEvent<UserType>) => {
        if (
          event.events.includes("databases.*.collections.*.documents.*.update")
        ) {
          const updatedUser = event.payload;

          console.log(updatedUser);

          if (
            updatedUser.blockedUsers.length > 0 &&
            updatedUser.blockedUsers.includes(ownerId) &&
            updatedUser.$id === id
          ) {
            setSessionUserBlocked(true);
          } else {
            setSessionUserBlocked(false);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [client, ownerId]);

  const handleBlockUser = async () => {
    if (!isBlocked) {
      const blockedUser = await blockUser(id);

      if (blockedUser) {
        toast({
          description: <p>{blockedUser.message}</p>,
        });
      }
    } else {
      const unblockedUser = await unblockUser(id);

      if (unblockedUser) {
        toast({
          description: <p>{unblockedUser.message}</p>,
        });
      }
    }
  };

  return (
    <div className="flex flex-col sm:min-h-screen min-h-[calc(100vh-80px)] max-h-screen sm:p-4 sm:gap-5 overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-4 py-5 sm:px-0 sm:py-0">
        {user && (
          <>
            <div className="flex gap-3 items-center">
              <Image
                src={user.avatar}
                alt="user avatar"
                width={50}
                height={50}
                className="rounded-full"
              />
              <h2 className="text-xl font-semibold">{user.fullName}</h2>
            </div>
            <button
              onClick={handleBlockUser}
              className={clsx(
                "px-5 py-2 rounded-md text-white font-semibold",
                isBlocked
                  ? "bg-gray-500 hover:bg-gray-600 active:bg-gray-700"
                  : "bg-red-600 hover:bg-red-700 active:bg-red-800"
              )}
            >
              {isBlocked ? "Unblock" : "Block"}
            </button>
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
        {isBlocked ? (
          <div>This user is blocked.</div>
        ) : sessionUserBlocked ? (
          <div>You are blocked</div>
        ) : (
          <CreateMessageForm ownerId={ownerId} id={id} />
        )}
      </section>
    </div>
  );
};

export default Chat;
