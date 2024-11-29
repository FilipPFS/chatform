"use client";

import { useToast } from "@/hooks/use-toast";
import { createNewMessage, updloadFile } from "@/lib/actions/messages.actions";
import Image from "next/image";
import React, { useState } from "react";
import { FaImage, FaPaperPlane, FaXmark } from "react-icons/fa6";

type Props = {
  ownerId: string;
  id: string;
};

const CreateMessageForm = ({ ownerId, id }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);

      const fileUrl = URL.createObjectURL(selectedFile);
      setFileUrl(fileUrl);
    }
  };

  const resetImage = () => {
    setFile(null);
    setFileUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage && !file) {
      toast({
        description: <p>Please provide an image or a text.</p>,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    let imageUrl: string | null = null;

    // if (!newMessage.trim()) return;

    try {
      if (file) {
        imageUrl = await updloadFile(file);
      }

      await createNewMessage({ newMessage, ownerId, id, imageUrl });
      setNewMessage("");
      resetImage();
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-auto flex items-center gap-2 sm:gap-4 pt-4"
      >
        <div className="w-full relative">
          <label
            htmlFor="image"
            className="absolute right-8 top-1/2 translate-x-1/2 -translate-y-1/2"
          >
            <FaImage />
          </label>
          <input
            type="file"
            accept="image*/"
            id="image"
            name="image"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full rounded-full h-10 px-4"
          />
          {fileUrl && (
            <div className="absolute flex items-center left-0 -top-[88px] h-20 w-full bg-white pl-9 py-2 rounded-full">
              <Image
                alt={"user attach"}
                src={fileUrl}
                width={60}
                height={60}
                className="max-h-full max-w-full object-contain"
              />
              <FaXmark onClick={resetImage} className="cursor-pointer" />
            </div>
          )}
        </div>
        <button
          disabled={isLoading}
          type="submit"
          className="rounded-full h-10 w-10 sm:w-fit flex items-center justify-center px-7 text-white font-semibold bg-blue-600"
        >
          <p className="sm:block hidden">Send</p>
          {isLoading && (
            <Image
              src={"/assets/icons/loader.svg"}
              width={24}
              height={24}
              alt="loader"
              className="ml-2 animate-spin"
            />
          )}
          <p className="sm:hidden block">
            <FaPaperPlane />
          </p>
        </button>
      </form>
    </>
  );
};

export default CreateMessageForm;
