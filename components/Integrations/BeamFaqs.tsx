import Accordion from "../Accordian";

const BeamFaqs = () => {
  return (
    <>
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
    </>
  );
};

export default BeamFaqs;