import MainWrapper from "@/components/MainWrapper";
import WeatherComponent from "@/components/Weather/WeatherComponent";
import Head from "next/head";

const Home = () => {
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
};

Home.auth = {
  auth: "required",
};

export default Home;
