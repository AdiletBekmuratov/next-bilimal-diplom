import getFormatDate from "@/helpers/getFormatDate";
import { Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const QuizCard = ({
  title,
  description,
  startDate,
  endDate,
  groups,
  slug,
  questions,
  highScore,
}) => {
  return (
    <div className="bg-white p-5 shadow-md flex flex-col space-y-4 justify-end rounded-md w-full">
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </div>
        <div>
          <Typography variant="body2" color="text.secondary">
            Кол-во вопросов: {questions}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ваш высший балл: {highScore ?? "Еще нет"}
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
      {new Date() > new Date(endDate) ? (
        <button className="bg-blue-300 cursor-not-allowed text-white text-center font-bold py-2 rounded shadow-md uppercase">
          Закрыто
        </button>
      ) : (
        <Link href={`/student/quizzes/${slug}`}>
          <a className="bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 rounded shadow-md hover:shadow-lg transition duration-200 uppercase">
            Начать
          </a>
        </Link>
      )}
      <Link href={`/student/quizzes/results/${slug}`}>
        <a className="border-2 border-blue-600 hover:border-blue-700 text-blue-600 text-center font-bold py-2 rounded shadow-md hover:shadow-lg transition duration-200 uppercase">
          Просмотр результатов
        </a>
      </Link>
    </div>
  );
};

export default QuizCard;
