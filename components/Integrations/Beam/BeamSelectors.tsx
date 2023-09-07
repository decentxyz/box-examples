import {
  ChainSelector,
  TokenSelector,
  UserTokenInfo
} from "@decent.xyz/box-ui";
import { SourceContext } from "@/lib/contexts";
import { useRef, FormEvent } from "react";

interface BeamSelectors extends SourceContext {
  tokens: UserTokenInfo[];
}

const BeamSelectors = ({ srcChainId, setSrcChainId, srcToken, setSrcToken, txAmount, setTxAmount, tokens }: BeamSelectors ) => {
  const inputRef = useRef<HTMLInputElement>(null);
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    console.log("running")
    e.preventDefault();
    const inputValue = inputRef?.current?.value!;
    console.log("HEREE", inputValue)
    setTxAmount(inputValue);
  }

  return (
    <>
      <div className='space-y-2 mb-4'>
        <div className='flex items-center gap-2'>
          <p>What chain do you want to off-ramp from?</p>        
          <div className={'flex bg-white rounded p-3 w-fit'}>
            <ChainSelector srcChainId={srcChainId} setSrcChainId={setSrcChainId} />
          </div>
        </div>
        
        <div className='flex items-center gap-2'>
          <p>What token balance would you like to convert to fiat?</p>
          <div className={'flex bg-white rounded p-3 w-fit'}>
            {tokens && <TokenSelector srcToken={srcToken} setSrcToken={setSrcToken} tokens={tokens} />}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <p>How much would you like to off-ramp?<br></br>  <span className="text-sm">Value cannot exceed your selected token balance.</span></p>
          <div className="flex items-center gap-2">
            <form onSubmit={handleSubmit}>
              <input
                className="p-2 rounded-md w-fit"
                type="text"
                placeholder={txAmount}
                ref={inputRef}
              />
              <button type="submit">Confirm</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default BeamSelectors;