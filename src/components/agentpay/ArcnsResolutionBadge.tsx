"use client";

import { ArcScanAddressLink } from "@/components/agentpay/ArcScanLink";
import { useArcnsNameResolution } from "@/hooks/useArcnsNameResolution";

export function ArcnsResolutionBadge({ name }: { name?: string }) {
  const { data, isLoading } = useArcnsNameResolution(name);

  if (!name) {
    return <p className="text-xs text-zinc-600">Optional .arc / .circle identity — not set</p>;
  }

  if (isLoading) {
    return <p className="text-xs text-zinc-500">ArcNS: resolving {name}…</p>;
  }

  if (data?.state === "resolved" && data.address) {
    return (
      <p className="text-xs text-zinc-500">
        ArcNS: <span className="text-sky-400">{name}</span> → <ArcScanAddressLink address={data.address as `0x${string}`} />
      </p>
    );
  }

  return (
    <p className="text-xs text-zinc-600">
      ArcNS: <span className="text-sky-400">{name}</span> (unresolved, fallback to wallet address)
    </p>
  );
}
