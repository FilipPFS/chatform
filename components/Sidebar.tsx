import Image from "next/image";
import CreateConversation from "./CreateConversation";
import CopyId from "./CopyId";
import {
  fetchConversations,
  groupConversationsByParticipants,
} from "@/lib/actions/messages.actions";
import { MessageType, UserType } from "@/constants";
import Link from "next/link";
import { fetchUserById } from "@/lib/actions/user.actions";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

type Props = {
  fullName: string;
  $id: string;
  avatar: string;
};

const Sidebar = async ({ fullName, $id, avatar }: Props) => {
  const messages: MessageType[] = await fetchConversations($id);

  const conversations = await groupConversationsByParticipants({
    messages,
  });

  return (
    <div className="bg-custom-gradient w-1/4 py-4 px-5 flex flex-col gap-3 items-center">
      <CreateConversation />
      <section className="bg-white p-2 rounded-xl w-full flex flex-col pl-4 gap-2">
        <div className="flex items-center gap-2">
          <Image
            src={avatar}
            width={40}
            height={40}
            alt="avatar"
            className="rounded-full"
          />
          <h2 className="truncate">{fullName}</h2>
        </div>
        <CopyId id={$id} />
      </section>
      <section className="flex flex-col gap-4 w-full">
        {conversations.map(async (conversation) => {
          const firstConversation = conversation[0];

          const notCurrentUserId =
            firstConversation.receiverId === $id
              ? firstConversation.senderId.$id
              : firstConversation.receiverId;

          const notCurrentUser: UserType = await fetchUserById(
            notCurrentUserId
          );

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
                <div>
                  <h3 className="text-md font-semibold">
                    {notCurrentUser.fullName}
                  </h3>
                  <p className="text-sm">
                    {firstConversation.receiverId === $id
                      ? `${notCurrentUser.fullName} : `
                      : "Vous : "}{" "}
                    {firstConversation.body}
                  </p>
                </div>
              </section>
              <small className="text-[10px] absolute top-2 right-3 text-gray-600">
                {formatDateToNow(firstConversation.$createdAt)}
              </small>
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export default Sidebar;
