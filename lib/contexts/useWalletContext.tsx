import { useContext, createContext, ReactNode } from "react";
import { Chain, Address, useNetwork, useAccount } from "wagmi";

export interface WalletContext {
  chain?: Chain;
  address?: Address;
};

export const WalletContext = createContext<WalletContext>({
  chain: undefined,
  address: undefined,
});

export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const { chain } = useNetwork();
  const { address } = useAccount();

  return(
    <WalletContext.Provider value={{ chain, address }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);