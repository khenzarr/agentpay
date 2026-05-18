"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import type { Address } from "viem";
import {
  erc8183Abi,
  erc8183ContractAddress,
  erc8183ZeroHook,
} from "@/lib/erc8183";
import { ARC_CHAIN_ID } from "@/lib/wagmi";

export interface CreateJobParams {
  provider: Address;
  evaluator: Address;
  expiredAt: bigint;
  description: string;
}

export interface CreateJobResult {
  txHash: `0x${string}`;
}

export function useCreateJob() {
  const {
    writeContract,
    writeContractAsync,
    data: hash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const receipt = useWaitForTransactionReceipt({
    hash,
    chainId: ARC_CHAIN_ID,
  });

  async function createJob(params: CreateJobParams): Promise<CreateJobResult> {
    const txHash = await writeContractAsync({
      address: erc8183ContractAddress,
      abi: erc8183Abi,
      functionName: "createJob",
      args: [
        params.provider,
        params.evaluator,
        params.expiredAt,
        params.description,
        erc8183ZeroHook,
      ],
      chainId: ARC_CHAIN_ID,
    });

    return { txHash };
  }

  return {
    createJob,
    writeContract,
    hash,
    isPending,
    isConfirming: receipt.isLoading,
    isSuccess: receipt.isSuccess,
    error,
    reset,
    receipt,
  };
}



