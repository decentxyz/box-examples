import { Layout } from '@/components/Layouts/Layout';
import Link from 'next/link';

export default function BoxSplashPage() {
  const examples = [
    { title: 'Point of Sale', link: '/theBox' },
    { title: 'Swap Modal', link: '/swap' },
    { title: 'Swap Modal Theme Customizer', link: '/swapCustomizer' },
    { title: 'Onboarding Modal', link: '/onboarding' },
    { title: 'Decent Hooks', link: '/decentHooks' },
    { title: 'Decent UI', link: '/decentUi' },
    { title: 'Decent APIs', link: '/decentApis' },
    { title: 'UI Package', link: '/boxUi' },
  ];
  return (
    <Layout>
      <h1 className={'font-semibold text-6xl mb-5'}>Decent Examples</h1>
      <p className={'mb-10 text-2xl'}>
        Welcome to the examples project! Here you can find working-versions
        of Decent API, hooks, and component implementations.
      </p>
      <ul>
        {examples.map(({ title, link }, i) => (
          <li className={' mb-5 text-4xl text-gray-500 '} key={i}>
            <Link href={link}>{title}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
