import { NextSeo } from 'next-seo';
import { OrdersScreen } from '@/screens/Orders';

export default function DashboardPage() {
  return (
    <>
      <NextSeo title="Панель керування" />
      <OrdersScreen />
    </>
  );
}
