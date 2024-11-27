import { MessageType } from "@/constants";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

type Props = {
  message: MessageType;
  ownerId: string;
};

const MessageBlock = ({ message, ownerId }: Props) => {
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
};

export default MessageBlock;
