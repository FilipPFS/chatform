import { signOutUser } from "@/lib/actions/user.actions";
import React from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";

const SingOutButton = () => {
  return (
    <form action={signOutUser} className="w-full mt-auto">
      <button
        type="submit"
        className="text-white bg-gray-700 hover:bg-gray-800 active:bg-gray-900 p-2 w-full font-semibold rounded-md flex gap-3 justify-center items-center"
      >
        <FaArrowRightFromBracket />
        Sign Out
      </button>
    </form>
  );
};

export default SingOutButton;
