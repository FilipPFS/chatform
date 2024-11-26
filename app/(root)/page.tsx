import CreateConversation from "@/components/CreateConversation";
import Image from "next/image";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Image
        src={"/images/logo-blue.png"}
        alt="logo blue"
        width={250}
        height={250}
      />
      <div>
        <CreateConversation />
      </div>
    </div>
  );
};

export default Home;
