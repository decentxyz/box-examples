import { Layout } from "@/components/Layouts/Layout";
import { ClientRendered } from "@decent.xyz/box-ui";
import { ChainId, ExplorerTypes, getNativeTokenInfo } from "@decent.xyz/box-common";
import { OnboardingModal } from "@decent.xyz/the-box";
import "@decent.xyz/the-box/index.css";
import { wagmiConfig } from "@/utils/wagmiConfig";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Swap = () => {
  const { openConnectModal } = useConnectModal();
  const { address: account } = useAccount();

  return (
    <Layout>
      <ClientRendered>
        <div className="bg-white rounded-md p-4 max-w-sm">
          <OnboardingModal
            apiKey={process.env.NEXT_PUBLIC_DECENT_KEY as string}
            wagmiConfig={wagmiConfig}
            onConnectWallet={() => openConnectModal}
            selectedDstToken={{
              chainId: ChainId.WORLDCHAIN,
              tokenInfo: getNativeTokenInfo(ChainId.WORLDCHAIN)!,
            }}
            chainIds={[
              ChainId.ETHEREUM,
              ChainId.OPTIMISM,
              ChainId.BASE,
              ChainId.ARBITRUM,
              ChainId.ZORA,
            ]}
            explorerType={ExplorerTypes.CHAIN} // default will be decentscan; can override for chain default explorer
            sendInfoTooltip="Add your onboarding explanation here."
            receiverAddress={account} // can set to a different address
          />
        </div>
      </ClientRendered>
    </Layout>
  );
};

export default Swap;
