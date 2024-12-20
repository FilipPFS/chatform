import ChangeAvatar from "@/components/ChangeAvatar";
import CopyId from "@/components/CopyId";
import SingOutButton from "@/components/SingOutButton";
import { UserType } from "@/constants";
import { fetchCurrentUser } from "@/lib/actions/user.actions";
import React from "react";

const MyAccount = async () => {
  const account: UserType = await fetchCurrentUser();

  return (
    <div>
      <section className="p-5 bg-blue-100">
        <ChangeAvatar avatar={account.avatar} />
      </section>
      <section className="p-5 flex flex-col gap-3">
        <h1 className="text-2xl">Personal Information</h1>
        <p>
          Fullname: <span className="text-gray-600">{account.fullName}</span>
        </p>
        <p>
          Email: <span className="text-gray-600">{account.email}</span>
        </p>
        <div className="flex items-center gap-3">
          ID: <CopyId id={account.$id} isAccountPage={true} />
        </div>
      </section>
      <section className="p-5 flex flex-col gap-3 w-full sm:w-[300px]">
        <SingOutButton />
      </section>
    </div>
  );
};

export default MyAccount;
