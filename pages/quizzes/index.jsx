import Loader from "@/components/Loader";
import MainWrapper from "@/components/MainWrapper";
import QuizCard from "@/components/QuizCard";
import { getQuizzes } from "@/helpers/requests";
import { Stack } from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import React from "react";
import { useQuery } from "react-query";

const Quizzes = ({ quizzes }) => {
  const { data: session, status } = useSession();

  // const { data, isLoading, error } = useQuery(
  //   "quizzes",
  //   () =>
  //     getQuizzes(
  //       session?.user?.id,
  //       session?.user?.groupId,
  //       session?.user?.accessToken
  //     ),
  //   {
  //     initialData: quizzes,
  //   }
  // );

  return (
    <MainWrapper title={"Тесты"}>
      {false ? (
        <div className="flex justify-center items-center flex-1 h-full">
          <Loader />
        </div>
      ) : (
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              id={quiz.id}
              title={quiz.title}
              description={quiz.description}
              groups={quiz.groups}
              startDate={quiz.startDate}
              endDate={quiz.endDate}
              slug={quiz.slug}
              questions={quiz?.questions?.length}
            />
          ))}
        </Stack>
      )}
    </MainWrapper>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const quizzes = await getQuizzes(
    session?.user?.groupId,
    session?.user?.accessToken
  );
  return { props: { quizzes } };
}

export default Quizzes;
