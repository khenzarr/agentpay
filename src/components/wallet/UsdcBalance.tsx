"use client";

import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from "@/abi/erc20";
import { ARC_TESTNET_USDC_ADDRESS } from "@/lib/constants";
import { formatUsdcAmount } from "@/lib/usdc";
import { ARC_CHAIN_ID } from "@/lib/wagmi";

export function UsdcBalance() {
  const { address, isConnected } = useAccount();
  const { data, isLoading } = useReadContract({
    address: ARC_TESTNET_USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: ARC_CHAIN_ID,
    query: { enabled: !!address },
  });

  if (!isConnected) return null;

  return (
    <span className="text-xs text-zinc-400">
      USDC:{" "}
      {isLoading || data === undefined
        ? "…"
        : `${formatUsdcAmount(data as bigint)}`}
    </span>
  );
}

