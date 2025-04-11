import { Layout } from '@/components/Layouts/Layout';

import { BoxHooksContextProvider } from '@decent.xyz/box-hooks';

import { ClientRendered } from '@decent.xyz/box-ui';
import { CodeBlock, H1, P } from '@/components/common';
import { SimpleTokenSelectorUsage } from '@/components/SimpleTokenSelectorUsage';
import { ChainSelectorUsage } from '@/components/ChainSelectorUsage';
import { useState } from 'react';
import { TokenSelectorUsage } from '@/components/TokenSelectorUsage';
import { ChainId } from '@decent.xyz/box-common';

import '@decent.xyz/the-box/index.css';

export default function ExamplePage() {
  const [chainId, setChainId] = useState<ChainId>(ChainId.ARBITRUM);

  return (
    <Layout>
      <ClientRendered>
        <BoxHooksContextProvider
          apiKey={process.env.NEXT_PUBLIC_DECENT_KEY as string}
        >
          <ClientRendered>
            <BoxHooksContextProvider
              apiKey={process.env.NEXT_PUBLIC_DECENT_KEY as string}
            >
              <div className={'max-w-5xl '}>
                <H1>Box UI</H1>
                <P>Note: to properly load the styles, be sure to include:</P>
                <CodeBlock>
                  {`import '@decent.xyz/box-ui/index.css';`}
                </CodeBlock>
                <P>At the top-level of your NextJS/React application.</P>
                <P>Below you can see the usage of the box hooks.</P>
                <ChainSelectorUsage chainId={chainId} setChainId={setChainId} />
                <TokenSelectorUsage chainId={chainId} />
                <SimpleTokenSelectorUsage chainId={chainId} />
              </div>
            </BoxHooksContextProvider>
          </ClientRendered>
        </BoxHooksContextProvider>
      </ClientRendered>
    </Layout>
  );
}
