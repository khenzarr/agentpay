"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import type { Hex } from "viem";
import {
  erc8183Abi,
  erc8183ContractAddress,
  erc8183EmptyOptParams,
} from "@/lib/erc8183";
import { ARC_CHAIN_ID } from "@/lib/wagmi";

export function useSubmitDeliverable() {
  const { writeContractAsync, data: hash, isPending, error, reset } =
    useWriteContract();

  const receipt = useWaitForTransactionReceipt({ hash, chainId: ARC_CHAIN_ID });

  async function submit(jobId: bigint, deliverableHash: Hex) {
    return writeContractAsync({
      address: erc8183ContractAddress,
      abi: erc8183Abi,
      functionName: "submit",
      args: [jobId, deliverableHash, erc8183EmptyOptParams],
      chainId: ARC_CHAIN_ID,
    });
  }

  return {
    submit,
    hash,
    isPending,
    isConfirming: receipt.isLoading,
    isSuccess: receipt.isSuccess,
    error,
    reset,
    receipt,
  };
}
