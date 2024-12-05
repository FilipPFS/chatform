"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { avatarUrl } from "@/constants";
import { constructFileUrl, parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });

  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarUrl,
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found." });
  } catch (error) {
    handleError(error, "Failed to sing out user");
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sing out user");
  } finally {
    redirect("/sign-in");
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const fetchCurrentUser = async () => {
  const { account, databases } = await createSessionClient();

  try {
    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    handleError(error, "Failed to fetch user.");
  }
};

export const fetchUserById = async (id: string) => {
  const { databases } = await createSessionClient();

  try {
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("$id", id)]
    );

    if (user.total <= 0) {
      redirect("/");
    }

    return parseStringify(user.documents[0]);
  } catch (error) {
    handleError(error, "Failed to fetch user.");
  }
};

export const updateAvatar = async (file: File) => {
  const { databases, storage } = await createAdminClient();
  const sessionUser = await fetchCurrentUser();

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );

    const fileUrl = constructFileUrl(uploadedFile.$id);

    if (!fileUrl) throw new Error("File Url doesn't exist.");

    const newAvatar = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      sessionUser.$id,
      {
        avatar: fileUrl,
      }
    );

    revalidatePath("/my-account", "layout");

    return { message: "Avatar updated successfully." };
  } catch (error) {
    handleError(error, "Failed to fetch user.");
  }
};

export const blockUser = async (userId: string) => {
  const { databases } = await createAdminClient();
  const sessionUser = await fetchCurrentUser();

  try {
    const blockUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      sessionUser.$id,
      {
        blockedUsers: [...sessionUser.blockedUsers, userId],
      }
    );

    revalidatePath("/chat/*", "layout");

    return { message: "User blocked successfully." };
  } catch (error) {
    handleError(error, "Failed to fetch user.");
  }
};

export const unblockUser = async (userId: string) => {
  const { databases } = await createAdminClient();
  const sessionUser = await fetchCurrentUser();

  try {
    const newBlockedUsers = sessionUser.blockedUsers.filter(
      (blockedId: string) => blockedId !== userId
    );

    const blockUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      sessionUser.$id,
      {
        blockedUsers: newBlockedUsers,
      }
    );

    revalidatePath("/chat/*", "layout");

    return { message: "User unblocked successfully." };
  } catch (error) {
    handleError(error, "Failed to fetch user.");
  }
};
