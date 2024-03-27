import { Layout } from '@/components/Layouts/Layout';
import { useAccount, useBalance } from 'wagmi';
import { ClientRendered } from '@decent.xyz/box-ui';
import {
  ChainId,
  nativeTokenInfoLookup
} from '@decent.xyz/box-common';
import { SwapModal, darkTheme, BoxThemeProvider } from '@decent.xyz/the-box';
import "@decent.xyz/the-box/index.css";

const Swap = () => {
  const { address } = useAccount();
  const {data } = useBalance({
    chainId: ChainId.DEGEN, 
    address: '0xd2cb3ccc522b5d36a20334d101791eb3c3384281'
  });
  console.log("Test balance: ", data)

  const myTheme = {
    mainBgColor: '#121212', 
    mainTextColor: '#ffffff',
    tokenSwapCardBgColor: '#1B1B1B',
    buyBtnBgColor: '#8236FD',
    buyBtnTextColor: '#ffffff',
    switchBtnBgColor: '#3A3842',
    tokenDialogHoverColor: '#444444',
    boxSubtleColor1: '#999999',
    borderColor: '#27252B',
    borderRadius: '0',
    loadShineColor1: "#121212",
    loadShineColor2: "#333333",
  }

  return (
    <Layout>
      <ClientRendered>
        <BoxThemeProvider theme={myTheme}>
          <SwapModal
            apiKey={process.env.NEXT_PUBLIC_NEW_DECENT_API_KEY as string}
            address={address}
            chainIds={[
              ChainId.OPTIMISM,
              ChainId.POLYGON,
              ChainId.RARIBLE,
              ChainId.ARBITRUM,
              ChainId.BASE,
              ChainId.ZORA,
            ]}
            selectedDstToken={{
              chainId: ChainId.DEGEN,
              tokenInfo: nativeTokenInfoLookup[ChainId.DEGEN],
            }}
          />
        </BoxThemeProvider>
      </ClientRendered>
    </Layout>
  );
}

export default Swap;