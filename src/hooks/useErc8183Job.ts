"use client";

import { useReadContract } from "wagmi";
import {
  erc8183Abi,
  erc8183ContractAddress,
  type Erc8183JobTuple,
} from "@/lib/erc8183";
import { ARC_CHAIN_ID } from "@/lib/wagmi";

export function useErc8183Job(jobId: bigint | undefined) {
  return useReadContract({
    address: erc8183ContractAddress,
    abi: erc8183Abi,
    functionName: "getJob",
    args: jobId !== undefined ? [jobId] : undefined,
    chainId: ARC_CHAIN_ID,
    query: {
      enabled: jobId !== undefined,
    },
  });
}

export function parseJobResult(data: unknown): Erc8183JobTuple | undefined {
  if (!data) return undefined;

  if (typeof data === "object" && data !== null && "client" in data) {
    return data as Erc8183JobTuple;
  }

  if (Array.isArray(data) && data.length >= 9) {
    const [
      id,
      client,
      provider,
      evaluator,
      description,
      budget,
      expiredAt,
      status,
      hook,
    ] = data;
    return {
      id: id as bigint,
      client: client as `0x${string}`,
      provider: provider as `0x${string}`,
      evaluator: evaluator as `0x${string}`,
      description: description as string,
      budget: budget as bigint,
      expiredAt: expiredAt as bigint,
      status: Number(status),
      hook: hook as `0x${string}`,
    };
  }

  return undefined;
}
