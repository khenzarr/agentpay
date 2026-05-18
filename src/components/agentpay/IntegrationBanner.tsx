import { ERC8183_ABI_STATUS, isErc8183IntegrationReady } from "@/lib/erc8183";

export function IntegrationBanner() {
  const ready = isErc8183IntegrationReady();

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${
        ready
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
          : "border-amber-500/30 bg-amber-500/10 text-amber-100"
      }`}
    >
      {ready ? (
        <>
          <span className="font-medium">Contract integration:</span> ERC-8183 ABI
          loaded from Arc official tutorial ({ERC8183_ABI_STATUS}). Tutorial-subset
          integration only; full standard compliance is not claimed.
        </>
      ) : (
        <>
          <span className="font-medium">Blocked:</span> ERC-8183 ABI pending
          verification. Contract writes are disabled until ABI is verified.
        </>
      )}
    </div>
  );
}


