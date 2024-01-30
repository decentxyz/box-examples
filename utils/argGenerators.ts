import { rarible } from './constants/customChains';
import { createPublicClient, http } from 'viem';
import { ApiTests } from '@/utils/types';
import { Web3 } from 'web3';

export const generateArgsMultiHop = async (sender: string) => {
  const AMOUNT = 1000000000000n;
  const BUFFER = 10_00n; // 10% BPS

  var web3 = new Web3('https://mainnet.rpc.rarichain.org/http');
  const { baseFeePerGas } = await web3.eth.getBlock('pending');
  if (!baseFeePerGas) throw new Error('no base fee');
  const PRIORITY_FEE = 2500000000n;
  const maxFeePerGas = (2n * baseFeePerGas) + PRIORITY_FEE;

  const to = sender;
  const l2CallValue = AMOUNT;
  const maxSubmissionCost = AMOUNT + AMOUNT * BUFFER / 100_00n;
  const excessFeeRefundAddress = sender;
  const callValueRefundAddress = sender;
  const gaslimit = 30000n;
  const data = '0x';

  return [
    to,
    l2CallValue,
    maxSubmissionCost,
    excessFeeRefundAddress,
    callValueRefundAddress,
    gaslimit,
    maxFeePerGas,
    data,
  ];
}

type ArgGenerator = (...args: any[]) => Promise<any[]>;

export const argGenerators: Record<ApiTests, ArgGenerator | undefined> = {
  [ApiTests.SWAP_ARB_TO_OP]: undefined,
  [ApiTests.SWAP_OP_SEPOLIA_TO_RARI_TESTNET]: undefined,
  [ApiTests.SWAP_ARB_SEPOLIA_TO_RARI_TESTNET]: undefined,
  [ApiTests.SWAP_RARI_TESTNET_TO_ARB_SEPOLIA]: undefined,
  [ApiTests.SWAP_ARB_TO_RARI]: undefined,
  [ApiTests.SWAP_RARI_TO_ARB]: undefined,
  [ApiTests.MULTI_HOP_OP_ARB_RARI]: generateArgsMultiHop,
};
