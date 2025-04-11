import { createConfig, http } from "wagmi";
import { mainnet, base, optimism, zora, arbitrum } from "wagmi/chains";

// recommend using custom rpc urls
export const wagmiConfig = createConfig({
  chains: [mainnet, base, optimism, zora, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [zora.id]: http(),
    [arbitrum.id]: http(),
  },
});
