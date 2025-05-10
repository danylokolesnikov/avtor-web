import { store } from '@/shared/store';
import '@/shared/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <main className="h-full">
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          pauseOnHover
          theme="light"
        />
      </main>
    </Provider>
  );
}
