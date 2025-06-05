import { SessionProvider, useSession } from '@/shared/contexts/Session';
import { ROUTE } from '@/shared/helpers/routers';
import { DashboardLayout } from '@/shared/layout/DashboardLayout';
import { store } from '@/shared/store';
import '@/shared/styles/globals.css';
import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <main className="h-full">
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            pauseOnHover
            theme="light"
          />
        </main>
      </SessionProvider>
    </Provider>
  );
}

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  const { pathname } = useRouter();
  const isDashboard = pathname.startsWith(ROUTE.dashboard);

  if (isDashboard) return <Dashboard>{children}</Dashboard>;

  return children;
}

type DashboardProps = {
  children: React.ReactNode;
};

function Dashboard({ children }: DashboardProps) {
  const { pathname, push } = useRouter();
  const { isLoading, isAuth, user } = useSession();

  const isDashboardAdmin = pathname.startsWith(ROUTE.dashboardAdmin);
  const redirectTo =
    user && user.isAdmin
      ? !isDashboardAdmin && ROUTE.dashboardAdmin
      : isDashboardAdmin && ROUTE.dashboard;

  useEffect(() => {
    if (!redirectTo) return;
    push(redirectTo);
  }, [redirectTo, user]);

  if (isLoading)
    return (
      <>
        <NextSeo title="Loading..." />
        <div className="px-[var(--screen-space)]">
          <div className="max-w-[var(--screen-container)] py-[2.5rem] ">
            Loading...
          </div>
        </div>
      </>
    );

  if (!isAuth || redirectTo) return null;

  return <DashboardLayout>{children}</DashboardLayout>;
}
