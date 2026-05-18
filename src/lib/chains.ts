import {
  ARC_TESTNET_CHAIN_ID,
  ARC_TESTNET_EXPLORER_URL,
  ARC_TESTNET_RPC_URL,
  ARC_TESTNET_USDC_ADDRESS,
  USDC_DECIMALS,
} from "@/lib/constants";

export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  explorerTxUrl: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  usdcAddress: typeof ARC_TESTNET_USDC_ADDRESS;
  usdcDecimals: number;
}

/** Arc Testnet — sole chain for AgentPay MVP */
export const arcTestnetConfig: ChainConfig = {
  id: ARC_TESTNET_CHAIN_ID,
  name: "Arc Testnet",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL ?? ARC_TESTNET_RPC_URL,
  explorerUrl: ARC_TESTNET_EXPLORER_URL,
  explorerTxUrl: `${ARC_TESTNET_EXPLORER_URL}/tx/`,
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  usdcAddress: ARC_TESTNET_USDC_ADDRESS,
  usdcDecimals: USDC_DECIMALS,
};

export const ARC_CHAIN_ID = arcTestnetConfig.id;
