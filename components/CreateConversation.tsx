"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPenToSquare, FaXmark } from "react-icons/fa6";

const CreateConversation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    console.log(id);
    router.push(`/chat/${id}`);
  };

  const resetModal = () => {
    setId("");
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className="flex items-center gap-2 justify-center bg-blue-700 w-full p-2 rounded-lg text-white font-semibold text-sm">
        <FaPenToSquare />
        Start a conversation
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter the ID of the user
            <FaXmark onClick={resetModal} className="absolute top-0 right-0" />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            <input
              type="text"
              placeholder="ID of the user"
              className="w-full bg-gray-200 shadow-lg p-2 h-10 rounded-lg"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleSubmit}
            className="rounded-xl bg-blue-800 h-10 w-full cursor-pointer"
            disabled={!id}
            type="button"
          >
            Confirm
            {isLoading && (
              <Image
                src={"/assets/icons/loader.svg"}
                alt="lodaer"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateConversation;
