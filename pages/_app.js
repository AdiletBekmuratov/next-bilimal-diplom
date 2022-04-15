import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
			<Toaster position="top-right" />
      <div className="flex w-screen h-screen">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default MyApp;
