import { Layout } from "@/components/Layouts/Layout";
import { ClientRendered } from "@decent.xyz/box-ui";
import { ChainId } from "@decent.xyz/box-common";
import { OnboardingModal } from "@decent.xyz/the-box";
import "@decent.xyz/the-box/index.css";
import { wagmiConfig } from "@/utils/wagmiConfig";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const Swap = () => {
  const { openConnectModal } = useConnectModal();
  const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

  return (
    <Layout>
      <ClientRendered>
        <div className="bg-white rounded-md p-4 max-w-sm">
          <OnboardingModal
            apiKey={process.env.NEXT_PUBLIC_DECENT_KEY as string}
            wagmiConfig={wagmiConfig}
            onConnectWallet={() => openConnectModal}
            selectedDstToken={{
              chainId: ChainId.BASE,
              tokenInfo: {
                address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
                decimals: 18,
                name: "DAI",
                chainId: ChainId.BASE,
                symbol: "DAI",
                isNative: false,
                logo: "https://static.alchemyapi.io/images/assets/4943.png",
              },
            }}
            chainIds={[
              ChainId.ETHEREUM,
              ChainId.OPTIMISM,
              ChainId.BASE,
              ChainId.ARBITRUM,
              ChainId.ZORA,
            ]}
            sendInfoTooltip="Add your onboarding explanation here."
            receiverAddress={vitalik}
          />
        </div>
      </ClientRendered>
    </Layout>
  );
};

export default Swap;
