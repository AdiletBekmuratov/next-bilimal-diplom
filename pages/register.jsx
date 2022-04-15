import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import * as Yup from "yup";
import toast from "react-hot-toast";

const RegisterSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("Обязательное поле для заполнения")
    .min(1, "Слишком короткое Имя"),
  last_name: Yup.string()
    .required("Обязательное поле для заполнения")
    .min(1, "Слишком короткое Фамилия"),
  email: Yup.string()
    .email("Неправильный формат")
    .required("Обязательное поле для заполнения"),
  group: Yup.number().required("Обязательное поле для заполнения"),
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

const Login = ({ groups }) => {
  const registerUser = async (payload) => {
    const response = await fetch("http://localhost:8055/users", {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    if (!response.ok) {
      const result = await response.json();

      throw new Error(result.errors[0].message);
    }
    if (response.ok) {
      const result = await response.json();
      console.log({ result });
			return result
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      group: values.group,
      password: values.password,
      role: process.env.NEXT_PUBLIC_D_STUDENT,
    };
    toast.promise(registerUser(payload), {
      loading: "Загрузка...",
      success: (data) => `Пользователь успешно зарегистрирован: ${data.email}`,
      error: (err) => `${err.toString()}`,
    });
  };

  return (
    <>
      <Head>
        <title>Зарегистрировать аккаунт</title>
      </Head>
      <div className="flex flex-col flex-1 items-center justify-center p-5 bg-blue-400 overflow-auto">
        <div className="bg-white max-w-xl w-full mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
          <section>
            <h3 className="font-bold text-2xl">Добро пожаловать!</h3>
            <p className="text-gray-600 pt-2">Зарегистрировать аккаунт</p>
          </section>
          <section className="mt-4">
            <Formik
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
              initialValues={{
                first_name: "",
                last_name: "",
                email: "",
                group: "1",
                password: "",
                confirmPassword: "",
              }}
            >
              {(props) => (
                <Form className="flex flex-col">
                  <div className="mb-2 pt-2 rounded ">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <Field
                      type="text"
                      id="email"
                      name="email"
                      placeholder="email@example.com"
                      className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 py-3"
                    />
                    <ErrorMessage
                      component={"div"}
                      className="text-red-500 pt-1 text-sm"
                      name="email"
                    />
                  </div>
                  <div className="flex justify-between items-start space-x-2">
                    <div className="mb-2 pt-2 rounded flex-1">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                        htmlFor="email"
                      >
                        Имя
                      </label>
                      <Field
                        type="text"
                        id="first_name"
                        name="first_name"
                        placeholder="Назерке"
                        className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 py-3"
                      />
                      <ErrorMessage
                        component={"div"}
                        className="text-red-500 pt-1 text-sm"
                        name="first_name"
                      />
                    </div>
                    <div className="mb-2 pt-2 rounded flex-1">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                        htmlFor="email"
                      >
                        Фамилия
                      </label>
                      <Field
                        type="text"
                        id="last_name"
                        name="last_name"
                        placeholder="Токанова"
                        className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 py-3"
                      />
                      <ErrorMessage
                        component={"div"}
                        className="text-red-500 pt-1 text-sm"
                        name="last_name"
                      />
                    </div>
                  </div>

                  <div className="mb-2 pt-2 rounded ">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                      htmlFor="email"
                    >
                      Класс
                    </label>
                    <Field
                      as="select"
                      id="group"
                      name="group"
                      className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 py-3"
                    >
                      {groups?.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      component={"div"}
                      className="text-red-500 pt-1 text-sm"
                      name="group"
                    />
                  </div>
                  <div className="mb-2 pt-2 rounded">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                      htmlFor="password"
                    >
                      Пароль
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
                  <div className="mb-6 pt-2 rounded">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                      htmlFor="password"
                    >
                      Подтвердить пароль
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
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
                    type="submit"
                  >
                    Зарегистрироваться
                  </button>
                </Form>
              )}
            </Formik>
          </section>
        </div>
        <div className="max-w-lg mx-auto text-center mt-2">
          <p className="text-white">
            Уже есть аккаунт?{" "}
            <Link href="/login">
              <a className="font-bold hover:underline">Войти</a>
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/items/Group?fields=id,name`
  );
  const result = await response.json();

  return {
    props: {
      groups: result.data,
    }, // will be passed to the page component as props
  };
}

export default Login;
