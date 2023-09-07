import { Layout } from '@/components/Layouts/Layout';
import { useEffect, useState } from 'react';
import {
  BoxHooksContextProvider,
  useBoxAction,
  UseBoxActionArgs,
  EvmTransaction,
  ActionType,
  bigintSerializer,
  ChainId,
  getChainExplorerTxLink,
  useUsersBalances,
} from '@decent.xyz/box-hooks';
import { ClientRendered } from '@decent.xyz/box-ui';

import { EstimateGasParameters, Hex, parseUnits } from 'viem';
import { useAccount, useSwitchNetwork } from 'wagmi';

import { getAccount, getPublicClient, sendTransaction } from '@wagmi/core';
import { Button, CodeBlock, H1, H2, P } from '@/components/common';
import BeamSelectors from '@/components/Integrations/BeamSelectors';
import BeamFaqs from '@/components/Integrations/Beam/BeamFaqs';

import { SourceContextProvider, useSourceContext, useWalletContext } from '@/lib/contexts';

export const prettyPrint = (obj: any) =>
  JSON.stringify(obj, bigintSerializer, 2);

export const BoxActionUser = ({
  getActionArgs,
}: {
  getActionArgs: UseBoxActionArgs;
}) => {
  const { actionResponse, isLoading, error } = useBoxAction(getActionArgs);
  const [hash, setHash] = useState<Hex>();
  const { switchNetworkAsync } = useSwitchNetwork();

  const { srcChainId, setSrcChainId, srcToken, setSrcToken, txAmount, setTxAmount } = useSourceContext();
  const { chain, address } = useWalletContext();

  useEffect(() => {
    async function handleChainSwitch() {
      if (chain?.id && srcChainId !== chain?.id) {
        await switchNetworkAsync?.(srcChainId);
      };
    };
    handleChainSwitch();
  }, [srcChainId, chain]);

  const { tokens } = useUsersBalances({
    address: address!,
    chainId: chain?.id!,
    enable: Boolean(address),
  })

  if (error) {
    return <CodeBlock>Error fetching: {prettyPrint(error)}</CodeBlock>;
  }
  if (isLoading || !actionResponse) {
    return <CodeBlock>Fetching off-ramp route...</CodeBlock>;
  }

  return (
    <div className={'max-w-4xl'}>
      <BeamSelectors 
        srcChainId={srcChainId} 
        srcToken={srcToken} 
        setSrcChainId={setSrcChainId} 
        setSrcToken={setSrcToken} 
        tokens={tokens} 
        txAmount={txAmount} 
        setTxAmount={setTxAmount} 
      />
      <Button
        onClick={async () => {
          const account = getAccount();
          const publicClient = getPublicClient();

          const tx = actionResponse.tx as EvmTransaction;
          const gas = await publicClient.estimateGas({
            account,
            ...tx,
          } as unknown as EstimateGasParameters);
          const response = await sendTransaction({
            ...tx,
            gas,
          });
          setHash(response.hash);
        }}
      >
        Withdraw!
      </Button>
      {hash && (
        <>
          <P>TX Hash: {hash}</P>
          <a
            href={getChainExplorerTxLink(srcChainId, hash)}
            className={'text-blue-500'}
          >
            watch this on explorer
          </a>
        </>
      )}
      <P>Action Response:</P>
      <CodeBlock className={'mb-4'}>{prettyPrint(actionResponse)}</CodeBlock>
    </div>
  );
};

export const Usage = () => {
  const { srcToken, txAmount } = useSourceContext();
  const { chain, address:sender } = useWalletContext();

  const getActionArgs: UseBoxActionArgs = {
    actionType: ActionType.NftMint,
    actionConfig: {
      contractAddress: process.env.NEXT_PUBLIC_POLYGON_BEAM_ADDRESS as string,
      chainId: ChainId.POLYGON,
      cost: {
        isNative: true,
        amount: parseUnits(txAmount, 18),
      },
      signature: 'function transfer(uint256) payable',
      args: [parseUnits(txAmount, 18)],
    },
    srcChainId: chain?.id!,
    sender: sender!,
    slippage: 1, // 1%
    srcToken: srcToken.address,
    dstToken: '0x0000000000000000000000000000000000000000', // TODO: include destination token selector
    dstChainId: ChainId.POLYGON,
  };

  return (
    <>
      <H2>Try it!</H2>
      <BoxActionUser getActionArgs={getActionArgs} />
    </>
  );
};

export default function ExamplePage() {
  const { address: sender } = useAccount();

  return (
    <Layout>
      <ClientRendered>
        <SourceContextProvider>
          <BoxHooksContextProvider
            apiKey={process.env.NEXT_PUBLIC_DECENT_API_KEY as string}
          >
            <div className={'max-w-5xl space-y-4'}>
              <H1>Ansible Labs | Beam</H1>
              <P>Beam, by Ansible Labs, is a fiat off-ramp.  It enables users to convert tokens in their wallet to fiat in their bank account in under a minute.</P>
              <BeamFaqs />
              {sender ? <><Usage /> 
                <div className='pt-4'>
                  <H2>Key Steps:</H2>
                  <ol className='space-y-2'>
                    <li>1.  Create a Beam account <a className='underline hover:opacity-80 text-indigo-600' href='https://app.beam.ansiblelabs.xyz/login' target='_blank'>here</a></li>
                    <li>2.  Use Box hooks to write a function that will transfer the user's selected token to their Beam account.  We recommend routing to either MATIC on Polygon, USDC on Polygon, or USDC on Arbitrum.</li>
                    <li>3.  Confirm your destination action is a transfer function to the user's Beam account on your preferred network.</li>
                    <li>4.  Use Box ui-components and Beam's API's to shape core functionality to your ideal user experience.</li>
                  </ol>
                </div>
                </> : <P>Please Connect your wallet</P>
              }
            </div>
          </BoxHooksContextProvider>
        </SourceContextProvider>
      </ClientRendered>
    </Layout>
  );
}
