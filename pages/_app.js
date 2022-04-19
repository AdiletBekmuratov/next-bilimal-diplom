import RefreshTokenHandler from "@/components/RefreshTokenHandler";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [interval, setInterval] = useState(0);

  return (
    <SessionProvider session={session} refetchInterv={interval}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Component {...pageProps} />
        <RefreshTokenHandler setInterval={setInterval} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
