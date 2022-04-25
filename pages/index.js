import MainWrapper from "@/components/MainWrapper";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Главная</title>
      </Head>
      <MainWrapper title={"Главная"}>
        <h1>Signed in as {session?.user?.role}</h1>
      </MainWrapper>
    </>
  );
}
