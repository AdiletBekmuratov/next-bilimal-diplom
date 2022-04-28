import AlertDialog from "@/components/AlertDialog";
import FormField from "@/components/FormField";
import MainWrapper from "@/components/MainWrapper";
import { toIsoString } from "@/helpers/getFormatDate";
import {
  deleteQuestionsByIds,
  getQuizById,
  getTeacherGroups,
  updateQuizById,
} from "@/helpers/requests";
import {
  Button,
  Chip,
  Fab,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Field, FieldArray, Form, Formik } from "formik";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";
import * as Yup from "yup";

const QuestionsSchema = Yup.object().shape({
  id: Yup.string(),
  text: Yup.string().required("Обязательное поле для заполнения"),
  a: Yup.string().required("Обязательное поле для заполнения"),
  b: Yup.string().required("Обязательное поле для заполнения"),
  c: Yup.string().required("Обязательное поле для заполнения"),
  d: Yup.string().required("Обязательное поле для заполнения"),
  answer: Yup.string().required("Обязательное поле для заполнения"),
});

const QuizSchema = Yup.object().shape({
  deleteIds: Yup.array(),
  title: Yup.string().required("Обязательное поле для заполнения"),
  description: Yup.string().required("Обязательное поле для заполнения"),
  startDate: Yup.string()
    .transform((val) => (val === null ? "" : val))
    .required("Обязательное поле для заполнения"),
  endDate: Yup.string()
    .transform((val) => (val === null ? "" : val))
    .required("Обязательное поле для заполнения"),
  groups: Yup.array()
    .min(1, "Нужно выбрать хотя бы одну группу")
    .required("Обязательное поле для заполнения"),
  questions: Yup.array().of(QuestionsSchema),
});

