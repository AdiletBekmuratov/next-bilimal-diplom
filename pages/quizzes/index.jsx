import MainWrapper from "@/components/MainWrapper";
import QuizCard from "@/components/QuizCard";
import { getQuizzes } from "@/helpers/requests";
import { Paper, Stack } from "@mui/material";
import { getSession } from "next-auth/react";
import React from "react";
import { useQuery } from "react-query";

const Quizzes = ({ quizzes }) => {
  const { data, isLoading, error } = useQuery(
    "schedules",
    () => getSchedules(session?.user?.groupId, session?.user?.accessToken),
    {
      initialData: quizzes,
    }
  );

  console.log(quizzes);
  return (
    <MainWrapper title={"Тесты"}>
      <Stack direction="row" alignItems={"center"} spacing={2}>
        {data.map((quiz) => (
          <QuizCard
            title={quiz.title}
            description={quiz.description}
            groups={quiz.groups}
            startDate={quiz.startDate}
            endDate={quiz.endDate}
            slug={quiz.slug}
          />
        ))}
      </Stack>
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
