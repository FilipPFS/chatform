"use client";

import { MessageType } from "@/constants";
import { useUser } from "@/context/UserContext";
import { deleteMessage } from "@/lib/actions/messages.actions";
import clsx from "clsx";
import Image from "next/image";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import OpenImage from "./OpenImage";

type Props = {
  message: MessageType;
  ownerId: string;
};

const MessageBlock = ({ message, ownerId }: Props) => {
  const { currentUser } = useUser();
  const [clicked, setClicked] = useState(false);
  const [imgClicked, setImgClicked] = useState(false);
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
      <div
        className={clsx(
          "flex flex-col gap-2",
          message.senderId.$id === ownerId ? "items-end" : "items-start"
        )}
        onClick={() => setClicked((prev) => !prev)}
      >
        {message.body && (
          <p
            className={clsx(
              "rounded-full py-1 px-5 relative",
              message.senderId.$id === ownerId
                ? "bg-blue-200 text-right"
                : "bg-gray-200 text-left"
            )}
          >
            {message.body}
            {clicked && (
              <>
                {isOwner && !message.imageUrl && (
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
        )}
        {message.imageUrl && (
          <div className="relative">
            <Image
              src={message.imageUrl}
              onClick={() => setImgClicked(true)}
              alt="chat attachment"
              width={200}
              height={200}
              className={clsx(
                "rounded-md",
                message.senderId.$id === ownerId ? "bg-blue-200" : "bg-gray-200"
              )}
            />
            {clicked && (
              <>
                {isOwner && (
                  <button
                    className="text-red-600 text-[10px] z-10 flex items-center gap-1 absolute right-0 pt-1 pl-4"
                    onClick={() => handleSubmit(message.$id)}
                  >
                    <FaTrash /> Delete
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {imgClicked && (
        <OpenImage url={message.imageUrl} setImgClicked={setImgClicked} />
      )}
    </div>
  );
};

export default MessageBlock;
