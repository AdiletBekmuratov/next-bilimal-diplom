import Loader from "@/components/Loader";
import MainWrapper from "@/components/MainWrapper";
import QuizCard from "@/components/QuizCard";
import { getQuizzes } from "@/helpers/requests";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { useQuery } from "react-query";

const Quizzes = ({ quizzes }) => {
  const { data: session, status } = useSession();

  const { data, isLoading, error } = useQuery(
    "quizzes",
    () =>
      getQuizzes(
        session?.user?.groupId,
        session?.user?.id,
        session?.user?.accessToken
      ),
    {
      initialData: quizzes,
    }
  );

  return (
    <>
      <Head>
        <title>Тесты</title>
      </Head>
      <MainWrapper title={"Тесты"}>
        {isLoading ? (
          <div className="flex justify-center items-center flex-1 h-full">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 items-start">
            {data.map((quiz) => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
                groups={quiz.groups}
                startDate={quiz.startDate}
                endDate={quiz.endDate}
                slug={quiz.slug}
                questions={quiz?.questions_func?.count}
                highScore={quiz?.scores?.at(0)?.score}
              />
            ))}
          </div>
        )}
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const quizzes = await getQuizzes(
    session?.user?.groupId,
    session?.user?.id,
    session?.user?.accessToken
  );
  return { props: { quizzes } };
}

Quizzes.auth = {
  role: "STUDENT",
};


export default Quizzes;
