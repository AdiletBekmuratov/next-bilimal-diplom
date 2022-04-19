import useAuth from "@/hooks/useAuth";
import { useSession } from "next-auth/react";
import MainWrapper from "@/components/MainWrapper";

export default function Home() {
  useAuth(true);
  const { data: session, status } = useSession();

  return (
    <>
      <MainWrapper title={"Главная"}>
        <h1>
          Signed in as{" "}
          {session?.user?.firstName + " " + session?.user?.lastName}
        </h1>{" "}
      </MainWrapper>
    </>
  );
}
