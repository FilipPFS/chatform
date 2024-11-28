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
import SingleConversation from "./SingleConversation";

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
    <div className="bg-custom-gradient lg:w-1/4 py-4 px-5 hidden sm:flex flex-col gap-3 items-center">
      <CreateConversation itemVisible={false} />
      <section className="bg-white p-3 rounded-xl w-full flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Image
            src={avatar}
            width={40}
            height={40}
            alt="avatar"
            className="rounded-full"
          />
          <h2 className="truncate hidden lg:block">{fullName}</h2>
        </div>
        <CopyId id={$id} />
      </section>
      <section className="flex flex-col gap-4 w-full ">
        {conversations.map(async (conversation) => {
          return (
            <SingleConversation
              sidebar={true}
              conversation={conversation}
              $id={$id}
            />
          );
        })}
      </section>
    </div>
  );
};

export default Sidebar;
