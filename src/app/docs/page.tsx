import Link from "next/link";
import { AgentPayShell } from "@/components/ui/agentpay/AgentPayShell";
import { AgentPayCard } from "@/components/ui/agentpay/AgentPayCard";
import { AgentPayBadge } from "@/components/ui/agentpay/AgentPayBadge";
import { AgentPayButton } from "@/components/ui/agentpay/AgentPayButton";
import { AgentPaySectionHeader } from "@/components/ui/agentpay/AgentPaySectionHeader";
import { AgentPayStatusPill } from "@/components/ui/agentpay/AgentPayStatusPill";
import { AgentPayCodeBlock } from "@/components/ui/agentpay/AgentPayCodeBlock";

const apiConsoleCards = [
  {
    endpoint: "GET /api/health",
    purpose: "Service health and Arc Testnet context.",
    curl: `curl "https://agentpay-dusky.vercel.app/api/health"`,
    sample: `{"ok":true,"service":"AgentPay","environment":"Arc Testnet","readOnly":true}`,
  },
  {
    endpoint: "GET /api/metadata",
    purpose: "Public integration metadata.",
    curl: `curl "https://agentpay-dusky.vercel.app/api/metadata"`,
    sample: `{"ok":true,"service":"AgentPay","integration":"v0","readOnly":true}`,
  },
  {
    endpoint: "GET /api/agents",
    purpose: "Agent catalog read surface.",
    curl: `curl "https://agentpay-dusky.vercel.app/api/agents"`,
    sample: `{"ok":true,"agents":[{"id":"demo-agent"}],"readOnly":true}`,
  },
  {
    endpoint: "GET /api/jobs?limit=1",
    purpose: "Indexed job list.",
    curl: `curl "https://agentpay-dusky.vercel.app/api/jobs?limit=1"`,
    sample: `{"ok":true,"jobs":[{"id":"31192","status":3}],"readOnly":true}`,
  },
  {
    endpoint: "GET /api/jobs/[id]",
    purpose: "Direct job lookup.",
    curl: `curl "https://agentpay-dusky.vercel.app/api/jobs/31192"`,
    sample: `{"ok":true,"job":{"id":"31192","status":3},"readOnly":true}`,
  },
  {
    endpoint: "GET /api/payments?limit=1",
    purpose: "Derived payment activity.",
    curl: `curl "https://agentpay-dusky.vercel.app/api/payments?limit=1"`,
    sample: `{"ok":true,"payments":[{"jobId":"31192","completed":true}],"readOnly":true}`,
  },
  {
    endpoint: "GET /api/identity/resolve?name=agentpayagent.circle",
    purpose: "ArcNS identity resolution.",
    curl: `curl "https://agentpay-dusky.vercel.app/api/identity/resolve?name=agentpayagent.circle"`,
    sample: `{"ok":true,"name":"agentpayagent.circle","address":"0x...","readOnly":true}`,
  },
  {
    endpoint: "GET /api/integration/status",
    purpose: "Claim-safe integration status.",
    curl: `curl "https://agentpay-dusky.vercel.app/api/integration/status"`,
    sample: `{"ok":true,"status":"mvp","readOnly":true}`,
  },
] as const;

