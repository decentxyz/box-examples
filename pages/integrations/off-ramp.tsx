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

import { EstimateGasParameters, Hex, parseUnits } from 'viem';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { ClientRendered, ChainSelector, TokenSelector } from '@decent.xyz/box-ui';
import { getAccount, getPublicClient, sendTransaction } from '@wagmi/core';
import { Button, CodeBlock, H1, H2, P } from '@/components/common';
import Accordion from '@/components/Accordian';

import { IntegrationContextProvider, useIntegrationContext } from '@/hooks/useIntegrationContext';

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

  const { srcChainId, setSrcChainId, srcToken, setSrcToken, chain, address } = useIntegrationContext();

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
      <div className='space-y-2 mb-4'>
        <div className='flex items-center gap-2'>
          <p>What chain do you want to off-ramp from?</p>        
          <div className={'flex bg-white rounded p-3 w-fit'}>
            <ChainSelector srcChainId={srcChainId} setSrcChainId={setSrcChainId} />
          </div>
        </div>
        <div className='flex items-center gap-2 '>
          <p>What token balance would you like to convert to fiat?</p>
          <div className={'flex bg-white rounded p-3 w-fit'}>
            {tokens && <TokenSelector srcToken={srcToken} setSrcToken={setSrcToken} tokens={tokens} />}
          </div>
        </div>
      </div>
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
  const { srcToken, chain, address:sender } = useIntegrationContext();

  const getActionArgs: UseBoxActionArgs = {
    actionType: ActionType.NftMint,
    actionConfig: {
      contractAddress: process.env.NEXT_PUBLIC_POLYGON_BEAM_ADDRESS as string,
      chainId: ChainId.POLYGON,
      cost: {
        isNative: true,
        amount: parseUnits('0.0005', 18), //  TODO: create an input for this in the component above and add it to integration context
      },
      signature: 'function transfer(uint256) payable',
      args: [parseUnits('0.0005', 18)],
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
        <IntegrationContextProvider>
          <BoxHooksContextProvider
            apiKey={process.env.NEXT_PUBLIC_DECENT_API_KEY as string}
          >
            <div className={'max-w-5xl space-y-4'}>
              <H1>Ansible Labs | Beam</H1>
              <P>Beam, by Ansible Labs, is a fiat off-ramp.  It enables users to convert tokens in their wallet to fiat in their bank account in under a minute.</P>
              <Accordion title='Project Overview'>
                <><p className='pb-1'>When a user creates a Beam account, it returns a unique off-ramp address on each chain so that the user simply has to transfer tokens to this address for them to be converted to fiat.  Beam handles off-ramp account creation, conversion to fiat, and deposits to the user's bank account.</p>
                <p className='pt-1'>Beam's principle constraint is chain and token coverage.  For example, users cannot off-ramp from tokens on Optimism.  That's where The Box comes in.  This code example demonstrates how we can bridge and swap from any token a user has on any Box-supported network to a chain & token pair supported by Beam and then transfer to the user's off-ramp address all in one transaction.</p>
                </>
              </Accordion>
              <Accordion title='Project Rationale'>
                <><p className='pb-1'>On & off-ramps are tightly regulated with support restricted to a small number of networks and tokens.  By integrating The Box, users can off-ramp from any token with DeFi liquidity.  The Box equips fiat ramps with best-in-class token & chain coverage, commoditizing this competition vector so that teams like Ansible can focus exclusively on their core value prop: card & bank network execution rates.</p>
                <p className='pt-1'>We are excited to partner with Ansible Labs to provide you with the crypto's most comprehensive off-ramp, as measured by execution rates, speed, and chain & token coverage.</p>
                </>
              </Accordion>
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
        </IntegrationContextProvider>
      </ClientRendered>
    </Layout>
  );
}
