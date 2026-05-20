"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IntegrationBanner } from "@/components/agentpay/IntegrationBanner";
import { getArcscanAddressUrl } from "@/lib/arcscan";
import {
  ERC8183_AGENTIC_COMMERCE_ADDRESS,
  ARC_TESTNET_USDC_ADDRESS,
} from "@/lib/constants";
import { useAgentPayJobs } from "@/hooks/useAgentPayJobs";
import { useAgentPayManualJob } from "@/hooks/useAgentPayJobs";
import { formatUsdcAmount } from "@/lib/usdc";
import { JobStatusBadge } from "@/components/agentpay/JobStatusBadge";
import { ArcScanAddressLink } from "@/components/agentpay/ArcScanLink";
import { AgentPayShell } from "@/components/ui/agentpay/AgentPayShell";
import { AgentPayCard } from "@/components/ui/agentpay/AgentPayCard";
import { AgentPayBadge } from "@/components/ui/agentpay/AgentPayBadge";
import { AgentPayButton } from "@/components/ui/agentpay/AgentPayButton";
import { AgentPaySectionHeader } from "@/components/ui/agentpay/AgentPaySectionHeader";

export default function PaymentsPage() {
  const [manualJobId, setManualJobId] = useState("21683");
  const { allJobs, isLoading, error, diagnostics, fromBlock, toBlock } = useAgentPayJobs("all");
  const manualJob = useAgentPayManualJob(manualJobId);
  const completed = allJobs.filter((j) => j.status === 3);
  const completedFromManual = manualJob.data && manualJob.data.status === 3 ? [manualJob.data] : [];
  const fundedOrPending = allJobs.filter((j) => j.status === 1 || j.status === 2);
  const derivedPaidOut = useMemo(
    () => formatUsdcAmount(completed.reduce((sum, j) => sum + j.budget, 0n)),
    [completed]
  );

  return (
    <AgentPayShell className="space-y-6 pb-2 md:space-y-8">
      <AgentPayCard variant="elevated" glow className="space-y-5">
        <AgentPaySectionHeader
          eyebrow="Settlement Command Center"
          title="Payments"
          description="Derived payment activity from indexed job lifecycle state on Arc Testnet."
        />
        <div className="flex flex-wrap gap-2">
          <AgentPayBadge variant="arc">Arc Testnet</AgentPayBadge>
          <AgentPayBadge variant="readonly">Derived ledger</AgentPayBadge>
          <AgentPayBadge variant="usdc">USDC settlement</AgentPayBadge>
          <AgentPayBadge variant="readonly">Read-only view</AgentPayBadge>
          <AgentPayBadge variant="notClaimed">No settlement event claim</AgentPayBadge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/jobs">
            <AgentPayButton variant="secondary">View jobs</AgentPayButton>
          </Link>
          <Link href="/create-job">
            <AgentPayButton>Create job</AgentPayButton>
          </Link>
          <Link href="/docs">
            <AgentPayButton variant="secondary">Read docs</AgentPayButton>
          </Link>
        </div>
        <p className="rounded-xl border border-slate-500/30 bg-slate-500/10 px-3 py-2 text-xs text-slate-300">
          Derived from job lifecycle state; dedicated settlement event API is not claimed.
        </p>
      </AgentPayCard>

      <AgentPayCard variant="muted">
        <IntegrationBanner />
      </AgentPayCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AgentPayCard className="space-y-1">
          <p className="text-xs text-slate-400">Completed settlements</p>
          <p className="text-2xl font-semibold text-slate-50">{completed.length}</p>
        </AgentPayCard>
        <AgentPayCard className="space-y-1">
          <p className="text-xs text-slate-400">Pending/Funded jobs</p>
          <p className="text-2xl font-semibold text-cyan-200">{fundedOrPending.length}</p>
        </AgentPayCard>
        <AgentPayCard className="space-y-1">
          <p className="text-xs text-slate-400">Derived USDC volume</p>
          <p className="text-2xl font-semibold text-emerald-200">{derivedPaidOut} USDC</p>
        </AgentPayCard>
        <AgentPayCard className="space-y-1">
          <p className="text-xs text-slate-400">Indexed activity source</p>
          <p className="text-sm font-medium text-slate-200">JobCreated + getJob</p>
          <p className="text-xs text-slate-500">
            {fromBlock.toString()} → {toBlock ? toBlock.toString() : "latest"}
          </p>
        </AgentPayCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <AgentPayCard className="space-y-4">
          <AgentPaySectionHeader
            eyebrow="Derived Settlement Ledger"
            title="Activity"
            description="Read-only settlement activity derived from indexed job lifecycle state."
          />

          {isLoading && (
            <AgentPayCard variant="muted" className="text-sm text-slate-300">
              Loading indexed activity…
            </AgentPayCard>
          )}

          {error && (
            <AgentPayCard variant="muted" className="space-y-3 border-red-400/30 text-sm text-red-200">
              <p>Could not load indexed activity.</p>
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs">
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

              <div className="space-y-2 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                <p className="font-medium">Manual fallback for completed settlement (direct verified getJob)</p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={manualJobId}
                    onChange={(e) => setManualJobId(e.target.value)}
                    className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs text-white"
                    placeholder="Enter jobId (e.g. 21683)"
                  />
                  <AgentPayButton
                    type="button"
                    onClick={() => manualJob.refetch()}
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                  >
                    Load job
                  </AgentPayButton>
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
            </AgentPayCard>
          )}

          {!isLoading && !error && allJobs.length === 0 && (
            <AgentPayCard variant="muted" className="space-y-2 text-sm text-slate-300">
              <p className="font-medium text-slate-100">No derived payment activity yet</p>
              <p>
                No completed or funded payment activity was found in the current indexed window.
              </p>
            </AgentPayCard>
          )}

          {allJobs.length > 0 && (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-slate-400">
                    <tr className="border-b border-white/10">
                      <th className="py-2 pr-4">Job</th>
                      <th className="py-2 pr-4">Client</th>
                      <th className="py-2 pr-4">Provider</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allJobs.map((job) => (
                      <tr key={job.id.toString()} className="border-t border-white/5 align-top">
                        <td className="py-3 pr-4 font-mono text-xs text-slate-200">#{job.id.toString()}</td>
                        <td className="py-3 pr-4"><ArcScanAddressLink address={job.client} /></td>
                        <td className="py-3 pr-4"><ArcScanAddressLink address={job.provider} /></td>
                        <td className="py-3 pr-4 text-slate-200">{formatUsdcAmount(job.budget)} USDC</td>
                        <td className="py-3 pr-4"><JobStatusBadge status={job.status} /></td>
                        <td className="py-3 pr-4">
                          <Link href={`/jobs/${job.id.toString()}`} className="text-cyan-300 hover:underline">
                            Open
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 lg:hidden">
                {allJobs.map((job) => (
                  <AgentPayCard key={job.id.toString()} variant="muted" className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-xs text-slate-200">#{job.id.toString()}</p>
                      <JobStatusBadge status={job.status} />
                    </div>
                    <p className="text-xs text-slate-400">Client: <ArcScanAddressLink address={job.client} /></p>
                    <p className="text-xs text-slate-400">Provider: <ArcScanAddressLink address={job.provider} /></p>
                    <p className="text-sm text-slate-200">Amount: {formatUsdcAmount(job.budget)} USDC</p>
                    <p className="text-xs text-slate-500">Derived from current getJob state in indexed range.</p>
                    <Link href={`/jobs/${job.id.toString()}`} className="text-sm text-cyan-300 hover:underline">
                      Open job detail →
                    </Link>
                  </AgentPayCard>
                ))}
              </div>
            </>
          )}
        </AgentPayCard>

        <div className="space-y-4">
          <AgentPayCard className="space-y-3">
            <AgentPaySectionHeader
              eyebrow="Source"
              title="Data and boundary rail"
              description="Read-only context for settlement derivation and claims."
            />
            <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-400">
              <li>Source: indexed job state</li>
              <li>Method: JobCreated logs + getJob enrichment</li>
              <li>Read-only API: GET /api/payments?limit=5</li>
              <li>Lifecycle vocabulary: Funded, Submitted, Completed</li>
            </ul>
            <div className="rounded-xl border border-slate-500/30 bg-slate-500/10 p-3 text-xs text-slate-300">
              <p>Dedicated settlement event API is not claimed.</p>
              <p>Indexed state can lag latest chain state.</p>
              <p>No server custody and no server-side signing.</p>
            </div>
          </AgentPayCard>

          <AgentPayCard className="space-y-3">
            <p className="text-sm text-slate-300">
              <span className="font-medium text-amber-200">Roadmap note — </span>
              Once additional events are verified from Arc docs/ArcScan, this page can render direct funding/submission/completion event history.
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
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
          </AgentPayCard>
        </div>
      </div>
    </AgentPayShell>
  );
}
