import MainWrapper from "@/components/MainWrapper";
import NewsCard from "@/components/NewsCard";
import { getNews } from "@/helpers/requests";
import { getSession } from "next-auth/react";
import Head from "next/head";

const Home = ({ news }) => {
  return (
    <>
      <Head>
        <title>Главная</title>
      </Head>
      <MainWrapper title={"Главная"}>
        <div className="flex flex-col space-y-4">
          <h2>Новости</h2>
          {news.map((newsItem) => (
            <NewsCard
              title={newsItem?.title}
              body={newsItem?.body}
              date_created={newsItem?.date_created}
            />
          ))}
        </div>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const news = await getNews(session?.user?.accessToken);
  return { props: { news } };
}

Home.auth = {
  auth: "required",
};

export default Home;
