import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const useSessionCheck = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ redirect: true, callbackUrl: "/login" }); // Force sign out
    }
  }, [session]);

  return { session, status };
};

export default useSessionCheck;
