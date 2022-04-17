import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import {
	QueryClient,
	QueryClientProvider
} from 'react-query';
import "../styles/globals.css";

const queryClient = new QueryClient()

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <div className="flex w-screen h-screen">
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
