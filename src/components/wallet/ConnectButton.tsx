"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
      >
        {address.slice(0, 6)}…{address.slice(-4)}
        {chain ? ` · ${chain.name}` : ""}
      </button>
    );
  }

  // Prefer injected connector first for browser-extension wallets (MetaMask included).
  // Fallback to MetaMask connector if injected is unavailable.
  const connector =
    connectors.find((c) => c.id === "injected" && c.ready) ??
    connectors.find((c) => c.id === "metaMask" && c.ready) ??
    connectors.find((c) => c.ready) ??
    connectors.find((c) => c.id === "injected") ??
    connectors.find((c) => c.id === "metaMask") ??
    connectors[0];

  const label = isPending
    ? "Connecting…"
    : error
      ? "Retry connect"
      : "Connect wallet";

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={!connector || isPending}
        onClick={() => connector && connect({ connector })}
        className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
      >
        {label}
      </button>
      {error ? (
        <span className="text-xs text-amber-300" title={error.message}>
          {error.message || "Wallet connection failed. Check extension prompt."}
        </span>
      ) : null}
    </div>
  );
}



