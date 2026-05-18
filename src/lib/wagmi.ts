import { createConfig, http } from "wagmi";
import { injected, metaMask } from "@wagmi/connectors";
import { defineChain } from "viem";
import { arcTestnetConfig, ARC_CHAIN_ID } from "@/lib/chains";

export const arcTestnet = defineChain({
  id: arcTestnetConfig.id,
  name: arcTestnetConfig.name,
  nativeCurrency: arcTestnetConfig.nativeCurrency,
  rpcUrls: {
    default: { http: [arcTestnetConfig.rpcUrl] },
    public: { http: [arcTestnetConfig.rpcUrl] },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: arcTestnetConfig.explorerUrl,
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  // Keep connector list minimal to avoid duplicate wallet options in modal UIs.
  connectors: [metaMask(), injected()],
  transports: {
    [ARC_CHAIN_ID]: http(arcTestnetConfig.rpcUrl),
  },
  ssr: true,
});

export { ARC_CHAIN_ID };
