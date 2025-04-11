import { Layout } from "@/components/Layouts/Layout";
import { parseUnits } from "viem";
import {
  ChainId,
  ActionType,
  EvmTransaction,
  SwapDirection,
  BoxActionRequest,
  BoxActionResponse,
  bigintDeserializer,
  bigintSerializer,
} from "@decent.xyz/box-common";
import { useAccount, useSwitchChain } from "wagmi";
import { sendTransaction } from "@wagmi/core";
import { useState } from "react";
import { wagmiConfig } from "@/utils/wagmiConfig";

const BASE_URL = "https://ghost-v1-0-0.api.decentxyz.com/api/getBoxAction";

export default function ExamplePage() {
  const { address: account, chain } = useAccount();
  const [txHash, setTxHash] = useState("");
  const { switchChain } = useSwitchChain();
  const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

  const runTx = async () => {
    try {
      const txConfig: BoxActionRequest = {
        sender: account!,
        srcToken: "0x0000000000000000000000000000000000000000",
        dstToken: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // usdc
        srcChainId: ChainId.ARBITRUM,
        dstChainId: ChainId.BASE,
        slippage: 1,
        actionType: ActionType.SwapAction,
        actionConfig: {
          // starting chain
          chainId: ChainId.ARBITRUM,
          amount: parseUnits("0.0001", 18),
          swapDirection: SwapDirection.EXACT_AMOUNT_IN,
          receiverAddress: vitalik,
        },
      };

      const { config, response } = await generateResponse(txConfig);

      if (chain?.id !== config?.srcChainId) {
        switchChain?.({ chainId: Number(config?.srcChainId) });
        // note; if ERC20, check for token approval here before sending tx
      } else {
        const tx = response?.tx as EvmTransaction;
        const hash = await sendTransaction(wagmiConfig, tx);
        setTxHash(hash);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout>
      <h1 className={"font-semibold text-2xl mb-2"}>Box API's</h1>
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
        "x-api-key": process.env.NEXT_PUBLIC_DECENT_KEY as string,
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
    console.error("Error getting response", e);
    return {
      config: null,
      response: null,
    };
  }
};
