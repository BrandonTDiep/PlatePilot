import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  // Block rendering until the session has been fetched.
  const { data, status } = useSession();

  return { 
    user: data?.user, 
    status 
  };
};