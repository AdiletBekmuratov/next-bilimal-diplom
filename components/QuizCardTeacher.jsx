import getFormatDate from "@/helpers/getFormatDate";
import { Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { AiFillDelete } from "react-icons/ai";

const QuizCardTeacher = ({
  id,
  title,
  description,
  startDate,
  endDate,
  groups,
  slug,
  questions,
  setTempId,
  setOpen,
}) => {
  const sendId = () => {
    setTempId(id);
    setOpen(true);
  };

  return (
    <>
      <div className="bg-white p-5 shadow-md flex flex-col space-y-4 justify-end rounded-md w-full relative">
        <div className="absolute -right-2 -top-2">
          <button
            type="button"
            className="p-2 rounded-full bg-red-500 hover:opacity-90 text-xl text-white"
            onClick={sendId}
          >
            <AiFillDelete />
          </button>
        </div>
        <div className="flex flex-col justify-start flex-grow">
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
          <div>
            <Typography variant="body2" color="text.secondary">
              Кол-во вопросов: {questions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Начало: {getFormatDate(startDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Конец: {getFormatDate(endDate)}
            </Typography>
          </div>
        </div>
        <div>
          <Stack direction="row" spacing={1}>
            {groups.map((group) => (
              <Chip
                key={group.Group_id.id}
                label={group.Group_id.name}
                variant="outlined"
              />
            ))}
          </Stack>
        </div>
        <Link href={`/teacher/quizzes/results/${slug}?id=${id}`}>
          <a className="bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 rounded shadow-md hover:shadow-lg transition duration-200 uppercase">
            Просмотр результатов
          </a>
        </Link>
        <Link href={`/teacher/quizzes/edit/${slug}?id=${id}`}>
          <a className="border-2 border-blue-600 hover:border-blue-700 text-blue-600 text-center font-bold py-2 rounded shadow-md hover:shadow-lg transition duration-200 uppercase">
            Изменить
          </a>
        </Link>
      </div>
    </>
  );
};

export default QuizCardTeacher;
