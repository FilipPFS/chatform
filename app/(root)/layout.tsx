import { fetchCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await fetchCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <div>{children}</div>;
};

export default Layout;
