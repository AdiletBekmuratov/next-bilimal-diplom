import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";

const QuizCard = ({ title, description, startDate, endDate, groups, slug }) => {
  return (
    <div className="bg-white p-5 shadow-md flex flex-col space-y-4 justify-end h-full rounded-md">
      <div className="flex flex-col justify-between flex-grow">
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
        <div>
          <Typography variant="body2" color="text.secondary">
            Начало: {new Date(startDate).toLocaleString("kk-KZ")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Конец: {new Date(endDate).toLocaleString("kk-KZ")}
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
        <button className="bg-blue-300 cursor-not-allowed text-white text-center font-bold py-2 rounded shadow-lg uppercase">
          Закрыто
        </button>
      ) : (
        <Link href={`/quizzes/${slug}`}>
          <a className="bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 uppercase">
            Начать
          </a>
        </Link>
      )}
    </div>
  );
};

export default QuizCard;
