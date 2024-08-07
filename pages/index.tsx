import { Layout } from '@/components/Layouts/Layout';
import Link from 'next/link';

export default function BoxSplashPage() {
  const examples = [
    { title: 'The Box', link: '/theBox' },
    { title: 'Swap Modal', link: '/swap' },
    { title: 'Onboarding Modal', link: '/onboarding' },
    { title: 'Box Hooks', link: '/boxHooks' },
    { title: 'Box UI', link: '/boxUi' },
    { title: 'Fiat Checkout', link: '/fiatCheckout' },
    { title: 'Box APIs', link: '/boxApis' },
  ];
  return (
    <Layout>
      <h1 className={'font-semibold text-6xl mb-5'}>The Box Examples!</h1>
      <p className={'mb-10 text-2xl'}>
        Welcome to the-box examples project! Here you can find working-versions
        of the-box.
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
