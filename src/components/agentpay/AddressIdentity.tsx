"use client";

import { ArcScanAddressLink } from "@/components/agentpay/ArcScanLink";
import { useArcnsNameResolution } from "@/hooks/useArcnsNameResolution";

export function AddressIdentity({
  label,
  address,
  primaryName,
}: {
  label: string;
  address?: `0x${string}`;
  primaryName?: string;
}) {
  const { data, isLoading } = useArcnsNameResolution(primaryName);

  if (!address) {
    return <p className="text-xs text-zinc-500">{label}: not connected</p>;
  }

  if (!primaryName) {
    return (
      <p className="text-xs text-zinc-500">
        {label}: <ArcScanAddressLink address={address} />
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="text-xs text-zinc-500">
        {label}: resolving <span className="text-sky-400">{primaryName}</span>…
      </p>
    );
  }

  if (data?.state === "resolved" && data.address) {
    const resolvedMatches = data.address.toLowerCase() === address.toLowerCase();
    return (
      <p className="text-xs text-zinc-500">
        {label}: <span className="text-sky-400">{primaryName}</span>
        {resolvedMatches ? (
          <span className="text-emerald-300"> (verified)</span>
        ) : (
          <span className="text-amber-300"> (name/address mismatch)</span>
        )}
        <span className="text-zinc-400"> · wallet </span>
        <ArcScanAddressLink address={address} />
      </p>
    );
  }

  return (
    <p className="text-xs text-zinc-500">
      {label}: <span className="text-sky-400">{primaryName}</span>
      <span className="text-amber-300"> (ArcNS optional/partial)</span>
      <span className="text-zinc-400"> · fallback </span>
      <ArcScanAddressLink address={address} />
    </p>
  );
}
