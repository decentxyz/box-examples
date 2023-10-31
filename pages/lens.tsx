import { ActionType, ChainId, TheBox } from '@decent.xyz/the-box';
import { parseUnits } from 'viem';
import { Layout } from '@/components/Layouts/Layout';
import { CodeBlock, P } from '@/components/common';

export default function ExamplePage() {
  return (
    <Layout>
      <h1 className={'font-semibold text-2xl mb-2'}>The Box Example</h1>
      <P>Note: to properly load the styles, be sure to include:</P>
      <CodeBlock>{`import '@decent.xyz/the-box/index.css';`}</CodeBlock>
      <TheBox
        className="rounded-lg border shadow-md bg-white dark"
        paymentButtonText="Pay USDC and Mint"
        actionType={ActionType.NftMint}
        actionConfig={{
          contractAddress: '0xC1E77eE73403B8a7478884915aA599932A677870',
          chainId: ChainId.POLYGON,
          signature: "function actWithSig(uint256,uint256,uint256,uint256[],uint256[],address,bytes)",
          args: ["0x28","0x28-0x0d","0xdd","0x","0x","0xa878101e04518693ABE7fccd03778174A2B08159",{}],
          cost: {
            isNative: false,
            amount: 10000n,
            tokenAddress: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e"
          },
        }}
        enableTestnets={true}
        apiKey={process.env.NEXT_PUBLIC_DECENT_API_KEY as string}
      />
    </Layout>
  );
}