import MainWrapper from "@/components/MainWrapper";
import { toIsoString } from "@/helpers/getFormatDate";
import { createSchedule, getTeacherGroups } from "@/helpers/requests";
import {
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Form, Formik } from "formik";
import { getSession, useSession } from "next-auth/react";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const HWSchema = Yup.object().shape({
  subject: Yup.string().required("Обязательное поле для заполнения"),
  homework: Yup.string().required("Обязательное поле для заполнения"),
  date: Yup.string()
    .transform((val) => (val === null ? "" : val))
    .required("Обязательное поле для заполнения"),
  groups: Yup.array()
    .min(1, "Нужно выбрать хотя бы одну группу")
    .required("Обязательное поле для заполнения"),
});

const Homework = ({ groups }) => {
  const { data: session } = useSession();

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      subject: values.subject,
      homework: values.homework,
      date: toIsoString(new Date(values.date)),
      groups: values.groups.map((group) => ({ Group_id: { id: group } })),
    };
    console.log(data);
    const res = await toast.promise(
      createSchedule(data, session?.user?.accessToken),
      {
        success: "Данные успешно добавлены!",
        loading: "Загрузка",
        error: (err) => `Произошла ошибка: ${err.toString()}`,
      }
    );

    console.log({ res });
    resetForm();
  };
  return (
    <MainWrapper title="Задать ДЗ">
      <LocalizationProvider dateAdapter={AdapterLuxon} locale="ru">
        <div className="bg-white p-5 shadow-md flex rounded-md w-full">
          <Formik
            validationSchema={HWSchema}
            onSubmit={handleSubmit}
            initialValues={{
              groups: [],
              subject: "",
              homework: "",
              date: new Date(),
            }}
          >
            {({ values, setFieldValue, touched, errors, handleChange }) => (
              <Form className="flex flex-col space-y-6 w-full">
                <FormControl className="w-full md:max-w-xs">
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
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              groups.find((group) => group.id === value).name
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
                <TextField
                  name="subject"
                  label="Предмет"
                  onChange={handleChange}
                  value={values.subject}
                  error={touched.subject && Boolean(errors.subject)}
                  helperText={touched.subject && errors.subject}
                />
                <TextField
                  name="homework"
                  label="Домашнее задание"
                  onChange={handleChange}
                  value={values.homework}
                  error={touched.homework && Boolean(errors.homework)}
                  helperText={touched.homework && errors.homework}
                />
                <DateTimePicker
                  label="Время окончания"
                  name="date"
                  value={values.date}
                  onChange={(value) => setFieldValue("date", value.toString())}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={touched.date && Boolean(errors.date)}
                      helperText={touched.date && errors.date}
                    />
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
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const groups = await getTeacherGroups(session?.user?.accessToken);
  return { props: { groups } };
}

Homework.auth = {
  role: "TEACHER",
};

export default Homework;
