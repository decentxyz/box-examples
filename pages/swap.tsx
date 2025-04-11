import { Layout } from '@/components/Layouts/Layout';
import { ClientRendered } from '@decent.xyz/box-ui';
import { ChainId, TokenInfo, getNativeTokenInfo } from '@decent.xyz/box-common';
import { SwapModal } from '@decent.xyz/the-box';
import '@decent.xyz/the-box/index.css';
import { wagmiConfig } from '@/utils/wagmiConfig';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const Swap = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <Layout>
      <ClientRendered>
        <SwapModal
          apiKey={process.env.NEXT_PUBLIC_DECENT_KEY as string}
          chainIds={[
            ChainId.ETHEREUM,
            ChainId.OPTIMISM,
            ChainId.BASE,
            ChainId.ARBITRUM,
            ChainId.ZORA,
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
      </ClientRendered>
    </Layout>
  );
};

export default Swap;
