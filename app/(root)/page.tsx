import CreateConversation from "@/components/CreateConversation";
import SearchForm from "@/components/SearchForm";
import SingleConversation from "@/components/SingleConversation";
import {
  fetchConversations,
  groupConversationsByParticipants,
} from "@/lib/actions/messages.actions";
import { fetchCurrentUser } from "@/lib/actions/user.actions";
import Image from "next/image";

type Props = {};

const Home = async (props: Props) => {
  const currentUser = await fetchCurrentUser();
  const messages = await fetchConversations(currentUser.$id);
  const conversations = await groupConversationsByParticipants({
    messages,
  });

  return (
    <>
      <div className="hidden sm:flex flex-col justify-center items-center min-h-screen">
        <Image
          src={"/images/logo-blue.png"}
          alt="logo blue"
          width={250}
          height={250}
        />
        <div>
          <CreateConversation itemVisible={true} />
        </div>
      </div>
      <div className="sm:hidden flex flex-col sm:min-h-screen min-h-[calc(100vh-80px)] p-4 gap-5">
        <section className="flex gap-4 items-center justify-between h-10">
          <SearchForm />
          <div>
            <CreateConversation itemVisible={false} />
          </div>
        </section>
        <section className="flex flex-col gap-4 w-full ">
          {conversations.map(async (conversation) => {
            return (
              <SingleConversation
                conversation={conversation}
                $id={currentUser.$id}
                sidebar={false}
              />
            );
          })}
        </section>
      </div>
    </>
  );
};

export default Home;
