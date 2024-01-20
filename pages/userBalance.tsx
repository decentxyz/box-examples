import { Layout } from '@/components/Layouts/Layout';
import { useState } from 'react';
import {
  BoxHooksContextProvider,
  useBoxAction,
  UseBoxActionArgs,
  useBridgeReceipt,
  useUsersBalances,
} from '@decent.xyz/box-hooks';

import {
  EstimateGasParameters,
  Hex,
  parseUnits,
  TransactionReceipt,
} from 'viem';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { ClientRendered } from '@decent.xyz/box-ui';
import {
  getAccount,
  getPublicClient,
  sendTransaction,
  waitForTransaction,
} from '@wagmi/core';
import { Button, CodeBlock, H1, H2, P } from '@/components/common';
import {
  ActionType,
  bigintSerializer,
  ChainId,
  EvmTransaction,
  getChainExplorerTxLink,
} from '@decent.xyz/box-common';

export const prettyPrint = (obj: any) =>
  JSON.stringify(obj, bigintSerializer, 2);

export const Usage = () => {
  const { address } = useAccount();
  const x = useUsersBalances({
    address,
    chainId: 137,
    selectChains: [1, 137],
    selectTokens: [
      // '0x0000000000000000000000000000000000000000',
      // '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      // '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    ],
  });
  console.log(x);

  return (
    <div className={'max-w-5xl '}>
      {!address && <P>Please Connect your wallet</P>}
      {
        <div>
          {x?.tokens?.map((t: any, i: number) => <div key={i}>{t.name}</div>)}
        </div>
      }
      <CodeBlock>{prettyPrint(x)}</CodeBlock>
      {/* <div className="relative">
        <div className="absolute">{prettyPrint(x)}</div>
      </div> */}
    </div>
  );
  // const getActionArgs: UseBoxActionArgs = {
  //   actionType: ActionType.NftMint,
  //   actionConfig: {
  //     contractAddress: '0x3007E0eB44222AC69E1D3c93A9e50F9CA73F53a1',
  //     chainId: ChainId.ARBITRUM,
  //     cost: {
  //       isNative: true,
  //       amount: parseUnits('0.00005', 18),
  //     },
  //   },
  //   srcChainId: ChainId.POLYGON,
  //   sender: sender!,
  //   slippage: 1, // 1%
  //   srcToken: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC on Polygon
  //   dstToken: '0x0000000000000000000000000000000000000000', // ETH
  //   dstChainId: ChainId.ARBITRUM,
  // };

  // return (
  //   <>
  //     <H2>Action Args</H2>
  //     <CodeBlock>{prettyPrint(getActionArgs)}</CodeBlock>
  //     <div className={'mt-10'}>
  //       <H2>Action Response</H2>
  //       <BoxActionUser getActionArgs={getActionArgs} />
  //     </div>
  //   </>
  // );
};

export default function ExamplePage() {
  return (
    <Layout>
      <ClientRendered>
        <BoxHooksContextProvider
          apiKey={process.env.NEXT_PUBLIC_DECENT_API_KEY as string}
        >
          <Usage />
        </BoxHooksContextProvider>
      </ClientRendered>
    </Layout>
  );
}

/*
[
    {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18,
        "address": "0x0000000000000000000000000000000000000000",
        "isNative": true,
        "logo": "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025",
        "chainId": 1,
        "balanceFloat": 0.00267212,
        "balance": "2672120000000000n"
    },
    {
        "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "decimals": 6,
        "name": "USD Coin",
        "symbol": "USDC",
        "totalSupply": {
            "formatted": "0.022858921981337992",
            "value": "22858921981337992n"
        },
        "isNative": false,
        "chainId": 1,
        "logo": "https://static.alchemyapi.io/images/assets/3408.png",
        "balanceFloat": 0,
        "balance": "0n"
    },
    {
        "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "decimals": 18,
        "name": "Dai Stablecoin",
        "symbol": "DAI",
        "totalSupply": {
            "formatted": "3690888417.044816602110069885",
            "value": "3690888417044816602110069885n"
        },
        "isNative": false,
        "chainId": 1,
        "logo": "https://static.alchemyapi.io/images/assets/4943.png",
        "balanceFloat": 0,
        "balance": "0n"
    },
    {
        "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "decimals": 6,
        "name": "Tether USD",
        "symbol": "USDT",
        "totalSupply": {
            "formatted": "0.044006715861828943",
            "value": "44006715861828943n"
        },
        "isNative": false,
        "chainId": 1,
        "logo": "https://static.alchemyapi.io/images/assets/825.png",
        "balanceFloat": 0,
        "balance": "0n"
    },
    {
        "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "decimals": 18,
        "name": "Wrapped Ether",
        "symbol": "WETH",
        "totalSupply": {
            "formatted": "3247209.623854845942900368",
            "value": "3247209623854845942900368n"
        },
        "isNative": false,
        "chainId": 1,
        "logo": "https://static.alchemyapi.io/images/assets/2396.png",
        "balanceFloat": 0,
        "balance": "0n"
    },
    {
        "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        "decimals": 8,
        "name": "Wrapped BTC",
        "symbol": "WBTC",
        "totalSupply": {
            "formatted": "0.000015816898879455",
            "value": "15816898879455n"
        },
        "isNative": false,
        "chainId": 1,
        "logo": "https://static.alchemyapi.io/images/assets/3717.png",
        "balanceFloat": 0,
        "balance": "0n"
    }
]
*/
