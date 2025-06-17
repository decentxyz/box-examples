import { Layout } from "@/components/Layouts/Layout";
import { parseUnits, parseAbiItem, encodeFunctionData } from "viem";
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

  const nft = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

  const data = encodeFunctionData({
    abi: [
      parseAbiItem("function payment(address, (address,uint256)[], string)"),
    ],
    functionName: "payment",
    args: [
      "0x0000000000000000000000000000000000000000",
      [
        ["0x1981a1fB1FA463268E6FcAf473625a677Dca9AFE", 581339378881948n],
        ["0xa50E658C75dd31C8a1FD29d48F3de26e6d79df5D", 2921303411467n],
      ],
      "6807b440859a42c77d15cce8",
    ],
  });

  const runTx = async () => {
    try {
      const txConfig: BoxActionRequest = {
        sender: account!,
        srcToken: "0x0000000000000000000000000000000000000000",
        dstToken: "0x0000000000000000000000000000000000000000",
        srcChainId: ChainId.BASE,
        dstChainId: ChainId.BASE,
        slippage: 1,
        actionType: ActionType.EvmCalldataTx,
        actionConfig: {
          contractAddress: nft,
          chainId: ChainId.BASE,
          cost: {
            isNative: true,
            amount: 581339378881948n,
          },
          data: data,
        },
      };
      console.log("TEST HERE: ", txConfig)

      const { config, response } = await generateResponse(txConfig);

      console.log("TEST ")

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
        Send Tx!
      </button>
      <p className="py-4">{txHash}</p>
    </Layout>
  );
}

const generateResponse = async (apiArgs: BoxActionRequest) => {
  const url = `${BASE_URL}?arguments=${JSON.stringify(apiArgs, bigintSerializer)}`;
  console.log("TEST URL: ", url)
  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_DECENT_KEY as string,
      },
    });
    const data = await response.text();
    console.log("TEST DATA: ", data)

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
