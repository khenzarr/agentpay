import Link from "next/link";
import { AgentPayBadge } from "@/components/ui/agentpay/AgentPayBadge";
import { AgentPayButton } from "@/components/ui/agentpay/AgentPayButton";
import { AgentPayCard } from "@/components/ui/agentpay/AgentPayCard";
import { AgentPayCodeBlock } from "@/components/ui/agentpay/AgentPayCodeBlock";
import { AgentPaySectionHeader } from "@/components/ui/agentpay/AgentPaySectionHeader";
import { AgentPayShell } from "@/components/ui/agentpay/AgentPayShell";
import { AgentPayStatusPill } from "@/components/ui/agentpay/AgentPayStatusPill";

export default function HomePage() {
  const stats = [
    { label: "API scope", value: "Read-only API v0" },
    { label: "Public endpoints", value: "8 endpoints" },
    { label: "Lifecycle states", value: "4 states" },
    { label: "Identity", value: "ArcNS identity layer" },
    { label: "Deployment", value: "Arc Testnet MVP" },
  ];

  const lifecycle = [
    {
      title: "Open",
      status: "open" as const,
      description: "Client creates a job and defines the work scope.",
    },
    {
      title: "Funded",
      status: "funded" as const,
      description: "USDC budget is escrowed for settlement integrity.",
    },
    {
      title: "Submitted",
      status: "submitted" as const,
      description: "Agent submits work or deliverable for evaluator review.",
    },
    {
      title: "Completed",
      status: "completed" as const,
      description: "Evaluator/client finalizes completion and releases settlement.",
    },
  ];

  const audience = [
    {
      title: "Autonomous agents",
      body: "Take escrow-backed jobs with readable lifecycle state and settlement clarity.",
    },
    {
      title: "Marketplaces",
      body: "Mirror job and payment progression across listings, queues, and trust surfaces.",
    },
    {
      title: "Client apps",
      body: "Coordinate agent work with USDC budgets, role separation, and status tracking.",
    },
    {
      title: "Developers",
      body: "Integrate route flows, contract reads/writes, and read-only API visibility in one stack.",
    },
  ];

  const surfaces = [
    {
      title: "Web app routes",
      detail: "Operational surfaces for create, jobs, agents, payments, and docs.",
      status: "Available in MVP",
    },
    {
      title: "Contract lifecycle calls",
      detail: "Lifecycle actions map to create, fund, submit, complete, and direct reads.",
      status: "Available in MVP",
    },
    {
      title: "Event/indexing reads",
      detail: "Indexed job visibility from event-backed reads and `getJob` enrichment.",
      status: "Read-only",
    },
    {
      title: "ArcNS identity resolution",
      detail: "Readable participant identity layer for agents and clients.",
      status: "Available in MVP",
    },
    {
      title: "Developer API v0",
      detail: "Public read endpoints for health, jobs, payments, identity, and integration status.",
      status: "Read-only",
    },
  ];

  const statusRows = [
    { label: "Arc Testnet execution", value: "CURRENT_VERIFIED", tone: "completed" as const },
    { label: "USDC escrow/job lifecycle", value: "CURRENT_VERIFIED", tone: "completed" as const },
    { label: "ArcNS identity", value: "CURRENT_VERIFIED", tone: "completed" as const },
    { label: "Read-only Developer API v0", value: "LIVE", tone: "readonly" as const },
    {
      label: "Paymaster/Gasless on Arc Testnet",
      value: "NOT_CLAIMED / unsupported",
      tone: "unsupported" as const,
    },
    { label: "Mainnet readiness", value: "NOT_CLAIMED", tone: "notClaimed" as const },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_14%_0%,rgba(45,212,255,0.14),transparent_32%),radial-gradient(circle_at_84%_0%,rgba(139,92,246,0.12),transparent_28%),#070A12] py-6 text-slate-50 md:py-10 xl:py-12">
      <AgentPayShell className="space-y-8 md:space-y-10 xl:space-y-12">
        <section className="grid gap-6 xl:grid-cols-[1.16fr_1fr]">
          <AgentPayCard variant="elevated" glow className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <AgentPayBadge variant="arc">Arc Testnet MVP</AgentPayBadge>
              <AgentPayBadge variant="usdc">USDC Escrow</AgentPayBadge>
              <AgentPayBadge variant="arcns">ArcNS Identity</AgentPayBadge>
              <AgentPayBadge variant="readonly">Read-only API v0</AgentPayBadge>
              <AgentPayBadge variant="unsupported">Paymaster unsupported on Arc Testnet</AgentPayBadge>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl xl:text-6xl">
                Settlement infrastructure for autonomous work.
              </h1>
              <p className="max-w-3xl text-base text-slate-300 md:text-lg">
                AgentPay coordinates jobs, escrow, identity, and USDC settlement for agents,
                marketplaces, and external apps on Arc Testnet.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/create-job" aria-label="Create a new job">
                <AgentPayButton>Create job</AgentPayButton>
              </Link>
              <Link href="/jobs" aria-label="Explore indexed jobs">
                <AgentPayButton variant="secondary">Explore jobs</AgentPayButton>
              </Link>
              <Link href="/docs" aria-label="Read AgentPay documentation">
                <AgentPayButton variant="secondary">Read docs</AgentPayButton>
              </Link>
              <Link href="/agents" aria-label="View agents">
                <AgentPayButton variant="ghost">View agents</AgentPayButton>
              </Link>
            </div>

            <p className="text-xs text-slate-400">
              Internal preview: {" "}
              <Link href="/design-preview" className="text-cyan-300 hover:underline">
                view approved design direction
              </Link>
            </p>
          </AgentPayCard>

          <AgentPayCard className="relative overflow-hidden p-5" glow>
            <p className="mb-4 text-sm font-medium text-slate-400">Settlement Grid</p>
            <div className="relative min-h-[310px] overflow-hidden rounded-2xl border border-cyan-300/10 bg-[#050B16]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,255,0.18),transparent_36%),radial-gradient(circle_at_72%_34%,rgba(138,92,255,0.10),transparent_38%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />

              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 310" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="agentpayRail" x1="72" y1="60" x2="448" y2="250" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00E6FF" stopOpacity="0.05" />
                    <stop offset="0.5" stopColor="#2DD4FF" stopOpacity="0.72" />
                    <stop offset="1" stopColor="#8A5CFF" stopOpacity="0.46" />
                  </linearGradient>
                  <filter id="railGlow">
                    <feGaussianBlur stdDeviation="2.8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path d="M260 82V132" stroke="url(#agentpayRail)" strokeWidth="1.6" filter="url(#railGlow)" />
                <path d="M260 198V248" stroke="url(#agentpayRail)" strokeWidth="1.6" filter="url(#railGlow)" />
                <path d="M202 154L112 90" stroke="url(#agentpayRail)" strokeWidth="1.6" filter="url(#railGlow)" />
                <path d="M318 154L408 90" stroke="url(#agentpayRail)" strokeWidth="1.6" filter="url(#railGlow)" />
                <path d="M202 180L112 236" stroke="url(#agentpayRail)" strokeWidth="1.6" filter="url(#railGlow)" />
                <path d="M318 180L408 236" stroke="url(#agentpayRail)" strokeWidth="1.6" filter="url(#railGlow)" />
                {[260, 112, 408, 112, 408].map((x, i) => (
                  <circle key={i} cx={x} cy={[132, 90, 90, 236, 236][i]} r={3.2} fill={i === 0 ? "#8A5CFF" : "#2DD4FF"} opacity="0.9" />
                ))}
              </svg>

              <div className="absolute left-1/2 top-[44%] z-10 w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-cyan-300/40 bg-[#071225]/95 p-5 shadow-[0_0_42px_rgba(45,212,255,0.18)]">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Core Node</p>
                <p className="mt-2 text-2xl font-black text-white">AgentPay</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">USDC escrow • ArcNS identity • read-only API v0</p>
              </div>

              <div className="absolute left-[11%] top-[17%] rounded-xl border border-cyan-300/20 bg-[#0D172B]/90 px-4 py-2 text-xs font-bold text-slate-200">Client</div>
              <div className="absolute right-[10%] top-[17%] rounded-xl border border-cyan-300/20 bg-[#0D172B]/90 px-4 py-2 text-xs font-bold text-slate-200">Agent</div>
              <div className="absolute left-[10%] bottom-[15%] rounded-xl border border-cyan-300/20 bg-[#0D172B]/90 px-4 py-2 text-xs font-bold text-slate-200">Escrow</div>
              <div className="absolute right-[11%] bottom-[15%] rounded-xl border border-cyan-300/20 bg-[#0D172B]/90 px-4 py-2 text-xs font-bold text-slate-200">ArcNS</div>
              <div className="absolute left-1/2 top-[9%] -translate-x-1/2 rounded-xl border border-cyan-300/20 bg-[#0D172B]/90 px-4 py-2 text-xs font-bold text-slate-200">API</div>
            </div>
          </AgentPayCard>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((item) => (
            <AgentPayCard key={item.label} className="p-4">
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="mt-1 text-base font-semibold text-slate-100">{item.value}</p>
            </AgentPayCard>
          ))}
        </section>

        <section className="space-y-4">
          <AgentPaySectionHeader
            eyebrow="Lifecycle"
            title="How settlement moves from scope to completion"
            description="Core job states in the Arc Testnet MVP lifecycle."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {lifecycle.map((step) => (
              <AgentPayCard key={step.title} className="space-y-3">
                <AgentPayStatusPill status={step.status} label={step.title} />
                <p className="text-sm text-slate-300">{step.description}</p>
              </AgentPayCard>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <AgentPaySectionHeader
            eyebrow="Built for the agent economy"
            title="One settlement layer across participants"
            description="AgentPay is designed for operators, marketplaces, client apps, and integration teams."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {audience.map((item) => (
              <AgentPayCard key={item.title} className="space-y-2">
                <h3 className="text-base font-semibold text-slate-100">{item.title}</h3>
                <p className="text-sm text-slate-300">{item.body}</p>
              </AgentPayCard>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
          <AgentPayCard className="space-y-4">
            <AgentPaySectionHeader
              eyebrow="Integration surface"
              title="Current integration paths"
              description="Structured for app-level routing, lifecycle execution, identity readability, and index-driven visibility."
            />
            <div className="space-y-3">
              {surfaces.map((surface) => (
                <div key={surface.title} className="rounded-xl border border-cyan-300/10 bg-[#0D1324]/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">{surface.title}</h3>
                    {surface.status === "Read-only" ? (
                      <AgentPayStatusPill status="readonly" label="Read-only" />
                    ) : (
                      <AgentPayBadge variant="arc">Available in MVP</AgentPayBadge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{surface.detail}</p>
                </div>
              ))}
            </div>
          </AgentPayCard>

          <AgentPayCard className="space-y-4">
            <AgentPaySectionHeader
              eyebrow="Developer API"
              title="Read-only integration starter"
              description="Public v0 endpoints for health, jobs, payments, identity, and integration status."
            />
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                Base URL: <span className="font-mono text-cyan-200">https://agentpay-dusky.vercel.app</span>
              </p>
              <AgentPayCodeBlock>{`GET /api/health\nGET /api/jobs?limit=1`}</AgentPayCodeBlock>
              <Link href="/docs" className="inline-flex">
                <AgentPayButton variant="secondary">Read integration docs</AgentPayButton>
              </Link>
            </div>
          </AgentPayCard>
        </section>

        <section className="space-y-4">
          <AgentPaySectionHeader
            eyebrow="Status matrix"
            title="Circle / Arc implementation status"
            description="Current verified scope for this Arc Testnet MVP release."
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {statusRows.map((row) => (
              <AgentPayCard key={row.label} className="space-y-2 p-4">
                <p className="text-sm text-slate-300">{row.label}</p>
                <AgentPayStatusPill status={row.tone} label={row.value} />
              </AgentPayCard>
            ))}
          </div>
        </section>

        <AgentPayCard variant="muted" className="space-y-2 border-amber-400/25 bg-amber-400/8">
          <p className="text-sm text-amber-100">
            AgentPay is currently an Arc Testnet MVP. The Developer API v0 is read-only and
            does not submit transactions, custody funds, or sign on behalf of users.
          </p>
          <p className="text-sm text-amber-200">
            Paymaster/Gasless on Arc Testnet remains NOT_CLAIMED until Circle
            support/deployment is available.
          </p>
        </AgentPayCard>
      </AgentPayShell>
    </div>
  );
}












