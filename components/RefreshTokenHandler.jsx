import useAuth from "@/hooks/useAuth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const RefreshTokenHandler = (props) => {
  const { data: session } = useSession();
  useAuth(true);
  useEffect(() => {
    if (!!session) {
      // We did set the token to be ready to refresh after 23 hours, here we set interval of 23 hours 30 minutes.
      const timeRemaining = Math.round(
        (session.expires - 3 * 60 * 1000 - Date.now()) / 1000
      );
      props.setInterval(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [session]);

  return null;
};

export default RefreshTokenHandler;
