import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { wagmiSetup } from "@decent.xyz/box-common";

const { chains, transports } = wagmiSetup;

export const wagmiConfig = getDefaultConfig({
  appName: "Decent Demo",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string,
  chains,
  transports,
  ssr: true,
});
