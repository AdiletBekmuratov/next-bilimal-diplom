import RefreshTokenHandler from "@/components/RefreshTokenHandler";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import Auth from "@/components/Auth";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [interval, setInterval] = useState(0);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <SessionProvider session={session} refetchInterv={interval}>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" />
          {Component.auth ? (
            <Auth role={Component.auth?.role}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
          <RefreshTokenHandler setInterval={setInterval} />
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
