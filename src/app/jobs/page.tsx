"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IntegrationBanner } from "@/components/agentpay/IntegrationBanner";
import { JobsStats } from "@/components/agentpay/JobsStats";
import { useAgentPayJobs, type JobsFilter } from "@/hooks/useAgentPayJobs";
import { JobStatusBadge } from "@/components/agentpay/JobStatusBadge";
import { ArcScanAddressLink } from "@/components/agentpay/ArcScanLink";
import { formatUsdcAmount } from "@/lib/usdc";
import { useAgentPayManualJob } from "@/hooks/useAgentPayJobs";

export default function JobsPage() {
  const [filter, setFilter] = useState<JobsFilter>("all");
  const [manualJobId, setManualJobId] = useState("21683");
  const {
    jobs,
    isLoading,
    error,
    refetch,
    fromBlock,
    toBlock,
    isToBlockFixed,
    hasCustomFromBlock,
    hasCustomToBlock,
    stats,
    diagnostics,
  } =
    useAgentPayJobs(filter);
  const manualJob = useAgentPayManualJob(manualJobId);

  const indexedRangeLabel = useMemo(
    () =>
      `Indexed demo range: from block ${fromBlock.toString()} to ${
        toBlock ? toBlock.toString() : "latest"
      }`,
    [fromBlock, toBlock]
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Jobs</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Indexed from real <code className="text-sky-400">JobCreated</code> events and
          enriched with on-chain <code className="text-sky-400">getJob</code> state.
        </p>
      </header>

      <IntegrationBanner />
      <JobsStats />

      <div className="card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-medium text-white">Indexed jobs</h2>
          <div className="flex gap-2 text-xs">
            {(
              [
                ["all", "All recent"],
                ["client", "As client"],
                ["provider", "As provider/agent"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-md px-2.5 py-1 ${
                  filter === value
                    ? "bg-sky-600 text-white"
                    : "bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-zinc-500">{indexedRangeLabel}</p>
        {!hasCustomFromBlock && (
          <p className="text-xs text-amber-200/90">
            Set <code>NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK</code> for tighter, faster
            indexing in production demo runs.
          </p>
        )}
        {!hasCustomToBlock && (
          <p className="text-xs text-zinc-500">
            Optional: set <code>NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK</code> to freeze a clean
            recording window.
          </p>
        )}

        {isLoading && <p className="text-sm text-zinc-400">Indexing events from Arc…</p>}
        {error && (
          <div className="space-y-2 text-sm text-red-300">
            <p>Could not index jobs from chain. Please retry.</p>
            <div className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-200">
              <p>fromBlock: {diagnostics.fromBlock.toString()}</p>
              <p>toBlock: {diagnostics.toBlock?.toString() ?? "latest"}</p>
              <p>toBlock mode: {diagnostics.isToBlockFixed ? "fixed" : "latest"}</p>
              <p>latestBlock: {diagnostics.latestBlock?.toString() ?? "n/a"}</p>
              <p>indexed jobs: {diagnostics.indexedJobCount}</p>
              <p>contract: {diagnostics.contractAddress}</p>
              <p>event topic: {diagnostics.eventTopic}</p>
              <p>wallet: {diagnostics.connectedWallet ?? "not connected"}</p>
              <p>error: {diagnostics.errorShort ?? "unknown"}</p>
              <p>suggestion: {diagnostics.suggestion ?? "retry"}</p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-md bg-red-500/20 px-3 py-1 text-xs text-red-200"
            >
              Retry
            </button>

            <div className="space-y-2 rounded-md border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
              <p className="font-medium">Manual demo job fallback (direct verified getJob read)</p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={manualJobId}
                  onChange={(e) => setManualJobId(e.target.value)}
                  className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs text-white"
                  placeholder="Enter jobId (e.g. 21683)"
                />
                <button
                  type="button"
                  onClick={() => manualJob.refetch()}
                  className="rounded-md bg-amber-500/20 px-3 py-1 text-xs"
                >
                  Load job
                </button>
              </div>
              {manualJob.isLoading && <p>Loading direct getJob result…</p>}
              {manualJob.data && (
                <p>
                  Loaded job #{manualJob.data.id.toString()} · {formatUsdcAmount(manualJob.data.budget)} USDC ·{" "}
                  <Link href={`/jobs/${manualJob.data.id.toString()}`} className="text-sky-300 hover:underline">
                    Open detail
                  </Link>
                </p>
              )}
            </div>
          </div>
        )}

        {!isLoading && !error && jobs.length === 0 && (
          <p className="text-sm text-zinc-400">
            No jobs found in the indexed range for this filter.
          </p>
        )}

        {jobs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-zinc-500">
                <tr>
                  <th className="py-2 pr-4">Job</th>
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Provider</th>
                  <th className="py-2 pr-4">Budget</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Detail</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id.toString()} className="border-t border-white/5 align-top">
                    <td className="py-3 pr-4 font-mono text-xs text-zinc-300">#{job.id.toString()}</td>
                    <td className="py-3 pr-4"><ArcScanAddressLink address={job.client} /></td>
                    <td className="py-3 pr-4"><ArcScanAddressLink address={job.provider} /></td>
                    <td className="py-3 pr-4 text-zinc-200">{formatUsdcAmount(job.budget)} USDC</td>
                    <td className="py-3 pr-4"><JobStatusBadge status={job.status} /></td>
                    <td className="py-3 pr-4">
                      <Link href={`/jobs/${job.id.toString()}`} className="text-sky-400 hover:underline">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="font-medium text-white">Indexed demo range summary</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Open: {stats.openJobs} · Funded: {stats.fundedJobs} · Submitted: {stats.submittedJobs} ·
          Completed: {stats.completedJobs}
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Derived from indexed demo block range, not protocol-wide ledger totals.
          {isToBlockFixed && toBlock ? ` Window: ${fromBlock.toString()} → ${toBlock.toString()}.` : ""}
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          Example:{" "}
          <Link href="/jobs/1" className="text-sky-400 hover:underline">
            /jobs/1
          </Link>
        </p>
      </div>
    </div>
  );
}
