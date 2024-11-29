"use client";

import { MessageType } from "@/constants";
import { useUser } from "@/context/UserContext";
import { deleteMessage } from "@/lib/actions/messages.actions";
import clsx from "clsx";
import Image from "next/image";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";

type Props = {
  message: MessageType;
  ownerId: string;
};

const MessageBlock = ({ message, ownerId }: Props) => {
  const { currentUser } = useUser();
  const [clicked, setClicked] = useState(false);
  const isOwner = currentUser!.$id === message.senderId.$id;

  const handleSubmit = async (messageId: string) => {
    try {
      const response = await deleteMessage(messageId);
    } catch (error) {
      console.log(error);
    }
  };

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
        onClick={() => setClicked((prev) => !prev)}
        className={clsx(
          "rounded-full py-1 px-3 text-center relative",
          message.senderId.$id === ownerId
            ? "bg-blue-200 order-1"
            : "bg-gray-200"
        )}
      >
        {message.body}
        {clicked && (
          <>
            {isOwner && (
              <button
                className="text-red-600 text-[10px] flex items-center gap-1 absolute right-0 pt-2 pl-4"
                onClick={() => handleSubmit(message.$id)}
              >
                <FaTrash /> Delete
              </button>
            )}
          </>
        )}
      </p>
    </div>
  );
};

export default MessageBlock;