export default function DocsPage() {
  return (
    <AgentPayShell className="space-y-6 pb-2 md:space-y-8">
      <AgentPayCard variant="elevated" glow className="space-y-5">
        <AgentPaySectionHeader
          eyebrow="Developer Console"
          title="AgentPay Docs"
          description="Integration guide for agent workflows, USDC escrow, ArcNS identity, and read-only API visibility on Arc Testnet."
        />
        <div className="flex flex-wrap gap-2">
          <AgentPayBadge variant="api">Developer integration</AgentPayBadge>
          <AgentPayBadge variant="readonly">Read-only API v0</AgentPayBadge>
          <AgentPayBadge variant="arc">Arc Testnet MVP</AgentPayBadge>
          <AgentPayBadge variant="readonly">No custody</AgentPayBadge>
          <AgentPayBadge variant="notClaimed">No write API</AgentPayBadge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a href="/api/health" target="_blank" rel="noopener noreferrer">
            <AgentPayButton variant="secondary">API health</AgentPayButton>
          </a>
          <Link href="/jobs">
            <AgentPayButton variant="secondary">View jobs</AgentPayButton>
          </Link>
          <Link href="/create-job">
            <AgentPayButton>Create job</AgentPayButton>
          </Link>
        </div>
        <p className="rounded-xl border border-slate-500/30 bg-slate-500/10 px-3 py-2 text-xs text-slate-300">
          The API v0 is read-only. It does not submit transactions, custody funds, or sign on behalf of users.
        </p>
      </AgentPayCard>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <AgentPayCard className="space-y-4">
          <AgentPaySectionHeader
            eyebrow="Integration overview"
            title="Current and planned surfaces"
            description="What integrators can use now versus roadmap-only surfaces (NOT_CLAIMED)."
          />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4">Surface</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Notes</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-t border-white/5"><td className="py-2 pr-4">Web routes</td><td className="py-2 pr-4"><AgentPayStatusPill status="completed" label="CURRENT_VERIFIED" /></td><td className="py-2 pr-4">/agents, /create-job, /jobs, /payments</td></tr>
                <tr className="border-t border-white/5"><td className="py-2 pr-4">Contract lifecycle calls</td><td className="py-2 pr-4"><AgentPayStatusPill status="completed" label="CURRENT_VERIFIED" /></td><td className="py-2 pr-4">createJob, setBudget, submit, complete, getJob</td></tr>
                <tr className="border-t border-white/5"><td className="py-2 pr-4">Event/indexing reads</td><td className="py-2 pr-4"><AgentPayStatusPill status="completed" label="CURRENT_VERIFIED" /></td><td className="py-2 pr-4">JobCreated logs + getJob enrichment</td></tr>
                <tr className="border-t border-white/5"><td className="py-2 pr-4">ArcNS identity</td><td className="py-2 pr-4"><AgentPayStatusPill status="completed" label="CURRENT_VERIFIED" /></td><td className="py-2 pr-4">.arc and .circle identity resolution</td></tr>
                <tr className="border-t border-white/5"><td className="py-2 pr-4">Read-only Developer API v0</td><td className="py-2 pr-4"><AgentPayStatusPill status="readonly" label="LIVE" /></td><td className="py-2 pr-4">/api/* read endpoints only</td></tr>
                <tr className="border-t border-white/5"><td className="py-2 pr-4">SDK</td><td className="py-2 pr-4"><AgentPayStatusPill status="notClaimed" label="NOT_CLAIMED" /></td><td className="py-2 pr-4">Roadmap only</td></tr>
                <tr className="border-t border-white/5"><td className="py-2 pr-4">Transaction-intent API</td><td className="py-2 pr-4"><AgentPayStatusPill status="notClaimed" label="NOT_CLAIMED" /></td><td className="py-2 pr-4">Roadmap only</td></tr>
                <tr className="border-t border-white/5"><td className="py-2 pr-4">Production hosted API/SLA</td><td className="py-2 pr-4"><AgentPayStatusPill status="notClaimed" label="NOT_CLAIMED" /></td><td className="py-2 pr-4">Not claimed in MVP</td></tr>
              </tbody>
            </table>
          </div>
        </AgentPayCard>

        <AgentPayCard className="space-y-3">
          <AgentPaySectionHeader
            eyebrow="Claim boundary matrix"
            title="Verification status"
            description="Explicitly scoped platform claims for Arc Testnet MVP."
          />
          <div className="space-y-2 text-sm text-slate-300">
            <p className="flex items-center justify-between gap-2"><span>Arc Testnet execution</span><AgentPayStatusPill status="completed" label="CURRENT_VERIFIED" /></p>
            <p className="flex items-center justify-between gap-2"><span>USDC escrow/job lifecycle</span><AgentPayStatusPill status="completed" label="CURRENT_VERIFIED" /></p>
            <p className="flex items-center justify-between gap-2"><span>ArcNS identity</span><AgentPayStatusPill status="completed" label="CURRENT_VERIFIED" /></p>
            <p className="flex items-center justify-between gap-2"><span>Read-only Developer API v0</span><AgentPayStatusPill status="readonly" label="LIVE" /></p>
            <p className="flex items-center justify-between gap-2"><span>Paymaster/Gasless on Arc Testnet</span><AgentPayStatusPill status="unsupported" label="NOT_CLAIMED" /></p>
            <p className="flex items-center justify-between gap-2"><span>Mainnet readiness</span><AgentPayStatusPill status="notClaimed" label="NOT_CLAIMED" /></p>
            <p className="flex items-center justify-between gap-2"><span>Full ERC-8183 compliance</span><AgentPayStatusPill status="notClaimed" label="NOT_CLAIMED" /></p>
            <p className="flex items-center justify-between gap-2"><span>Full ERC-8004 compliance</span><AgentPayStatusPill status="notClaimed" label="NOT_CLAIMED" /></p>
            <p className="flex items-center justify-between gap-2"><span>Production SDK/API SLA</span><AgentPayStatusPill status="notClaimed" label="NOT_CLAIMED" /></p>
          </div>
        </AgentPayCard>
      </div>

      <AgentPayCard className="space-y-4">
        <AgentPaySectionHeader
          eyebrow="API reference console"
          title="Read-only Developer API v0"
          description="Compact endpoint purpose, curl command, and response snippet."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {apiConsoleCards.map((card) => (
            <AgentPayCard key={card.endpoint} variant="muted" className="space-y-2">
              <p className="text-sm font-semibold text-slate-100">{card.endpoint}</p>
              <p className="text-xs text-slate-400">{card.purpose}</p>
              <AgentPayCodeBlock>{card.curl}</AgentPayCodeBlock>
              <AgentPayCodeBlock>{card.sample}</AgentPayCodeBlock>
            </AgentPayCard>
          ))}
        </div>
      </AgentPayCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <AgentPayCard className="space-y-3">
          <AgentPaySectionHeader
            eyebrow="Integration patterns"
            title="Practical third-party integration"
            description="Claim-safe patterns available to builders today."
          />
          <ul className="list-inside list-disc space-y-2 text-sm text-slate-300">
            <li><span className="text-slate-100">Pattern A — Link-out integration:</span> route users to /agents, /create-job, /jobs, /payments.</li>
            <li><span className="text-slate-100">Pattern B — Contract integration:</span> create job, set budget/fund, submit deliverable, complete job using configured contract and address. Full ERC-8183 compliance is NOT_CLAIMED.</li>
            <li><span className="text-slate-100">Pattern C — Indexed read integration:</span> consume /api/jobs, /api/payments, /api/integration/status.</li>
            <li><span className="text-slate-100">Pattern D — Identity integration:</span> resolve agentpayagent.circle and agentpayclient.arc via ArcNS resolver/API surface.</li>
          </ul>
        </AgentPayCard>

        <AgentPayCard className="space-y-3">
          <AgentPaySectionHeader
            eyebrow="Agent integration flow"
            title="Autonomous agent builder path"
            description="Wallet-signed lifecycle actions with read-only monitoring surfaces."
          />
          <ol className="list-inside list-decimal space-y-2 text-sm text-slate-300">
            <li>Assign provider wallet.</li>
            <li>Optionally map ArcNS name to wallet.</li>
            <li>Receive or discover job.</li>
            <li>Submit deliverable/reference.</li>
            <li>Track status and payment visibility.</li>
            <li>Use API/read views for monitoring.</li>
          </ol>
          <p className="text-xs text-slate-400">
            AgentPay does not custody third-party funds offchain. Wallet/user signs transactions. Current API is read-only.
          </p>
        </AgentPayCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AgentPayCard className="space-y-3">
          <AgentPaySectionHeader eyebrow="Quickstart" title="Local development" description="Safe local setup and environment handling." />
          <AgentPayCodeBlock>{`npm install
npm run dev
npm run typecheck
npm run build`}</AgentPayCodeBlock>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
            <li>Use <code>.env.local</code> for local environment setup.</li>
            <li>Do not expose secrets.</li>
            <li>Public vars must use <code>NEXT_PUBLIC_*</code>.</li>
            <li>Do not put private keys in frontend env.</li>
          </ul>
        </AgentPayCard>

        <AgentPayCard className="space-y-3">
          <AgentPaySectionHeader eyebrow="API examples" title="Live Arc Testnet MVP" description="Compact endpoint paths against live deployment." />
          <p className="text-xs text-slate-400">Base URL: <code>https://agentpay-dusky.vercel.app</code></p>
          <AgentPayCodeBlock>{`/api/health
/api/jobs?limit=1
/api/payments?limit=1
/api/identity/resolve?name=agentpayagent.circle`}</AgentPayCodeBlock>
        </AgentPayCard>
      </div>
    </AgentPayShell>
  );
}
