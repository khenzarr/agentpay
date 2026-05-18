"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import {
  erc8183Abi,
  erc8183ContractAddress,
  erc8183EmptyOptParams,
} from "@/lib/erc8183";
import { ARC_TESTNET_USDC_ADDRESS } from "@/lib/constants";
import { erc20Abi } from "@/abi/erc20";
import { ARC_CHAIN_ID } from "@/lib/wagmi";

export function useApproveUsdc() {
  const { writeContractAsync, data: hash, isPending, error, reset } =
    useWriteContract();

  const receipt = useWaitForTransactionReceipt({ hash, chainId: ARC_CHAIN_ID });

  async function approve(spender: `0x${string}`, amount: bigint) {
    return writeContractAsync({
      address: ARC_TESTNET_USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, amount],
      chainId: ARC_CHAIN_ID,
    });
  }

  return { approve, hash, isPending, isConfirming: receipt.isLoading, isSuccess: receipt.isSuccess, error, reset, receipt };
}

export function useSetBudget() {
  const { writeContractAsync, data: hash, isPending, error, reset } =
    useWriteContract();

  const receipt = useWaitForTransactionReceipt({ hash, chainId: ARC_CHAIN_ID });

  async function setBudget(jobId: bigint, amount: bigint) {
    return writeContractAsync({
      address: erc8183ContractAddress,
      abi: erc8183Abi,
      functionName: "setBudget",
      args: [jobId, amount, erc8183EmptyOptParams],
      chainId: ARC_CHAIN_ID,
    });
  }

  return { setBudget, hash, isPending, isConfirming: receipt.isLoading, isSuccess: receipt.isSuccess, error, reset, receipt };
}

export function useFundJob() {
  const { writeContractAsync, data: hash, isPending, error, reset } =
    useWriteContract();

  const receipt = useWaitForTransactionReceipt({ hash, chainId: ARC_CHAIN_ID });

  async function fund(jobId: bigint) {
    return writeContractAsync({
      address: erc8183ContractAddress,
      abi: erc8183Abi,
      functionName: "fund",
      args: [jobId, erc8183EmptyOptParams],
      chainId: ARC_CHAIN_ID,
    });
  }

  return { fund, hash, isPending, isConfirming: receipt.isLoading, isSuccess: receipt.isSuccess, error, reset, receipt };
}
