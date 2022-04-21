import Loader from "@/components/Loader";
import MainWrapper from "@/components/MainWrapper";
import { getCurrentUser, updateGeneralInfo } from "@/helpers/requests";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { getSession, useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import * as Yup from "yup";

const fileTypes = ["JPG", "JPEG", "PNG"];

const InfoSchema = Yup.object().shape({
  first_name: Yup.string().required("Обязательное поле для заполнения"),
  last_name: Yup.string().required("Обязательное поле для заполнения"),
});

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Пароль должен содержать минимум 8 символов, один верхний регистр, один нижний регистр, одну цифру и один символ специального регистра"
    )
    .required("Обязательное поле для заполнения"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Пароли не совпадают")
    .required("Обязательное поле для заполнения"),
});

const EditProfile = ({ currentUser }) => {
  const { data: session, status } = useSession();
  const { data, isLoading, error } = useQuery(
    "currentUser",
    () => getCurrentUser(session?.user?.accessToken),
    {
      initialData: currentUser,
    }
  );
  const [file, setFile] = useState(null);
  const imagePrevRef = useRef(null);

  const handleChange = (file) => {
    setFile(file);
    imagePrevRef.current.src = URL.createObjectURL(file);
  };

  const handleSubmitInfo = async (values) => {
    const response = await toast.promise(
      updateGeneralInfo(session?.user?.accessToken, values),
      {
        success: "Профиль обновлён!",
        loading: "Загрузка",
        error: (err) => `Произошла ошибка: ${err.toString()}`,
      }
    );
  };

  const handleUploadFile = async () => {
    var data = new FormData();
    data.append("file", file, file.name);
    const response = await toast.promise(
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/files`, data, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }),
      {
        success: "Фото профиля загружена!",
        loading: "Загрузка",
        error: (err) => `Произошла ошибка: ${err.toString()}`,
      }
    );

    const uploadedImage = response.data;

    const data2 = {
      avatar: uploadedImage.data.id,
    };

    const resAx = await toast.promise(
      updateGeneralInfo(session?.user?.accessToken, data2),
      {
        success: "Фото профиля обновлена!",
        loading: "Загрузка",
        error: (err) => `Произошла ошибка: ${err.toString()}`,
      }
    );
  };

  const handlePasswordSubmit = async (values) => {
    const data = {
      password: values.password,
    };
    const response = await toast.promise(
      updateGeneralInfo(session?.user?.accessToken, data),
      {
        success: "Пароль обновлён!",
        loading: "Загрузка",
        error: (err) => `Произошла ошибка: ${err.toString()}`,
      }
    );
  };

  return (
    <MainWrapper title={"Редактировать Профиль"}>
      {status === "loading" ? (
        <div className="flex justify-center items-center flex-1">
          <Loader />
        </div>
      ) : (
        <>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ">
            <div className="p-6">
              <div className="flex flex-col justify-center space-x-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-6">
                    <h3>Фото профиля</h3>
                    <FileUploader
                      handleChange={handleChange}
                      name="file"
                      types={fileTypes}
                      label="Загрузите или перетащите фото"
                      hoverTitle="Перетащите сюда"
                      classes="dragNdrop"
                    />
                    <img
                      ref={imagePrevRef}
                      alt="image upload"
                      className={`h-96 w-full rounded-md object-cover ${
                        file ? "flex-grow" : "hidden"
                      }`}
                    />
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow hover:shadow-md transition duration-200 disabled:bg-blue-100"
                      type="button"
                      disabled={!file}
                      onClick={handleUploadFile}
                    >
                      Загрузить
                    </button>
                  </div>

                  <Formik
                    validationSchema={InfoSchema}
                    initialValues={{
                      first_name:
                        status === "authenticated" ? data.first_name : "",
                      last_name:
                        status === "authenticated" ? data?.last_name : "",
                    }}
                    onSubmit={handleSubmitInfo}
                  >
                    {(props) => (
                      <Form className="flex flex-col space-y-6">
                        <h3>Общая информация</h3>
                        <div className="rounded">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                            htmlFor="first_name"
                          >
                            Имя
                          </label>
                          <Field
                            type="text"
                            id="first_name"
                            name="first_name"
                            placeholder="Назипа"
                            className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 py-3"
                          />
                          <ErrorMessage
                            component={"div"}
                            className="text-red-500 pt-1 text-sm"
                            name="first_name"
                          />
                        </div>
                        <div className="rounded">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                            htmlFor="last_name"
                          >
                            Фамилия
                          </label>
                          <Field
                            type="text"
                            id="last_name"
                            name="last_name"
                            placeholder="Ергалиева"
                            className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 py-3"
                          />
                          <ErrorMessage
                            component={"div"}
                            className="text-red-500 pt-1 text-sm"
                            name="last_name"
                          />
                        </div>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow hover:shadow-md transition duration-200"
                          type="submit"
                        >
                          Редактировать
                        </button>
                      </Form>
                    )}
                  </Formik>

                  <Formik
                    validationSchema={PasswordSchema}
                    initialValues={{
                      password: "",
                      confirmPassword: "",
                    }}
                    onSubmit={handlePasswordSubmit}
                  >
                    <Form className="flex flex-col space-y-6">
                      <h3>Безопасность</h3>
                      <div className="rounded">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                          htmlFor="password"
                        >
                          Новый пароль
                        </label>
                        <Field
                          type="password"
                          id="password"
                          name="password"
                          placeholder="••••••"
                          className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 py-3"
                        />
                        <ErrorMessage
                          component={"div"}
                          className="text-red-500 pt-1 text-sm"
                          name="password"
                        />
                      </div>
                      <div className="rounded">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                          htmlFor="confirmPassword"
                        >
                          Подтверждение нового пароля
                        </label>
                        <Field
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="••••••"
                          className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 py-3"
                        />
                        <ErrorMessage
                          component={"div"}
                          className="text-red-500 pt-1 text-sm"
                          name="confirmPassword"
                        />
                      </div>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow hover:shadow-md transition duration-200"
                        type="submit"
                      >
                        Изменить
                      </button>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </MainWrapper>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const currentUser = await getCurrentUser(session?.user?.accessToken);
  return { props: { currentUser } };
}

export default EditProfile;
