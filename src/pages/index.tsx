import { HomeScreen } from '@/screens/Home';
import { NextSeo } from 'next-seo';

export default function HomePage() {
  return (
    <>
      <NextSeo title="Головна" />
      <HomeScreen />
    </>
  );
}
