"use client";

import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";
import { FaCheckCircle, FaCopy } from "react-icons/fa";

const CopyId = ({
  id,
  isAccountPage,
}: {
  id: string;
  isAccountPage?: boolean;
}) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast({
          description: (
            <p className="flex items-center gap-2">
              <FaCheckCircle /> ID Copied to clipboard
            </p>
          ),
        });
      },
      (err) => {
        toast({
          description: "Failed to copy ID. Please try again.",
          variant: "destructive",
        });
        console.error("Copy failed: ", err);
      }
    );
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-1 bg-gray-300 rounded-md w-fit px-2 py-1",
        !isAccountPage && "hidden lg:flex"
      )}
    >
      {!isAccountPage && <p className="text-[10px]">ID :</p>}
      <p className="truncate text-[10px]">{id}</p>
      <FaCopy
        className="text-[10px] ml-2 cursor-pointer"
        onClick={copyToClipboard}
      />
    </div>
  );
};

export default CopyId;
