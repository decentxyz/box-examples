import { createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient } from "@zerodev/sdk"
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator"
import { http, createPublicClient } from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { arbitrum } from "viem/chains"
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless"
 
const BUNDLER_RPC = process.env.NEXT_PUBLIC_BUNDLER_RPC
const PAYMASTER_RPC = process.env.NEXT_PUBLIC_PAYMASTER_RPC
 
const chain = arbitrum
export const entryPoint = ENTRYPOINT_ADDRESS_V07
 
export const createKernelClient = async () => {
  // Construct a signer
  const privateKey = generatePrivateKey()
  const signer = privateKeyToAccount(privateKey)
 
  // Construct a public client
  const publicClient = createPublicClient({
    transport: http(BUNDLER_RPC),
  })
 
  // Construct a validator
  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer,
    entryPoint,
  })
 
  // Construct a Kernel account
  const account = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint,
  })
 
  // Construct a Kernel account client
  const kernelClient = createKernelAccountClient({
    account,
    chain,
    entryPoint,
    bundlerTransport: http(BUNDLER_RPC),
    middleware: {
      sponsorUserOperation: async ({ userOperation }) => {
        const zerodevPaymaster = createZeroDevPaymasterClient({
          chain,
          entryPoint,
          transport: http(PAYMASTER_RPC),
        })
        return zerodevPaymaster.sponsorUserOperation({
          userOperation,
          entryPoint,
        })
      },
    },
  })

  return kernelClient;
}