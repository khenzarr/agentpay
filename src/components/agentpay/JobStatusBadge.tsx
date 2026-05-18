import { getJobStatusLabel } from "@/lib/erc8183";

const styles: Record<string, string> = {
  Open: "bg-zinc-500/20 text-zinc-200 border-zinc-500/30",
  Funded: "bg-sky-500/20 text-sky-100 border-sky-500/30",
  Submitted: "bg-amber-500/20 text-amber-100 border-amber-500/30",
  Completed: "bg-emerald-500/20 text-emerald-100 border-emerald-500/30",
  Rejected: "bg-red-500/20 text-red-100 border-red-500/30",
  Expired: "bg-zinc-600/20 text-zinc-300 border-zinc-600/30",
  Unknown: "bg-zinc-700/20 text-zinc-400 border-zinc-600/30",
};

export function JobStatusBadge({ status }: { status: number }) {
  const label = getJobStatusLabel(status);
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[label] ?? styles.Unknown}`}
    >
      {label}
    </span>
  );
}

