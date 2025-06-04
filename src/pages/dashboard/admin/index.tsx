import { AdminUsersListScreen } from '@/screens/AdminUsersList';
import { NextSeo } from 'next-seo';

export default function AdminUsersListPage() {
  return (
    <>
      <NextSeo title="Панель керування" />
      <AdminUsersListScreen />
    </>
  );
}
