import type { Abi } from "viem";
import {
  erc8183AgenticCommerceAbi,
  ERC8183_JOB_STATUS_NAMES,
  type Erc8183JobStatusName,
} from "@/abi/erc8183AgenticCommerce";
import {
  ERC8183_AGENTIC_COMMERCE_ADDRESS,
  ERC8183_ZERO_HOOK,
  ZERO_BYTES,
} from "@/lib/constants";

/**
 * ABI verified from Arc official ERC-8183 tutorial (partial MVP subset).
 * On-chain proxy verification: https://testnet.arcscan.app/address/0x0747EEf0706327138c69792bF28Cd525089e4583
 */
export const ERC8183_ABI_STATUS = "VERIFIED" as const;

export const erc8183ContractAddress = ERC8183_AGENTIC_COMMERCE_ADDRESS;

export const erc8183Abi = erc8183AgenticCommerceAbi as Abi;

export function isErc8183IntegrationReady(): boolean {
  return ERC8183_ABI_STATUS === "VERIFIED";
}

export function getJobStatusLabel(status: number): Erc8183JobStatusName | "Unknown" {
  return ERC8183_JOB_STATUS_NAMES[status] ?? "Unknown";
}

export const erc8183ZeroHook = ERC8183_ZERO_HOOK;
export const erc8183EmptyOptParams = ZERO_BYTES;

export type Erc8183JobTuple = {
  id: bigint;
  client: `0x${string}`;
  provider: `0x${string}`;
  evaluator: `0x${string}`;
  description: string;
  budget: bigint;
  expiredAt: bigint;
  status: number;
  hook: `0x${string}`;
};
