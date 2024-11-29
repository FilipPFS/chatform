"use client";

import { useToast } from "@/hooks/use-toast";
import { updateAvatar } from "@/lib/actions/user.actions";
import Image from "next/image";
import { useState } from "react";
import { FaImage } from "react-icons/fa6";

const ChangeAvatar = ({ avatar }: { avatar: string }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>(avatar);
  const [isLoading, setIsLoading] = useState(false);
  const [previewHover, setPreviewHover] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);

      const fileUrl = URL.createObjectURL(selectedFile);
      setFileUrl(fileUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!file) throw new Error("No file provided.");
      const response = await updateAvatar(file);

      if (response) {
        setIsLoading(false);
        setFile(null);
        toast({
          description: <p>{response?.message}</p>,
        });
      }
    } catch (error) {
      toast({
        description: <p>Error occured. Please try again.</p>,
        variant: "destructive",
      });
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-center">
      <div
        className="relative w-fit cursor-pointer"
        onMouseEnter={() => setPreviewHover(true)}
        onMouseLeave={() => setPreviewHover(false)}
      >
        <label htmlFor="avatar">
          <Image
            src={fileUrl}
            alt="user avatar"
            width={160}
            height={160}
            className="size-40 object-cover rounded-full"
          />
          {previewHover && (
            <div className="absolute cursor-pointer flex justify-center items-center z-10 top-0 left-0 w-full rounded-full h-full bg-black bg-opacity-50">
              <FaImage className="text-6xl text-white" />
            </div>
          )}
        </label>
      </div>
      <input
        type="file"
        name="avatar"
        id="avatar"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-sm cursor-pointer text-white px-6 py-2 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isLoading || !file}
      >
        Change
        {isLoading && (
          <Image
            src={"/assets/icons/loader.svg"}
            width={24}
            height={24}
            alt="loader"
            className="ml-2 animate-spin"
          />
        )}
      </button>
    </form>
  );
};

export default ChangeAvatar;
