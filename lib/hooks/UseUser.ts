import { getSession } from "next-auth/react";

export const useUser = async () => {
  const session = await getSession();
  return session?.user;
};
