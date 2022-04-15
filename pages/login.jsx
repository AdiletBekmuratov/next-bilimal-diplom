import { ErrorMessage, Field, Form, Formik } from "formik";
import { getCsrfToken, signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Неправильный формат")
    .required("Обязательное поле для заполнения"),
  password: Yup.string().required("Обязательное поле для заполнения"),
});

const Login = ({ csrfToken }) => {
  const router = useRouter();
  const [error, setError] = useState(false);

  const handleSubmit = async (values) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: `/`,
    });

    if (res?.error) {
      setError(true);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>Вход в аккаунт</title>
      </Head>
      <div className="flex flex-col flex-1 items-center justify-center p-5 bg-blue-400 overflow-auto">
        <div className="bg-white max-w-lg w-full mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
          <section>
            <h3 className="font-bold text-2xl">Добро пожаловать!</h3>
            <p className="text-gray-600 pt-2">Вход в аккаунт</p>
          </section>
          <section className="mt-4">
            <Formik
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
              initialValues={{
                email: "",
                password: "",
              }}
            >
              {(props) => (
                <Form className="flex flex-col">
                  <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                  />
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
                  <div className="flex justify-end">
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline mb-6"
                    >
                      Забыли пароль?
                    </a>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
                    type="submit"
                  >
                    Войти
                  </button>
                </Form>
              )}
            </Formik>
          </section>
        </div>
        <div className="max-w-lg mx-auto text-center mt-12 mb-6">
          <p className="text-white">
            Еще нет аккаунта?{" "}
            <Link href="/register"> 
              <a className="font-bold hover:underline">
                Зарегистрироваться
              </a>
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default Login;
