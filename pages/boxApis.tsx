import { Layout } from '@/components/Layouts/Layout';
import { parseUnits } from 'viem';
import {
  ChainId,
  ActionType,
  EvmTransaction,
  SwapDirection,
  BoxActionRequest,
  BoxActionResponse,
} from '@decent.xyz/box-common';
import { useAccount, useSwitchChain } from 'wagmi';
import { sendTransaction } from '@wagmi/core';
import { useState } from 'react';
import { wagmiConfig } from '@/utils/wagmiConfig';

const BASE_URL = 'https://box-v2.api.decent.xyz/api/getBoxAction';

export default function ExamplePage() {
  const { address: account, chain } = useAccount();
  const [txHash, setTxHash] = useState('');
  const { switchChain } = useSwitchChain();
  const vitalik = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

  const runTx = async () => {
    // https://box-v2.api.decent.xyz/api/getBoxAction?arguments={%22sender%22:%220x755bdaE53b234C6D1b7Be9cE7F316CF8f03F2533%22,%22srcToken%22:%220x0000000000000000000000000000000000000000%22,%22dstToken%22:%220x0000000000000000000000000000000000000000%22,%22srcChainId%22:8453,%22dstChainId%22:666666666,%22slippage%22:1,%22actionType%22:%22swap-action%22,%22actionConfig%22:{%22chainId%22:8453,%22swapDirection%22:%22exact-amount-in%22,%22receiverAddress%22:%220x755bdaE53b234C6D1b7Be9cE7F316CF8f03F2533%22,%22amount%22:%2210000000000000000n%22}}
    try {
      const txConfig: BoxActionRequest = {
        sender: account || vitalik,
        // native token on src chain (eth)
        srcToken: '0x0000000000000000000000000000000000000000',
        // native token on dst chain (degen)
        dstToken: '0x0000000000000000000000000000000000000000',
        srcChainId: ChainId.ARBITRUM,
        dstChainId: ChainId.DEGEN,
        slippage: 1,
        actionType: ActionType.SwapAction,
        actionConfig: {
          // starting chain
          chainId: ChainId.ARBITRUM,
          amount: parseUnits('0.0001', 18),
          swapDirection: SwapDirection.EXACT_AMOUNT_IN,
          receiverAddress: account || vitalik,
        },
      };

      const { config, response } = await generateResponse(txConfig);

      if (chain?.id !== config?.srcChainId) {
        switchChain?.({ chainId: Number(config?.srcChainId)});
      } else {
        const tx = response?.tx as EvmTransaction;
        const hash = await sendTransaction(wagmiConfig, tx);
        setTxHash(hash);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <h1 className={'font-semibold text-2xl mb-2'}>Box API's</h1>
      <button
        onClick={() => runTx()}
        className="bg-black px-5 py-2 rounded-full text-white hover:opacity-80"
      >
        Swap ETH on arbitrum to DEGEN on Degen
      </button>
      <p className="py-4">{txHash}</p>
    </Layout>
  );
}

const generateResponse = async (apiArgs: BoxActionRequest) => {
  const url = `${BASE_URL}?arguments=${JSON.stringify(apiArgs, bigintSerializer)}`;
  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_DECENT_API_KEY as string,
      },
    });
    const data = await response.text();

    const actionResponse: BoxActionResponse = JSON.parse(
      data,
      bigintDeserializer
    );
    return {
      config: apiArgs,
      response: actionResponse,
    };
  } catch (e) {
    console.error('Error getting response', e);
    return {
      config: null,
      response: null,
    };
  }
};

const bigintSerializer = (key: string, value: unknown): unknown => {
  if (typeof value === 'bigint') {
    return value.toString() + 'n';
  }

  return value;
};

const bigintDeserializer = (key: string, value: unknown): unknown => {
  if (typeof value === 'string' && /^-?\d+n$/.test(value)) {
    return BigInt(value.slice(0, -1));
  }

  return value;
};
