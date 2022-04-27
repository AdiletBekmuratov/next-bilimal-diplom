import MainWrapper from "@/components/MainWrapper";
import getFormatDate from "@/helpers/getFormatDate";
import { getQuizById } from "@/helpers/requests";
import { Paper } from "@mui/material";
import { DataGrid, gridStringOrNumberComparator, ruRU } from "@mui/x-data-grid";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";

const columns = [
  { field: "id", headerName: "№", width: 100 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "fullname", headerName: "Студент", flex: 1 },
  { field: "group", headerName: "Группа", flex: 1 },
  { field: "score", headerName: "Балл", flex: 1, type: "number" },
  {
    field: "question_count",
    headerName: "Кол-во вопросов",
    flex: 1,
    type: "number",
  },
  {
    field: "date_created",
    headerName: "Время завершения",
    flex: 1,
    type: "number",
    sortComparator: gridStringOrNumberComparator,
  },
];

const TeacherResults = ({ quiz, rows }) => {
  const [pageSize, setPageSize] = useState(10);

  return (
    <>
      <Head>
        <title>Результаты</title>
      </Head>
      <MainWrapper title={"Результаты"}>
        <h4 className="mb-5">{quiz.title}</h4>
        <Paper className="h-full max-h-full">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 20, 30, 50]}
            className="px-4 py-2"
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          />
        </Paper>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const { id } = ctx.query;
  const quiz = await getQuizById({ id }, session?.user?.accessToken);
  const rows = quiz.scores.map((score, index) => ({
    id: index + 1,
    email: score.user.email,
    fullname: score.user.first_name + " " + score.user.last_name,
    group: score.user.group.name,
    score: score.score,
    question_count: quiz.questions.length,
    date_created: getFormatDate(score.date_created),
  }));
  return { props: { quiz, rows } };
}

TeacherResults.auth = {
  role: "TEACHER",
};

export default TeacherResults;
