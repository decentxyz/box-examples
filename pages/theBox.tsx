import { ActionType, ChainId, TheBox } from '@decent.xyz/the-box';
import { parseUnits } from 'viem';
import { Layout } from '@/components/Layouts/Layout';
import { submitWallet } from '@/lib/trm';
import { useEffect } from 'react';
import { useWalletContext } from '@/lib/contexts';

export default function ExamplePage() {
  const { address, chain } = useWalletContext();
  async function screenWallet() {
    let risky = false;
    if (address && chain) {
      risky = await submitWallet(chain?.name, address)
    };
    return {
      disable: risky,
      message: `not today, criminal.`
    }
  };

  return (
    <Layout>
      <h1 className={'font-semibold text-2xl mb-2'}>The Box Example</h1>
      <TheBox
        className="rounded-lg border shadow-md bg-white dark"
        paymentButtonText="MINT ME"
        actionType={ActionType.NftMint}
        actionConfig={{
          contractAddress: '0x3007E0eB44222AC69E1D3c93A9e50F9CA73F53a1',
          chainId: ChainId.ARBITRUM,
          cost: {
            isNative: true,
            amount: parseUnits('0.00005', 18),
          },
        }}
        disableGuard={() => screenWallet()}
        apiKey={process.env.NEXT_PUBLIC_DECENT_API_KEY as string}
      />
    </Layout>
  );
}
