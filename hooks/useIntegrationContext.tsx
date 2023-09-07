import { useContext, createContext, Dispatch, SetStateAction, ReactNode, useState } from "react";
import { Chain, Address, useNetwork, useAccount } from "wagmi";
import { ChainId, TokenInfo, ethGasToken } from "@decent.xyz/box-hooks";

interface IntegrationContext {
  srcChainId: number;
  setSrcChainId: Dispatch<SetStateAction<ChainId>>;
  srcToken: TokenInfo;
  setSrcToken: Dispatch<SetStateAction<TokenInfo>>;
  chain?: Chain;
  address?: Address;
};

export const IntegrationContext = createContext<IntegrationContext>({
  srcChainId: ChainId.ETHEREUM,
  setSrcChainId: () => {},
  srcToken: ethGasToken,
  setSrcToken: () => {},
  chain: undefined,
  address: undefined,
});

export const IntegrationContextProvider = ({ children }: { children: ReactNode }) => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [srcChainId, setSrcChainId] = useState(chain?.id || ChainId.ETHEREUM);
  const [srcToken, setSrcToken] = useState(ethGasToken);

  return(
    <IntegrationContext.Provider value={{ srcChainId, setSrcChainId, srcToken, setSrcToken, chain, address }}>
      {children}
    </IntegrationContext.Provider>
  );
};

export const useIntegrationContext = () => useContext(IntegrationContext);