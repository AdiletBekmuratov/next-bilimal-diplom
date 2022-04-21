import MainWrapper from "@/components/MainWrapper";
import { useSession } from "next-auth/react";

export default function Home() {
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