const EditQuiz = ({ groups, quiz }) => {
  const { data: session } = useSession();
  const [tempD, setTempD] = useState({});
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = async (values) => {
    setOpen(true);
    setTempD(values);
  };

  const handleSubmit = async () => {
    if (tempD.deleteIds.length >= tempD.questions.length) {
      toast.error("Тест должен содержать как минимум один вопрос");
      return;
    }

    const filteredQuestions = tempD.questions.filter(
      (val) => !tempD.deleteIds.includes(val.id)
    );

    const data = {
      id: quiz.id,
      title: tempD.title,
      description: tempD.description,
      startDate: toIsoString(new Date(tempD.startDate)),
      endDate: toIsoString(new Date(tempD.endDate)),
      groups: tempD.groups.map((group) => ({ Group_id: { id: group } })),
      questions: filteredQuestions.map((question) => ({
        Question_id: Object.keys(question)
          .filter((key) => key !== "new")
          .reduce((obj, key) => {
            obj[key] = question[key];
            return obj;
          }, {}),
      })),
    };

    const updateData = await toast.promise(
      updateQuizById(data, session?.user?.accessToken),
      {
        success: "Данные успешно обновлены!",
        loading: "Загрузка",
        error: (err) => `Произошла ошибка: ${err.toString()}`,
      }
    );

    router.reload();
  };

  return (
    <>
      <Head>
        <title>Изменение теста</title>
      </Head>
      <AlertDialog
        open={open}
        handleClose={handleClose}
        onAgree={handleSubmit}
        title="Предупреждение"
        description="Вы действительно хотите изменить данные?"
      />
      <MainWrapper title="Изменение теста">
        <LocalizationProvider dateAdapter={AdapterLuxon} locale="ru">
          <div className="bg-white p-5 shadow-md flex rounded-md w-full">
            <Formik
              validationSchema={QuizSchema}
              onSubmit={handleOpen}
              initialValues={quiz}
            >
              {({ values, setFieldValue, touched, errors, handleChange }) => (
                <Form className="flex flex-col space-y-6 w-full">
                  <h4>Основная информация</h4>
                  <div className="grid grid-cols-6 gap-6">
                    <FormControl className="col-span-6 md:col-span-2">
                      <InputLabel
                        error={touched.groups && Boolean(errors.groups)}
                        id="group"
                      >
                        Группа
                      </InputLabel>
                      <Select
                        name="groups"
                        multiple
                        value={values.groups}
                        onChange={(event) =>
                          setFieldValue("groups", event.target.value)
                        }
                        error={touched.groups && Boolean(errors.groups)}
                        labelId="group"
                        id="demo-simple-select"
                        label="Группа"
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={
                                  groups.find((group) => group.id === value)
                                    .name
                                }
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {groups.map((groupObj) => (
                          <MenuItem key={groupObj.id} value={groupObj.id}>
                            {groupObj.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.groups && !!errors.groups && (
                        <FormHelperText
                          error={touched.groups && Boolean(errors.groups)}
                        >
                          {errors.groups}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormField
                      className="col-span-6 md:col-span-4"
                      label={"Название"}
                      field={`title`}
                      value={values.title}
                      error={errors.title}
                      touched={touched.title}
                      handleChange={handleChange}
                    />
                  </div>

                  <FormField
                    multiline
                    label={"Описание"}
                    field={`description`}
                    value={values.description}
                    error={errors.description}
                    touched={touched.description}
                    handleChange={handleChange}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DateTimePicker
                      label="Время начала"
                      name="startDate"
                      value={values.startDate}
                      onChange={(value) =>
                        setFieldValue("startDate", value.toString())
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={touched.startDate && Boolean(errors.startDate)}
                          helperText={touched.startDate && errors.startDate}
                        />
                      )}
                    />

                    <DateTimePicker
                      label="Время окончания"
                      name="endDate"
                      value={values.endDate}
                      onChange={(value) =>
                        setFieldValue("endDate", value.toString())
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={touched.endDate && Boolean(errors.endDate)}
                          helperText={touched.endDate && errors.endDate}
                        />
                      )}
                    />
                  </div>

                  <FieldArray
                    name="questions"
                    render={(arrayHelper) => (
                      <>
                        <div className="absolute right-10 bottom-10">
                          <Tooltip arrow title="Добавить вопрос">
                            <Fab
                              onClick={() =>
                                arrayHelper.push({
                                  text: "",
                                  a: "",
                                  b: "",
                                  c: "",
                                  d: "",
                                  answer: "a",
                                  new: true,
                                })
                              }
                              color="primary"
                              aria-label="add"
                            >
                              <IoIosAdd size={28} />
                            </Fab>
                          </Tooltip>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          <div className="flex justify-between items-center">
                            <h4>Вопросы</h4>
                          </div>
                          {values?.questions &&
                            values?.questions?.length > 0 &&
                            values?.questions?.map((question, index) => (
                              <div
                                className={`grid grid-cols-1 gap-6 ${
                                  index !== 0 && "border-t border-gray-300 pt-4"
                                } ${
                                  values.deleteIds.includes(
                                    values?.questions?.at(index)?.id
                                  ) && "bg-red-200"
                                }`}
                                key={index}
                              >
                                <div className="flex justify-between items-center">
                                  <h4>{index + 1})</h4>
                                  <div className="text-right">
                                    {values?.questions?.at(index)?.new ? (
                                      <button
                                        className="p-2 flex rounded-full bg-red-500 hover:opacity-90 text-xl text-white cursor-pointer"
                                        onClick={() =>
                                          arrayHelper.remove(index)
                                        }
                                      >
                                        <AiFillDelete />
                                      </button>
                                    ) : (
                                      <>
                                        <Field
                                          id={`checkbox-${index}`}
                                          type="checkbox"
                                          className="hidden"
                                          name="deleteIds"
                                          value={
                                            values?.questions?.at(index)?.id
                                          }
                                        />
                                        <label
                                          htmlFor={`checkbox-${index}`}
                                          className="p-2 flex rounded-full bg-red-500 hover:opacity-90 text-xl text-white cursor-pointer"
                                        >
                                          <AiFillDelete />
                                        </label>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <FormField
                                  label={"Вопрос"}
                                  field={`questions[${index}].text`}
                                  value={values.questions[index]?.text}
                                  error={errors.questions?.at(index)?.text}
                                  touched={touched?.questions?.at(index)?.text}
                                  handleChange={handleChange}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField
                                    label={"Вариант А"}
                                    field={`questions[${index}].a`}
                                    value={values.questions[index]?.a}
                                    error={errors.questions?.at(index)?.a}
                                    touched={touched?.questions?.at(index)?.a}
                                    handleChange={handleChange}
                                  />
                                  <FormField
                                    label={"Вариант B"}
                                    field={`questions[${index}].b`}
                                    value={values.questions[index]?.b}
                                    error={errors.questions?.at(index)?.b}
                                    touched={touched?.questions?.at(index)?.b}
                                    handleChange={handleChange}
                                  />
                                  <FormField
                                    label={"Вариант C"}
                                    field={`questions[${index}].c`}
                                    value={values.questions[index]?.c}
                                    error={errors.questions?.at(index)?.c}
                                    touched={touched?.questions?.at(index)?.c}
                                    handleChange={handleChange}
                                  />
                                  <FormField
                                    label={"Вариант D"}
                                    field={`questions[${index}].d`}
                                    value={values.questions[index]?.d}
                                    error={errors.questions?.at(index)?.d}
                                    touched={touched?.questions?.at(index)?.d}
                                    handleChange={handleChange}
                                  />
                                </div>
                                <FormControl>
                                  <InputLabel id="answer-select">
                                    Ответ
                                  </InputLabel>
                                  <Select
                                    labelId="answer-select"
                                    value={values?.questions[index]?.answer}
                                    label="Ответ"
                                    onChange={(event) =>
                                      setFieldValue(
                                        `questions[${index}].answer`,
                                        event.target.value,
                                        false
                                      )
                                    }
                                  >
                                    <MenuItem value={"a"}>Вариант А</MenuItem>
                                    <MenuItem value={"b"}>Вариант B</MenuItem>
                                    <MenuItem value={"c"}>Вариант C</MenuItem>
                                    <MenuItem value={"d"}>Вариант D</MenuItem>
                                  </Select>
                                </FormControl>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                  />

                  <Button type="submit" variant="contained">
                    Сохранить
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </LocalizationProvider>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const { id } = ctx.query;
  const quizData = await getQuizById({ id }, session?.user?.accessToken);
  const quiz = {
    deleteIds: [],
    id: quizData.id,
    title: quizData.title,
    description: quizData.description,
    startDate: quizData.startDate,
    endDate: quizData.endDate,
    groups: quizData.groups.map((group) => group.Group_id.id),
    questions: quizData.questions.map(({ Question_id }) => ({
      id: Question_id.id,
      text: Question_id.text,
      a: Question_id.a,
      b: Question_id.b,
      c: Question_id.c,
      d: Question_id.d,
      answer: Question_id.answer,
      new: false,
    })),
  };
  const groups = await getTeacherGroups(session?.user?.accessToken);
  return { props: { groups, quiz } };
}

EditQuiz.auth = {
  role: "TEACHER",
};

export default EditQuiz;
