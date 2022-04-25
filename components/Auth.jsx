import useAuth from "@/hooks/useAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Loader from "./Loader";

export default function Auth({ children, role }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  useAuth(true);

  React.useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role !== "ADMIN" && role !== session?.user?.role) {
      router.replace("/");
    }
  }, [session, status]);

  if (session?.user) {
    return children;
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Loader />
    </div>
  );
}
