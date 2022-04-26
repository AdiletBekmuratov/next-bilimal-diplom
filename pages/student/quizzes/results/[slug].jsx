import MainWrapper from "@/components/MainWrapper";
import getFormatDate from "@/helpers/getFormatDate";
import { getQuizBySlug } from "@/helpers/requests";
import { Paper } from "@mui/material";
import { DataGrid, ruRU } from "@mui/x-data-grid";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";

const columns = [
  { field: "id", headerName: "№", width: 100 },
  { field: "score", headerName: "Балл", flex: 1 },
	{ field: "question_count", headerName: "Кол-во вопросов", flex: 1 },
  {
    field: "date_created",
    headerName: "Время завершения",
    flex: 1,
    type: "number",
  },
];

const Results = ({ quiz, rows }) => {
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
  const { slug } = ctx.query;
  const quiz = await getQuizBySlug(
    slug,
    session?.user?.id,
    session?.user?.accessToken
  );
	console.log(quiz);
  const rows = quiz.scores.map((score, index) => ({
    id: index + 1,
    score: score.score,
		question_count: quiz.questions.length,
    date_created: getFormatDate(score.date_created),
  }));
  return { props: { quiz, rows } };
}

export default Results;
