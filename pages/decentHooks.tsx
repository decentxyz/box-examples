import "@decent.xyz/the-box/index.css";
import { Layout } from "@/components/Layouts/Layout";
import { useState } from "react";
import {
  BoxHooksContextProvider,
  useBoxAction,
  UseBoxActionArgs,
} from "@decent.xyz/box-hooks";

import {
  EstimateGasParameters,
  Hex,
  TransactionReceipt,
} from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import { ClientRendered } from "@decent.xyz/box-ui";
import {
  getAccount,
  getPublicClient,
  sendTransaction,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { Button, CodeBlock, H1, H2, P } from "@/components/common";
import {
  ActionType,
  bigintSerializer,
  ChainId,
  EvmTransaction,
  getChainExplorerTxLink,
  SwapDirection,
} from "@decent.xyz/box-common";
import { wagmiConfig } from "@/utils/wagmiConfig";
import { SwapStatusModal, TxHistory } from "@decent.xyz/the-box";

export const prettyPrint = (obj: any) =>
  JSON.stringify(obj, bigintSerializer, 2);

export const BoxActionUser = ({
  getActionArgs,
}: {
  getActionArgs: UseBoxActionArgs;
}) => {
  const { actionResponse, actionRequest, isLoading, error } = useBoxAction(getActionArgs);
  const [hash, setHash] = useState<Hex>();
  const { switchChainAsync } = useSwitchChain();
  const { chain, address } = useAccount();
  const { srcChainId, srcToken, dstToken } = getActionArgs;
  const [srcTxReceipt, setSrcTxReceipt] = useState<TransactionReceipt>();

  if (error) {
    return <CodeBlock>Error fetching: {prettyPrint(error)}</CodeBlock>;
  }
  if (isLoading || !actionResponse) {
    return <CodeBlock>Fetching box action...</CodeBlock>;
  }

  return (
    <div className={"max-w-4xl"}>
      <Button
        onClick={async () => {
          try {
            const account = getAccount(wagmiConfig);
            const publicClient = getPublicClient(wagmiConfig);
            console.log({ chain, srcChainId });
            if (chain?.id !== srcChainId) {
              await switchChainAsync?.({ chainId: Number(srcChainId) });
            }
            const tx = actionResponse.tx as EvmTransaction;
            const gas = await publicClient?.estimateGas({
              account,
              ...tx,
            } as unknown as EstimateGasParameters);
            const hash = await sendTransaction(wagmiConfig, {
              ...tx,
              gas,
            });
            setHash(hash);
            try {
              const receipt = await waitForTransactionReceipt(wagmiConfig, {
                hash,
              });
              setSrcTxReceipt(receipt);
            } catch (e) {}
          } catch (e) {
            console.error("Unable to confirm tx: ", e);
          }
        }}
      >
        Send This Tx!
      </Button>
      
        <div className={"my-6"}>
          <H2>Transaction Tracking:</H2>
          {hash && (    
          <div className="flex gap-4 items-center">
              <CodeBlock>
                {srcTxReceipt ? hash : "Waiting for tx confirmation..."}
              </CodeBlock>
              <a
                href={getChainExplorerTxLink({ srcChainId, txHash: hash })}
                className={"text-blue-500"}
              >
                view on explorer
              </a>
            </div>)}
            {/* component requires Decent style import; optional, wrap in BoxThemeProvider for custom themeing */}
            <TxHistory
              address={address}
              chainIds={[ChainId.BASE, ChainId.ARBITRUM]} // your chainIds where you'd expect to see user tx's
              targetTxDisplayChain={ChainId.ARBITRUM} // enforce one chainId as target; e.g., know all tx's should go to Arb. Optional.
              hideWithdrawalHistory={true} // should show separate tab in txHistory for canonical withdrawals?
              executedTx={srcTxReceipt ? { chainId: srcChainId, txHash: hash as string, response: actionResponse } : null} // real-time tx tracking; can leave null if just historical txs
            />
        </div>
      <H2>Action Response</H2>
      <CodeBlock className={"mb-4"}>{prettyPrint(actionResponse)}</CodeBlock>
    </div>
  );
};

export const Usage = () => {
  const { address: sender } = useAccount();

  const getActionArgs: UseBoxActionArgs = {
    actionType: ActionType.SwapAction,
    actionConfig: {
      amount: 100000000000000n,
      swapDirection: SwapDirection.EXACT_AMOUNT_IN,
      receiverAddress: sender,
      chainId: ChainId.BASE
    },
    srcChainId: ChainId.BASE,
    sender: sender!,
    slippage: 1, // 1%
    srcToken: "0x0000000000000000000000000000000000000000",
    dstToken: "0x0000000000000000000000000000000000000000", // USDC
    dstChainId: ChainId.ARBITRUM,
  };

  return (
    <>
      <H2>Action Args</H2>
      <CodeBlock>{prettyPrint(getActionArgs)}</CodeBlock>
      <div className={"mt-10"}>
        <BoxActionUser getActionArgs={getActionArgs} />
      </div>
    </>
  );
};

export default function ExamplePage() {
  const { address: sender } = useAccount();

  return (
    <Layout>
      <ClientRendered>
        <BoxHooksContextProvider
          apiKey={process.env.NEXT_PUBLIC_DECENT_KEY as string}
        >
          <div className={"max-w-5xl "}>
            <H1>Box Hooks</H1>
            <P>Below you can see the usage of the box hooks.</P>
            {sender ? <Usage /> : <P>Please Connect your wallet</P>}
          </div>
        </BoxHooksContextProvider>
      </ClientRendered>
    </Layout>
  );
}
