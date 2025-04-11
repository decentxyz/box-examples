import { useAccount } from "wagmi";
import { TokenSelector } from "@decent.xyz/box-ui";
import { useState } from "react";
import { CodeBlock, H2, P } from "@/components/common";
import { prettyPrint } from "@/pages/decentHooks";
import { BoxHooksContextProvider } from "@decent.xyz/box-hooks";
import { ChainId, getNativeTokenInfo, TokenInfo } from "@decent.xyz/box-common";

export const TokenSelectorUsage = ({ chainId }: { chainId: ChainId }) => {
  const { address } = useAccount();
  const ethGasToken = getNativeTokenInfo(ChainId.ETHEREUM) as TokenInfo;
  const [srcToken, setSrcToken] = useState<TokenInfo>(ethGasToken);

  return (
    <div className={"mt-10"}>
      <BoxHooksContextProvider
        apiKey={process.env.NEXT_PUBLIC_DECENT_API as string}
      >
        <H2>Token Selector</H2>
        <p>
          You can connect your wallet to show your balances in the token
          selector.
        </p>
        <CodeBlock className={"my-5"}>Your address is: {address}</CodeBlock>
        <p>
          Note: you'll need an API key to be able to use this component. Be sure
          to wrap it in a BoxHooksContextProvider.
        </p>
        <div className={"mb-5 flex mt-4"}>
          <div className={"flex bg-white rounded p-3"}>
            <TokenSelector
              selectedToken={srcToken}
              setSelectedToken={setSrcToken}
              chainId={chainId}
              address={address}
            />
          </div>
        </div>
        <P>Your Selected Token:</P>
        <CodeBlock>{prettyPrint(srcToken)}</CodeBlock>
        <P>Your Fetched Balances</P>
      </BoxHooksContextProvider>
    </div>
  );
};
