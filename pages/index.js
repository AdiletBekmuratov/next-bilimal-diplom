import MainWrapper from "@/components/MainWrapper";
import WeatherComponent from "@/components/Weather/WeatherComponent";
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
        <WeatherComponent />
      </MainWrapper>
    </>
  );
}
