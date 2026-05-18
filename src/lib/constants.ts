export const ARC_TESTNET_CHAIN_ID = 5042002;

export const ARC_TESTNET_RPC_URL = "https://rpc.testnet.arc.network";

export const ARC_TESTNET_EXPLORER_URL = "https://testnet.arcscan.app";

export const ARC_TESTNET_USDC_ADDRESS =
  "0x3600000000000000000000000000000000000000" as const;

export const ERC8183_AGENTIC_COMMERCE_ADDRESS =
  "0x0747EEf0706327138c69792bF28Cd525089e4583" as const;

export const USDC_DECIMALS = 6;

/** Zero hook address — default non-hooked path per Arc ERC-8183 tutorial */
export const ERC8183_ZERO_HOOK =
  "0x0000000000000000000000000000000000000000" as const;

export const ZERO_BYTES = "0x" as const;

/**
 * MVP client-side event indexing start block.
 * Override with NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK once a reliable deployment block is confirmed.
 */
export const ERC8183_INDEXING_FROM_BLOCK = 20_000_000n;
