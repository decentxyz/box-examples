import { Layout } from '@/components/Layouts/Layout';
import { useState } from 'react';
import {
  BoxHooksContextProvider,
  useBoxAction,
  UseBoxActionArgs,
  useBridgeReceipt,
} from '@decent.xyz/box-hooks';

import {
  EstimateGasParameters,
  Hex,
  parseUnits,
  TransactionReceipt
} from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { ClientRendered } from '@decent.xyz/box-ui';
import {
  getAccount,
  getPublicClient,
  sendTransaction,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { Button, CodeBlock, H1, H2, P } from '@/components/common';
import {
  ActionType,
  bigintSerializer,
  BoxActionResponse,
  ChainId,
  EvmTransaction,
  getChainExplorerTxLink,
} from '@decent.xyz/box-common';

import { wagmiConfig } from '@/utils/wagmiConfig';
import { createKernelClient, entryPoint } from '@/utils/kernelConfig';
import { bundlerActions } from 'permissionless';

export const prettyPrint = (obj: any) =>
  JSON.stringify(obj, bigintSerializer, 2);

const vitalik = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

export const BoxActionUser = ({
  getActionArgs,
}: {
  getActionArgs: UseBoxActionArgs;
}) => {
  const { actionResponse, isLoading, error } = useBoxAction(getActionArgs);
  const [hash, setHash] = useState<Hex>();
  const { switchChainAsync } = useSwitchChain();
  const { chain } = useAccount();
  const bridgeId = actionResponse?.bridgeId;
  const { srcChainId, dstChainId } = getActionArgs;
  const [srcTxReceipt, setSrcTxReceipt] = useState<TransactionReceipt>();
  const { receipt: _dstTxReceipt } = useBridgeReceipt({
    bridgeId,
    srcChainId,
    dstChainId,
    srcTxHash: hash,
  });
  const dstTxReceipt = _dstTxReceipt as TransactionReceipt;

  if (error) {
    return <CodeBlock>Error fetching: {prettyPrint(error)}</CodeBlock>;
  }
  if (isLoading || !actionResponse) {
    return <CodeBlock>Fetching box action...</CodeBlock>;
  }

  async function sendZeroDevTx(actionResponse: BoxActionResponse){
    try {
      const kernelClient = await createKernelClient();
  
      const tx = actionResponse.tx as EvmTransaction;

      const userOpHash = await kernelClient.sendUserOperation({
        userOperation: {
          callData: await kernelClient.account.encodeCallData({
            to: tx.to as `0x${string}`,
            value: tx.value as bigint,
            data: tx.data as `0x${string}`,
          })
        }
      })
       
      const bundlerClient = kernelClient.extend(bundlerActions(entryPoint));
      const txReceipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      })

      console.log("Tx receipt: ", txReceipt);
      console.log("View completed UserOp here: https://jiffyscan.xyz/userOpHash/" + userOpHash)
    } catch (e) {
      console.log("Error in zero dev tx: ", e);
    }
  }

  return (
    <div className={'max-w-4xl'}>
      <CodeBlock className={'mb-4'}>{prettyPrint(actionResponse)}</CodeBlock>
      <div className='w-full flex justify-between gap-4 flex-wrap'>
        <Button
          onClick={async () => {
            try {
              const account = getAccount(wagmiConfig);
              const publicClient = getPublicClient(wagmiConfig);
              console.log({chain, srcChainId})
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
              // catch viem polygon error
              try {
                const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
                setSrcTxReceipt(receipt);
              } catch (e) {}
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Send Tx Using EOA
        </Button>

        <Button
          onClick={() => sendZeroDevTx(actionResponse)}
        >
          Send Tx Using Smart Account
        </Button>
      </div>

      {hash && (
        <div className={'mt-6'}>
          <H2>TX Hash:</H2>
          <CodeBlock>
            {srcTxReceipt ? hash : 'Waiting for tx confirmation...'}
          </CodeBlock>
          <a
            href={getChainExplorerTxLink(srcChainId, hash)}
            className={'text-blue-500'}
          >
            view on explorer
          </a>
        </div>
      )}
      {srcTxReceipt && srcChainId !== dstChainId && (
        <div className={'mt-6'}>
          <H2>Bridged TX Hash:</H2>
          <CodeBlock>
            {dstTxReceipt
              ? dstTxReceipt.transactionHash
              : 'Waiting for bridged tx confirmation...'}
          </CodeBlock>
          {dstTxReceipt?.transactionHash && (
            <a
              href={getChainExplorerTxLink(
                dstChainId,
                dstTxReceipt?.transactionHash
              )}
              className={'text-blue-500'}
            >
              view on explorer
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export const Usage = () => {
  const { address: sender } = useAccount();

  const getActionArgs: UseBoxActionArgs = {
    actionType: ActionType.NftMint,
    actionConfig: {
      contractAddress: '0x80F4bABDcba710E6B0C07c760c3C5B061C31b6C0',
      chainId: ChainId.ARBITRUM,
      cost: {
        isNative: true,
        amount: parseUnits('0.00001', 18),
      },
      signature: 'function mint(address to,uint256 numberOfTokens)',
      args: [sender || vitalik, 1n], // need to replace with smart contract wallet address if using smart accounts
    },
    srcChainId: ChainId.ARBITRUM, // need to make sure submitting userOp to correct entry point contract if using smart accounts
    sender: sender!,
    slippage: 1, // 1%
    srcToken: '0x0000000000000000000000000000000000000000',
    dstToken: '0x0000000000000000000000000000000000000000',
    dstChainId: ChainId.ARBITRUM,
  };

  return (
    <>
      <H2>Action Args</H2>
      <CodeBlock>{prettyPrint(getActionArgs)}</CodeBlock>
      <div className={'mt-10'}>
        <H2>Action Response</H2>
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
          apiKey={process.env.NEXT_PUBLIC_NEW_DECENT_API_KEY as string}
        >
          <div className={'max-w-5xl '}>
            <H1>Box Hooks</H1>
            <P>Below you can see the usage of the box hooks.</P>
            {sender ? <Usage /> : <P>Please Connect your wallet</P>}
          </div>
        </BoxHooksContextProvider>
      </ClientRendered>
    </Layout>
  );
}
