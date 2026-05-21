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
import { AgentPayShell } from "@/components/ui/agentpay/AgentPayShell";
import { AgentPayCard } from "@/components/ui/agentpay/AgentPayCard";
import { AgentPayBadge } from "@/components/ui/agentpay/AgentPayBadge";
import { AgentPayButton } from "@/components/ui/agentpay/AgentPayButton";
import { AgentPaySectionHeader } from "@/components/ui/agentpay/AgentPaySectionHeader";
import { AgentPayStatusPill } from "@/components/ui/agentpay/AgentPayStatusPill";
import { AgentPayCodeBlock } from "@/components/ui/agentpay/AgentPayCodeBlock";

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
    <AgentPayShell className="space-y-6 pb-3 md:space-y-8">
      <AgentPayCard variant="elevated" glow className="space-y-5">
        <AgentPaySectionHeader
          eyebrow="Lifecycle Command Center"
          title="Jobs"
          description="Indexed job lifecycle state from Arc Testnet, enriched with on-chain reads."
        />
        <div className="flex flex-wrap gap-2">
          <AgentPayBadge variant="arc">Arc Testnet</AgentPayBadge>
          <AgentPayBadge variant="readonly">Indexed jobs</AgentPayBadge>
          <AgentPayBadge variant="readonly">Read-only dashboard</AgentPayBadge>
          <AgentPayBadge variant="readonly">ERC-8183-inspired lifecycle</AgentPayBadge>
          <AgentPayBadge variant="notClaimed">Claim-safe MVP</AgentPayBadge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/create-job">
            <AgentPayButton>Create job</AgentPayButton>
          </Link>
          <Link href="/payments">
            <AgentPayButton variant="secondary">Payments</AgentPayButton>
          </Link>
          <Link href="/docs">
            <AgentPayButton variant="secondary">Read docs</AgentPayButton>
          </Link>
        </div>
        <p className="rounded-xl border border-slate-500/30 bg-slate-500/10 px-3 py-2 text-xs text-slate-300">
          Indexed view is derived from JobCreated logs and getJob reads. It is not a protocol-wide ledger claim.
        </p>
      </AgentPayCard>

      <AgentPayCard variant="muted">
        <IntegrationBanner />
      </AgentPayCard>

      <JobsStats />

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <AgentPayCard className="space-y-4">
          <AgentPaySectionHeader
            eyebrow="Indexed Ledger"
            title="Indexed jobs"
            description="Filter and inspect Arc Testnet job lifecycle state from event-indexed reads."
          >
            <div className="flex flex-wrap gap-2 text-xs">
              {(
                [
                  ["all", "All recent"],
                  ["client", "As client"],
                  ["provider", "As provider/agent"],
                ] as const
              ).map(([value, label]) => (
                <AgentPayButton
                  key={value}
                  type="button"
                  variant={filter === value ? "primary" : "secondary"}
                  className="px-3 py-1.5 text-xs"
                  onClick={() => setFilter(value)}
                >
                  {label}
                </AgentPayButton>
              ))}
            </div>
          </AgentPaySectionHeader>

          <div className="space-y-1.5">
            <p className="text-xs text-slate-400">{indexedRangeLabel}</p>
            {!hasCustomFromBlock && (
              <p className="text-xs text-amber-200/90">
                Set <code>NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK</code> for tighter, faster indexing in production demo runs.
              </p>
            )}
            {!hasCustomToBlock && (
              <p className="text-xs text-slate-500">
                Optional: set <code>NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK</code> to freeze a clean recording window.
              </p>
            )}
          </div>

          {isLoading && (
            <AgentPayCard variant="muted" className="text-sm text-slate-300">
              Indexing events from Arc…
            </AgentPayCard>
          )}

          {error && (
            <AgentPayCard variant="muted" className="space-y-3 border-red-400/30 text-sm text-red-200">
              <p>Could not index jobs from chain. Please retry.</p>
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
              <AgentPayButton type="button" variant="danger" onClick={() => refetch()} className="w-fit">
                Retry
              </AgentPayButton>

              <div className="space-y-2 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                <p className="font-medium">Manual demo job fallback (direct verified getJob read)</p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={manualJobId}
                    onChange={(e) => setManualJobId(e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs text-white"
                    placeholder="Enter jobId (e.g. 21683)"
                  />
                  <AgentPayButton
                    type="button"
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                    onClick={() => manualJob.refetch()}
                  >
                    Load job
                  </AgentPayButton>
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
            </AgentPayCard>
          )}

          {!isLoading && !error && jobs.length === 0 && (
            <AgentPayCard variant="muted" className="text-sm text-slate-300">
              No jobs found in the indexed range for this filter.
            </AgentPayCard>
          )}

          {jobs.length > 0 && (
            <>
              <div className="hidden overflow-x-auto rounded-xl border border-white/10 lg:block">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-slate-400">
                    <tr className="border-b border-white/10">
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
                {jobs.map((job) => (
                  <AgentPayCard key={job.id.toString()} variant="muted" className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-xs text-slate-200">#{job.id.toString()}</p>
                      <JobStatusBadge status={job.status} />
                    </div>
                    <p className="text-xs text-slate-400">Client: <ArcScanAddressLink address={job.client} /></p>
                    <p className="text-xs text-slate-400">Provider: <ArcScanAddressLink address={job.provider} /></p>
                    <p className="text-sm text-slate-200">Budget: {formatUsdcAmount(job.budget)} USDC</p>
                    <Link href={`/jobs/${job.id.toString()}`} className="text-sm text-cyan-300 hover:underline">
                      Open detail →
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
              eyebrow="Indexing Metadata"
              title="Source and diagnostics"
              description="Operational context for this indexed read surface."
            />
            <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-400">
              <li>Open: {stats.openJobs}</li>
              <li>Funded: {stats.fundedJobs}</li>
              <li>Submitted: {stats.submittedJobs}</li>
              <li>Completed: {stats.completedJobs}</li>
            </ul>
            <p className="text-xs text-slate-500">
              Derived from indexed demo block range, not protocol-wide ledger totals.
              {isToBlockFixed && toBlock ? ` Window: ${fromBlock.toString()} → ${toBlock.toString()}.` : ""}
            </p>
          </AgentPayCard>

          <AgentPayCard className="space-y-3">
            <AgentPaySectionHeader
              eyebrow="API Surface"
              title="Read-only endpoint"
              description="Reference query for indexed jobs API output."
            />
            <AgentPayCodeBlock>GET /api/jobs?limit=5</AgentPayCodeBlock>
          </AgentPayCard>

          <AgentPayCard className="space-y-3">
            <AgentPaySectionHeader
              eyebrow="Lifecycle Legend"
              title="MVP status vocabulary"
            />
            <div className="flex flex-wrap gap-2">
              <AgentPayStatusPill status="open" label="Open" />
              <AgentPayStatusPill status="funded" label="Funded" />
              <AgentPayStatusPill status="submitted" label="Submitted" />
              <AgentPayStatusPill status="completed" label="Completed" />
            </div>
          </AgentPayCard>

          <AgentPayCard variant="muted" className="space-y-2">
            <AgentPaySectionHeader
              eyebrow="Claim Boundary"
              title="Read/write responsibility model"
            />
            <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-400">
              <li>Read-only dashboard surface for indexed state visibility.</li>
              <li>No server custody and no server-side signing of user transactions.</li>
              <li>Indexed state can lag latest chain state depending on RPC/indexing windows.</li>
            </ul>
          </AgentPayCard>
        </div>
      </div>
    </AgentPayShell>
  );
}
