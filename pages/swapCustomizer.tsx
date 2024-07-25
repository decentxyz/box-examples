import { BoxTheme, ClientRendered } from '@decent.xyz/box-ui';
import { BoxThemeProvider, darkTheme, SwapModal } from '@decent.xyz/the-box';
import { ChainId, getNativeTokenInfo, TokenInfo } from '@decent.xyz/box-common';
import { wagmiConfig } from '@/utils/wagmiConfig';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import '@decent.xyz/the-box/index.css';
import { useState } from 'react';
import { NavBar } from '@/components/Layouts/NavBar';

const PageContent = () => {
  const { openConnectModal } = useConnectModal();

  const [theme, setTheme] = useState<BoxTheme>({
    mainBgColor: '#121212',
    mainTextColor: '#ffffff',
    tokenSwapCardBgColor: '#1B1B1B',
    buyBtnBgColor: '#8236FD',
    buyBtnTextColor: '#ffffff',
    switchBtnBgColor: '#3A3842',
    tokenDialogHoverColor: '#444444',
    boxSubtleColor1: '#999999',
    borderColor: '#27252B',
    borderRadius: '0px',
    loadShineColor1: '#121212',
    loadShineColor2: '#333333',
    greenBadgeTextColor: '#11BC91',
    greenBadgeBgColor: '#123129',
    yellowBadgeTextColor: '#FF8B31',
    yellowBadgeBgColor: '#3D2818',
    circleLinkChainColor: '#9969FF',
    circleLinkBgColor: '#261D3C',
    buyBtnBorderRadius: '1rem',
  });

  return (
    <>
      <div className="flex gap-4 w-full justify-center items-start">
        <div>
          {Object.keys(theme).map((key) => (
            <label key={key} className="grid grid-cols-2 mt-2">
              {key}
              <input
                type="text"
                onChange={(e) => setTheme({ ...theme, [key]: e.target.value })}
                value={theme[key as keyof BoxTheme]}
              />
            </label>
          ))}
        </div>
        <BoxThemeProvider theme={theme}>
          <SwapModal
            apiKey={process.env.NEXT_PUBLIC_NEW_DECENT_API_KEY as string}
            chainIds={[
              ChainId.ETHEREUM,
              ChainId.EDGELESS,
              ChainId.OPTIMISM,
              ChainId.BASE,
              ChainId.ARBITRUM,
              ChainId.ZORA,
              ChainId.POLYGON,
              ChainId.RARI,
            ]}
            selectedSrcToken={{
              chainId: ChainId.ARBITRUM,
              tokenInfo: getNativeTokenInfo(ChainId.ARBITRUM) as TokenInfo,
            }}
            selectedDstToken={{
              chainId: ChainId.BASE,
              tokenInfo: getNativeTokenInfo(ChainId.BASE) as TokenInfo,
            }}
            wagmiConfig={wagmiConfig}
            onConnectWallet={() => openConnectModal}
          />
        </BoxThemeProvider>
      </div>
    </>
  );
};

export default function Page() {
  return (
    <div className='min-h-screen pt-40 bg-[#F8F9FD]'>
      <NavBar />
      <ClientRendered>
        <PageContent />
      </ClientRendered>
    </div>
  );
}
