"use client";

import Link from "next/link";
import { IntegrationBanner } from "@/components/agentpay/IntegrationBanner";
import { getArcscanAddressUrl } from "@/lib/arcscan";
import {
  ERC8183_AGENTIC_COMMERCE_ADDRESS,
  ARC_TESTNET_USDC_ADDRESS,
} from "@/lib/constants";
import { useAgentPayJobs } from "@/hooks/useAgentPayJobs";
import { useState } from "react";
import { useAgentPayManualJob } from "@/hooks/useAgentPayJobs";
import { formatUsdcAmount } from "@/lib/usdc";
import { JobStatusBadge } from "@/components/agentpay/JobStatusBadge";

export default function PaymentsPage() {
  const [manualJobId, setManualJobId] = useState("21683");
  const { allJobs, isLoading, error, diagnostics, fromBlock, toBlock } = useAgentPayJobs("all");
  const manualJob = useAgentPayManualJob(manualJobId);
  const completed = allJobs.filter((j) => j.status === 3);
  const completedFromManual = manualJob.data && manualJob.data.status === 3 ? [manualJob.data] : [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Derived from indexed job state (MVP). No fabricated settlement events.
        </p>
      </header>

      <IntegrationBanner />

      <div className="card space-y-2">
        <h2 className="font-medium text-white">Completed settlements (derived)</h2>
        <p className="text-sm text-zinc-400">
          Count: {completed.length} · Paid out: {formatUsdcAmount(completed.reduce((sum, j) => sum + j.budget, 0n))} USDC
        </p>
        <p className="text-xs text-zinc-500">
          Indexed demo range: from block {fromBlock.toString()} to {toBlock ? toBlock.toString() : "latest"}.
        </p>
        <p className="text-xs text-zinc-500">Derived from indexed demo block range, not protocol-wide ledger totals.</p>
      </div>

      <div className="card space-y-3">
        <h2 className="font-medium text-white">Activity timeline</h2>
        {isLoading && <p className="text-sm text-zinc-400">Loading indexed activity…</p>}
        {error && <p className="text-sm text-red-300">Could not load indexed activity.</p>}
        {error && (
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
        )}
        {!isLoading && !error && allJobs.length === 0 && (
          <p className="text-sm text-zinc-400">No indexed jobs yet in current demo range.</p>
        )}
        {allJobs.length > 0 && (
          <ul className="space-y-2">
            {allJobs.map((job) => (
              <li key={job.id.toString()} className="rounded-md border border-white/10 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-zinc-200">Job #{job.id.toString()} · {formatUsdcAmount(job.budget)} USDC</p>
                  <JobStatusBadge status={job.status} />
                </div>
                <p className="mt-1 text-xs text-zinc-500">Derived from current getJob state in indexed range.</p>
                <Link href={`/jobs/${job.id.toString()}`} className="mt-1 inline-block text-xs text-sky-400 hover:underline">
                  Open job detail →
                </Link>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <div className="space-y-2 rounded-md border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
            <p className="font-medium">Manual fallback for completed settlement (direct verified getJob)</p>
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
            {manualJob.data && (
              <p>
                {manualJob.data.status === 3
                  ? `Completed settlement from direct read: Job #${manualJob.data.id.toString()} · ${formatUsdcAmount(manualJob.data.budget)} USDC`
                  : `Direct read loaded Job #${manualJob.data.id.toString()} (not completed status)`}
              </p>
            )}
            {completedFromManual.length > 0 && (
              <p>
                Manual fallback summary → Count: {completedFromManual.length} · Paid out: {formatUsdcAmount(completedFromManual.reduce((sum, j) => sum + j.budget, 0n))} USDC
              </p>
            )}
          </div>
        )}
      </div>

      <div className="card space-y-4">
        <p className="text-sm text-zinc-400">
          <span className="font-medium text-amber-200">Roadmap note — </span>
          Once additional events are verified from Arc docs/ArcScan, this page
          can render direct funding/submission/completion event history.
        </p>
        <ul className="space-y-2 text-sm text-zinc-500">
          <li>
            USDC token:{" "}
            <a
              href={getArcscanAddressUrl(ARC_TESTNET_USDC_ADDRESS)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              ArcScan ↗
            </a>
          </li>
          <li>
            Escrow contract:{" "}
            <a
              href={getArcscanAddressUrl(ERC8183_AGENTIC_COMMERCE_ADDRESS)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              ArcScan ↗
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
