import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/context/UserContext";
import { fetchCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await fetchCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <UserProvider currentUser={user}>
      <div className="flex min-h-screen">
        <Sidebar {...user} />
        <main className="flex-1">{children}</main>
        <Toaster />
      </div>
    </UserProvider>
  );
};

export default Layout;
