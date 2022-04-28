import Loader from "@/components/Loader";
import MainWrapper from "@/components/MainWrapper";
import QuizCardTeacher from "@/components/QuizCardTeacher";
import { deleteQuizById, getTeacherQuizzes } from "@/helpers/requests";
import { Fab, Tooltip } from "@mui/material";
import Link from "next/link";
import { IoIosAdd } from "react-icons/io";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";
import { useQuery } from "react-query";
import AlertDialog from "@/components/AlertDialog";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const TeacherQuizzes = ({ quizzes }) => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [tempId, setTempId] = useState(0);
  const router = useRouter();

  const { data, isLoading, error } = useQuery(
    "quizzes",
    () => getTeacherQuizzes(session?.user?.accessToken),
    {
      initialData: quizzes,
    }
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const res = await toast.promise(
      deleteQuizById({ id: tempId }, session?.user?.accessToken),
      {
        success: "Тест успешно удалён!",
        loading: "Загрузка",
        error: (err) => `Произошла ошибка: ${err.toString()}`,
      }
    );
    router.reload();
  };

  return (
    <>
      <Head>
        <title>Тесты</title>
      </Head>
      <AlertDialog
        open={open}
        handleClose={handleClose}
        onAgree={handleSubmit}
        title="Предупреждение"
        description="Вы действительно хотите удалить тест?"
      />
      <MainWrapper title={"Тесты"}>
        {isLoading ? (
          <div className="flex justify-center items-center flex-1 h-full">
            <Loader />
          </div>
        ) : (
          <>
            <div className="absolute right-10 bottom-10">
              <Link href={"/teacher/quizzes/create"}>
                <Tooltip arrow title="Создать Тест">
                  <Fab component={"a"} color="primary" aria-label="add">
                    <IoIosAdd size={28} />
                  </Fab>
                </Tooltip>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 items-start">
              {data.map((quiz) => (
                <QuizCardTeacher
                  key={quiz.id}
                  id={quiz.id}
                  title={quiz.title}
                  description={quiz.description}
                  groups={quiz.groups}
                  startDate={quiz.startDate}
                  endDate={quiz.endDate}
                  slug={quiz.slug}
                  questions={quiz?.questions_func?.count}
                  setTempId={setTempId}
                  setOpen={setOpen}
                />
              ))}
            </div>
          </>
        )}
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const quizzes = await getTeacherQuizzes(session?.user?.accessToken);
  return { props: { quizzes } };
}

TeacherQuizzes.auth = {
  role: "TEACHER",
};

export default TeacherQuizzes;
