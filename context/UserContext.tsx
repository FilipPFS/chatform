"use client";

import { UserType } from "@/constants";
import { createContext, ReactNode, useContext } from "react";

interface UserContextType {
  currentUser: UserType | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export const UserProvider = ({
  currentUser,
  children,
}: {
  currentUser: UserType | null;
  children: ReactNode;
}) => {
  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
};
