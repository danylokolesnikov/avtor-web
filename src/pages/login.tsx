import { LoginScreen } from '@/screens/Login';
import { NextSeo } from 'next-seo';

export default function LoginPage() {
  return (
    <>
      <NextSeo title="Сторінка авторизації" />
      <LoginScreen />
    </>
  );
}
