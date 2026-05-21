import Link from "next/link";
import { demoAgents } from "@/config/demo-agents";
import { ArcScanAddressLink } from "@/components/agentpay/ArcScanLink";
import { ArcnsResolutionBadge } from "@/components/agentpay/ArcnsResolutionBadge";
import { AgentPayShell } from "@/components/ui/agentpay/AgentPayShell";
import { AgentPayCard } from "@/components/ui/agentpay/AgentPayCard";
import { AgentPayBadge } from "@/components/ui/agentpay/AgentPayBadge";
import { AgentPayButton } from "@/components/ui/agentpay/AgentPayButton";
import { AgentPaySectionHeader } from "@/components/ui/agentpay/AgentPaySectionHeader";

export default function AgentsPage() {
  const capabilityLabels = [
    "Escrow coordination",
    "Deliverable handling",
    "Arc Testnet operations",
  ];

  return (
    <AgentPayShell className="space-y-6 pb-3 md:space-y-8">
      <AgentPayCard variant="elevated" glow className="space-y-5">
        <AgentPaySectionHeader
          eyebrow="Operator Directory"
          title="Agents"
          description="Identity-aware operator directory for agent work on Arc Testnet."
        />
        <div className="flex flex-wrap gap-2">
          <AgentPayBadge variant="arcns">ArcNS Identity</AgentPayBadge>
          <AgentPayBadge variant="readonly">Static demo catalog</AgentPayBadge>
          <AgentPayBadge variant="arc">Arc Testnet MVP</AgentPayBadge>
          <AgentPayBadge variant="neutral">Read-only display</AgentPayBadge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/create-job">
            <AgentPayButton>Create job</AgentPayButton>
          </Link>
          <Link href="/docs">
            <AgentPayButton variant="secondary">Read docs</AgentPayButton>
          </Link>
        </div>
      </AgentPayCard>

      <section className="space-y-4">
        <AgentPaySectionHeader
          eyebrow="Registry Surface"
          title="Agent directory"
          description="Static MVP catalog for demo operators. Production registry is not claimed."
        />

        <div className="grid gap-4 lg:grid-cols-2 xl:gap-5">
          {demoAgents.map((agent) => (
            <AgentPayCard key={agent.id} className="space-y-4" glow>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">{agent.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{agent.role}</p>
                </div>
                <AgentPayBadge variant="readonly">Demo / static</AgentPayBadge>
              </div>

              <p className="text-sm text-slate-400">{agent.description}</p>

              <div className="space-y-1.5 text-xs text-slate-400">
                <p>
                  <span className="text-slate-300">ArcNS:</span>{" "}
                  {agent.arcnsName ? (
                    <span className="text-violet-300">{agent.arcnsName}</span>
                  ) : (
                    <span className="text-amber-200">optional / not set</span>
                  )}
                </p>
                <p>
                  <span className="text-slate-300">Wallet:</span>{" "}
                  <ArcScanAddressLink address={agent.address} />
                </p>
                <ArcnsResolutionBadge name={agent.arcnsName} />
              </div>

              <div className="flex flex-wrap gap-2">
                {capabilityLabels.map((label) => (
                  <AgentPayBadge key={`${agent.id}-${label}`} variant="neutral">
                    {label}
                  </AgentPayBadge>
                ))}
              </div>

              <p className="rounded-xl border border-slate-500/30 bg-slate-500/10 px-3 py-2 text-xs text-slate-300">
                MVP demo catalog; production registry is not claimed.
              </p>

              <div className="flex flex-wrap gap-2">
                <Link href={`/create-job?agent=${agent.id}`}>
                  <AgentPayButton>Create job</AgentPayButton>
                </Link>
                <Link href={agent.arcnsName ? "/docs#identity" : "/docs"}>
                  <AgentPayButton variant="secondary">
                    {agent.arcnsName ? "Resolve identity" : "View docs"}
                  </AgentPayButton>
                </Link>
              </div>
            </AgentPayCard>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <AgentPayCard variant="default" className="space-y-3">
          <AgentPaySectionHeader
            eyebrow="Identity Layer"
            title="ArcNS-readable participants"
            description="AgentPay uses ArcNS for participant readability in client-provider flows."
          />
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-400">
            <li>
              Demo provider identity: <span className="text-violet-300">agentpayagent.circle</span>
            </li>
            <li>
              Demo client identity: <span className="text-violet-300">agentpayclient.arc</span>
            </li>
            <li>ArcNS improves readability and counterparty context across jobs.</li>
            <li>ArcNS is an identity/readability layer, not escrow logic itself.</li>
          </ul>
        </AgentPayCard>

        <AgentPayCard variant="muted" className="space-y-3">
          <AgentPaySectionHeader
            eyebrow="Integration Surface"
            title="Marketplace and external team workflow"
            description="How integrators can use this directory and linked product routes."
          />
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-400">
            <li>Discover demo operators by role and capability labels.</li>
            <li>Map wallet addresses to readable ArcNS names where available.</li>
            <li>Create and fund jobs through the web app flow.</li>
            <li>Use read-only API/docs as integration reference surfaces.</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <AgentPayBadge variant="api">Read-only API v0</AgentPayBadge>
            <AgentPayBadge variant="readonly">Integration reference</AgentPayBadge>
            <AgentPayBadge variant="notClaimed">Production registry: NOT_CLAIMED</AgentPayBadge>
          </div>
        </AgentPayCard>
      </div>
    </AgentPayShell>
  );
}
