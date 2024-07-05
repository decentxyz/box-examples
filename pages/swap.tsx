import { Layout } from '@/components/Layouts/Layout';
import { ClientRendered } from '@decent.xyz/box-ui';
import { ChainId, TokenInfo, getNativeTokenInfo } from '@decent.xyz/box-common';
import { SwapModal, BoxThemeProvider } from '@decent.xyz/the-box';
import '@decent.xyz/the-box/index.css';
import { wagmiConfig } from '@/utils/wagmiConfig';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const Swap = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <Layout>
      <ClientRendered>
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
            chainId: ChainId.ETHEREUM,
            tokenInfo: getNativeTokenInfo(ChainId.ETHEREUM) as TokenInfo,
          }}
          selectedDstToken={{
            chainId: ChainId.EDGELESS,
            tokenInfo: getNativeTokenInfo(ChainId.EDGELESS) as TokenInfo,
          }}
          wagmiConfig={wagmiConfig}
          onConnectWallet={() => openConnectModal}
        />
      </ClientRendered>
    </Layout>
  );
};

export default Swap;
