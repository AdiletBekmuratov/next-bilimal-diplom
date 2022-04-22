import MainWrapper from "@/components/MainWrapper";
import getFormatDate from "@/helpers/getFormatDate";
import { getQuizBySlug, addNewScore } from "@/helpers/requests";
import { FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const Quiz = ({ quiz }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmitQuiz = async (values) => {
    let correct = 0;
    Object.keys(values).forEach((key, index) => {
      let value = values[key];
      if (value === quiz.questions[index].Question_id.answer) {
        correct++;
      }
    });
    const payload = {
      quiz: quiz.id,
      user: session?.user?.id,
      score: correct,
    };
    const data = await addNewScore(session?.user?.accessToken, payload);
    if (data.id) {
      router.route(`/quizzes/results/${quiz.slug}`);
    }
  };

  return (
    <MainWrapper title={quiz.title}>
      <section className="mb-6 text-gray-600">
        <h4>Дата начала: {getFormatDate(quiz.startDate)}</h4>
        <h4>Дата окончания: {getFormatDate(quiz.endDate)}</h4>
      </section>
      <Formik onSubmit={handleSubmitQuiz} initialValues={{}}>
        {(props) => (
          <Form className="text-gray-600">
            <Stack direction={"column"} spacing={3}>
              {quiz.questions.map(({ Question_id }, index) => (
                <div
                  className="bg-white p-5 shadow-md hover:shadow-lg flex flex-col space-y-4 rounded-md transition-all"
                  key={index}
                >
                  <h3>
                    {index + 1}) {Question_id.text}
                  </h3>
                  <RadioGroup>
                    <div className="grid grid-cols-2 max-w-3xl">
                      <Field
                        name={index}
                        value="a"
                        control={<Radio />}
                        component={FormControlLabel}
                        label={`A) ${Question_id.a}`}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <Field
                        name={index}
                        value="b"
                        control={<Radio />}
                        component={FormControlLabel}
                        label={`B) ${Question_id.b}`}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <Field
                        name={index}
                        value="c"
                        control={<Radio />}
                        component={FormControlLabel}
                        label={`C) ${Question_id.c}`}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <Field
                        name={index}
                        value="d"
                        control={<Radio />}
                        component={FormControlLabel}
                        label={`D) ${Question_id.d}`}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                    </div>
                  </RadioGroup>
                </div>
              ))}

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 rounded w-full shadow-md hover:shadow-lg transition duration-200 uppercase"
              >
                Завершить
              </button>
            </Stack>
          </Form>
        )}
      </Formik>
    </MainWrapper>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const { slug } = ctx.query;
  const quiz = await getQuizBySlug(slug, session?.user?.accessToken);
  return { props: { quiz } };
}

export default Quiz;
