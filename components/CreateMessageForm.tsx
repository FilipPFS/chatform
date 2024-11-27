"use client";

import { createNewMessage } from "@/lib/actions/messages.actions";
import React, { useState } from "react";

type Props = {
  ownerId: string;
  id: string;
};

const CreateMessageForm = ({ ownerId, id }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      await createNewMessage({ newMessage, ownerId, id });
      setNewMessage("");
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-auto flex items-center gap-4 pt-4"
    >
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Write your message..."
        className="w-full rounded-full h-10 px-4"
      />
      <button
        type="submit"
        className="rounded-full h-10 px-7 text-white font-semibold bg-blue-600"
      >
        Send
      </button>
    </form>
  );
};

export default CreateMessageForm;
