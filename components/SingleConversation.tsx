import { MessageType, UserType } from "@/constants";
import { fetchUserById } from "@/lib/actions/user.actions";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  $id: string;
  conversation: MessageType[];
  sidebar: boolean;
};

const SingleConversation = async ({ $id, conversation, sidebar }: Props) => {
  const firstConversation = conversation[0];

  const notCurrentUserId =
    firstConversation.receiverId === $id
      ? firstConversation.senderId.$id
      : firstConversation.receiverId;

  const notCurrentUser: UserType = await fetchUserById(notCurrentUserId);

  const formatDateToNow = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: enUS,
    });
  };

  return (
    <Link
      className="flex flex-col gap-3 w-full p-3 rounded-lg shadow-sm bg-blue-100 relative"
      href={`/chat/${notCurrentUserId}`}
    >
      <section className="flex items-center gap-3">
        <Image
          src={notCurrentUser.avatar}
          width={40}
          height={40}
          alt="user avatar"
          className="rounded-full"
        />
        <div className={clsx("block", sidebar && "hidden lg:block")}>
          <h3 className="text-md font-semibold">{notCurrentUser.fullName}</h3>
          <p className="text-sm">
            {firstConversation.receiverId === $id
              ? `${notCurrentUser.fullName} : `
              : "Vous : "}{" "}
            {firstConversation.body}
          </p>
        </div>
      </section>
      <small
        className={clsx(
          "text-[10px] absolute top-2 right-3 text-gray-600 block",
          sidebar && "hidden lg:block"
        )}
      >
        {formatDateToNow(firstConversation.$createdAt)}
      </small>
    </Link>
  );
};

export default SingleConversation;
