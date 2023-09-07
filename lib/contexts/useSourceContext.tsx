import { useContext, createContext, Dispatch, SetStateAction, ReactNode, useState } from "react";
import { useWalletContext } from "./useWalletContext";
import { ChainId, TokenInfo, ethGasToken } from "@decent.xyz/box-hooks";

export interface SourceContext {
  srcChainId: number;
  setSrcChainId: Dispatch<SetStateAction<ChainId>>;
  srcToken: TokenInfo;
  setSrcToken: Dispatch<SetStateAction<TokenInfo>>;
  txAmount: string;
  setTxAmount: Dispatch<SetStateAction<string>>;
};

export const SourceContext = createContext<SourceContext>({
  srcChainId: ChainId.ETHEREUM,
  setSrcChainId: () => {},
  srcToken: ethGasToken,
  setSrcToken: () => {},
  txAmount: '0.0',
  setTxAmount: () => {},
});

export const SourceContextProvider = ({ children }: { children: ReactNode }) => {
  const { chain } = useWalletContext();
  const [srcChainId, setSrcChainId] = useState(chain?.id || ChainId.ETHEREUM);
  const [srcToken, setSrcToken] = useState(ethGasToken);
  const [txAmount, setTxAmount] = useState('0.0');

  return(
    <SourceContext.Provider value={{ srcChainId, setSrcChainId, srcToken, setSrcToken, txAmount, setTxAmount }}>
      {children}
    </SourceContext.Provider>
  );
};

export const useSourceContext = () => useContext(SourceContext);