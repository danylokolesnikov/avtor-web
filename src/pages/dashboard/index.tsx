import { NextSeo } from 'next-seo';
import { OrdersScreen } from '@/screens/Orders';
import { DashboardLayout } from '@/shared/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <>
      <NextSeo title="Панель керування" />
      <DashboardLayout>
        <OrdersScreen />
      </DashboardLayout>
    </>
  );
}
