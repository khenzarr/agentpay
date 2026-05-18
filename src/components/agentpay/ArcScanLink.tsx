import { getArcscanTxUrl, getArcscanAddressUrl } from "@/lib/arcscan";

export function ArcScanTxLink({ hash }: { hash: string }) {
  return (
    <a
      href={getArcscanTxUrl(hash)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sky-400 hover:underline"
    >
      View on ArcScan ↗
    </a>
  );
}

export function ArcScanAddressLink({
  address,
  label,
}: {
  address: string;
  label?: string;
}) {
  return (
    <a
      href={getArcscanAddressUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs text-sky-400 hover:underline"
    >
      {label ?? `${address.slice(0, 8)}…${address.slice(-6)}`}
    </a>
  );
}

