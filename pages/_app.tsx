import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import localFont from 'next/font/local';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '@/utils/wagmiConfig';

// Default styles that can be overridden by your app
if (process.env.NODE_ENV !== 'development') {
  // @ts-ignore
  import('@decent.xyz/the-box/index.css').then(() => {
    console.log('💅🏼 box styles imported');
  });
}

const queryClient = new QueryClient()

export const monument = localFont({
  src: '../public/fonts/EduMonumentGroteskVariable.woff2',
  variable: '--font-monument',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${monument.variable} font-sans flex flex-col min-h-screen`}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
