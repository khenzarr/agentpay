"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { ARC_CHAIN_ID } from "@/lib/wagmi";

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { chainId, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return <>{children}</>;

  if (chainId !== ARC_CHAIN_ID) {
    return (
      <>
        <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-medium">Wrong network</p>
          <p className="mt-1 text-amber-200/80">
            Switch to Arc Testnet (chain ID {ARC_CHAIN_ID}) to use AgentPay.
          </p>
          <button
            type="button"
            disabled={isPending}
            onClick={() => switchChain({ chainId: ARC_CHAIN_ID })}
            className="mt-3 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500 disabled:opacity-50"
          >
            {isPending ? "Switching…" : "Switch to Arc Testnet"}
          </button>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}

