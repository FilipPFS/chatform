import Image from "next/image";
import { FaCopy } from "react-icons/fa6";
import CreateConversation from "./CreateConversation";
import CopyId from "./CopyId";

type Props = {
  fullName: string;
  $id: string;
  avatar: string;
};

const Sidebar = ({ fullName, $id, avatar }: Props) => {
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
    </div>
  );
};

export default Sidebar;
