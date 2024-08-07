import {
  Address,
  bigintSerializer,
  ChainId,
  getNativeTokenInfo,
  TokenInfo,
} from '@decent.xyz/box-common';
import {
  ChainSelector,
  TokenSelector,
  BalanceSelector,
  BalanceChainSelector,
  BoxThemeProvider,
  BoxTheme,
  ClientRendered,
} from '@decent.xyz/box-ui';
import { useState } from 'react';
import { BoxHooksContextProvider } from '@decent.xyz/box-hooks';
import { useAccount } from 'wagmi';
import '@decent.xyz/box-ui/index.css';
import { onboardingDarkTheme, swapDarkTheme } from '@decent.xyz/the-box';
import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { NavBar } from '@/components/Layouts/NavBar';

const defaultToken = getNativeTokenInfo(ChainId.ETHEREUM);

const PageContent = () => {
  const [srcToken, setSrcToken] = useState<TokenInfo>(defaultToken!);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [showBalanceSelector, setShowBalanceSelector] = useState(true);
  const [showBalanceSelector2, setShowBalanceSelector2] = useState(true);
  const [selectChains, setSelectChains] = useState<ChainId[]>([
    ChainId.ETHEREUM,
    ChainId.OPTIMISM,
    ChainId.POLYGON,
  ]);
  const [selectTokens, setSelectTokens] = useState<Address[]>([]);
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const { address } = useAccount();
  const chainId = selectChains[0] ?? ChainId.ETHEREUM;

  const [theme, setTheme] = useState<BoxTheme>({
    mainBgColor: '#000',
    mainTextColor: '#fff',
    loadShineColor1: 'transparent',
    loadShineColor2: 'blue',
    blueBadgeBgColor: '#256AF633',
    blueBadgeTextColor: '#256AF6',
    lighterBgColor: '#222222',
  });

  return (
    <BoxHooksContextProvider apiKey={process.env.NEXT_PUBLIC_NEW_DECENT_API_KEY as string}>
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-8 justify-center">
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
          <div className="flex-1 max-w-lg">
            <div className="text-xl font-semibold">
              Balance Selector{' '}
              <button
                className="text-sm font-normal"
                onClick={() => setShowBalanceSelector(!showBalanceSelector)}
              >
                ({showTokenSelector ? 'hide' : 'show'})
              </button>
            </div>
            <BoxThemeProvider theme={theme}>
              {showBalanceSelector && (
                <>
                  <BalanceSelector
                    className={'max-h-96 overflow-y-auto'}
                    selectedToken={srcToken}
                    setSelectedToken={(tokeninfo) => {
                      setSrcToken(tokeninfo);
                    }}
                    chainId={chainId}
                    address={address}
                    selectChains={selectChains}
                    selectTokens={selectTokens}
                    openToSide={false}
                    disabled={false}
                  />
                </>
              )}

              <div className="text-xl font-semibold">
                Balance Chain Selector{' '}
                <button
                  className="text-sm font-normal"
                  onClick={() => setShowBalanceSelector2(!showBalanceSelector2)}
                >
                  ({showBalanceSelector2 ? 'hide' : 'show'})
                </button>
              </div>
              <div></div>
              {showBalanceSelector2 && (
                <>
                  <BalanceChainSelector
                    className={'max-h-96 overflow-y-auto'}
                    selectedToken={srcToken}
                    setSelectedToken={(tokeninfo) => {
                      setSrcToken(tokeninfo);
                    }}
                    chainId={chainId}
                    address={address}
                    selectChains={selectChains}
                    selectTokens={selectTokens}
                    openToSide={false}
                    disabled={false}
                  />
                </>
              )}
            </BoxThemeProvider>
          </div>
        </div>
      </div>
    </BoxHooksContextProvider>
  );
};

export default function Page() {
  return (
    <div className="min-h-screen pt-40 bg-[#F8F9FD]">
      <NavBar />
      <ClientRendered>
        <PageContent />
      </ClientRendered>
    </div>
  );
}
