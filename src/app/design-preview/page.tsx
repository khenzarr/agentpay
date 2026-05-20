import Link from "next/link";

const navItems = ["Home", "Agents", "Create job", "Jobs", "Payments", "Docs"];

const topBadges = ["Arc Testnet", "API v0", "Read-only"];

const integrationBadges = [
  "Arc Testnet",
  "USDC",
  "ArcNS",
  "API v0",
  "Paymaster Unsupported",
];

const homeStats = [
  { label: "Jobs indexed", value: "31,204" },
  { label: "USDC observed", value: "87,412.20" },
  { label: "Completed jobs", value: "12,948" },
  { label: "ArcNS identities", value: "5,412" },
];

const agents = [
  { name: "agentpayagent.circle", wallet: "0x9c90...ACBC", capabilities: "Escrow ops, settlement checks", jobs: 412, success: "97.8%" },
  { name: "research-bot.arc", wallet: "0x1453...D030", capabilities: "Research synthesis, references", jobs: 295, success: "95.1%" },
  { name: "codepilot.arc", wallet: "0x8aa1...72F1", capabilities: "Code implementation, review", jobs: 388, success: "96.4%" },
  { name: "dataagent.arc", wallet: "0x447c...118E", capabilities: "Data pipelines, analytics", jobs: 244, success: "94.3%" },
  { name: "solver.arc", wallet: "0xb01d...330A", capabilities: "Optimization, orchestration", jobs: 333, success: "96.9%" },
];

const jobs = [
  { id: "#31001", client: "0x1453...D030", provider: "0x9c90...ACBC", budget: "350 USDC", status: "Open" },
  { id: "#31002", client: "0xAA12...9013", provider: "0x8aa1...72F1", budget: "1200 USDC", status: "Funded" },
  { id: "#31003", client: "0xCc10...F771", provider: "0x447c...118E", budget: "800 USDC", status: "Submitted" },
  { id: "#31004", client: "0x9911...Ab10", provider: "0xb01d...330A", budget: "450 USDC", status: "Completed" },
];

const payments = [
  { id: "#30991", client: "0x1453...D030", provider: "0x9c90...ACBC", status: "Completed", amount: "210 USDC", completed: "2026-05-19 11:23" },
  { id: "#30994", client: "0xAA12...9013", provider: "0x8aa1...72F1", status: "Funded", amount: "600 USDC", completed: "—" },
  { id: "#30999", client: "0xCc10...F771", provider: "0x447c...118E", status: "Pending", amount: "430 USDC", completed: "—" },
  { id: "#31000", client: "0x9911...Ab10", provider: "0xb01d...330A", status: "Completed", amount: "980 USDC", completed: "2026-05-20 08:02" },
];

const endpoints = [
  "/api/health",
  "/api/metadata",
  "/api/agents",
  "/api/jobs?limit=1",
  "/api/payments?limit=1",
  "/api/identity/resolve?name=agentpayagent.circle",
  "/api/integration/status",
];

function StatusBadge({ label }: { label: string }) {
  const styles: Record<string, string> = {
    Open: "border-slate-500/40 bg-slate-400/10 text-slate-200",
    Funded: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
    Submitted: "border-violet-400/40 bg-violet-400/10 text-violet-200",
    Completed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    Unsupported: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    NOT_CLAIMED: "border-slate-500/40 bg-slate-500/10 text-slate-300",
    Pending: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    "Read-only": "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[label] ?? styles.NOT_CLAIMED}`}>
      {label}
    </span>
  );
}

function IntegrationBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-[#22304A] bg-[#111A2E] px-3 py-1 text-xs text-[#94A3B8]">
      {label}
    </span>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-3xl border border-[#22304A] bg-[#0D1324]/90 p-6 shadow-[0_0_0_1px_rgba(45,212,255,0.03)] md:p-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#F8FAFC]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[#94A3B8]">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export default function DesignPreviewPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(45,212,255,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.10),transparent_30%),#070A12] text-[#F8FAFC]">
      <div className="mx-auto max-w-[1500px] space-y-8 px-4 py-8 md:px-8 md:py-10">
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <p>Preview only. Static mock data. No wallet, contract, API, or transaction calls.</p>
          <p className="mt-1">Founder review target: approve direction before applying to real pages.</p>
        </div>

        <header className="sticky top-3 z-10 rounded-3xl border border-[#22304A] bg-[#0D1324]/85 p-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-sm font-bold text-cyan-200">AP</div>
              <div>
                <p className="text-lg font-semibold">AgentPay</p>
                <p className="text-xs text-cyan-300">for Arc</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-3 text-sm text-[#94A3B8]">
              {navItems.map((item) => (
                <span key={item} className="rounded-lg border border-transparent px-2.5 py-1 hover:border-[#22304A] hover:text-white">
                  {item}
                </span>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {topBadges.map((badge) => (
                <StatusBadge key={badge} label={badge} />
              ))}
              <button className="rounded-xl border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100">
                Connect wallet
              </button>
            </div>
          </div>
        </header>

        <Section title="Homepage mockup" subtitle="Settlement infrastructure landing view with grid metaphor.">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Settlement infrastructure for autonomous work.</h1>
              <p className="max-w-3xl text-base text-[#94A3B8]">
                AgentPay coordinates jobs, escrow, identity, and USDC settlement for agents and marketplaces on Arc Testnet.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-xl bg-[#2DD4FF] px-4 py-2 text-sm font-semibold text-[#070A12]">Create job</button>
                <button className="rounded-xl border border-[#22304A] bg-[#111A2E] px-4 py-2 text-sm">Explore jobs</button>
                <button className="rounded-xl border border-violet-400/40 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">Read docs</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {homeStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
                    <p className="text-xs text-[#64748B]">{stat.label}</p>
                    <p className="mt-1 text-xl font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {integrationBadges.map((b) => (
                  <IntegrationBadge key={b} label={b} />
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-[#22304A] bg-[#111A2E] p-6">
              <p className="mb-4 text-sm text-[#94A3B8]">Settlement Grid</p>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                {[
                  "Client",
                  "Provider",
                  "Escrow",
                  "Identity",
                  "AgentPay Node",
                  "API",
                ].map((node) => (
                  <div key={node} className="rounded-xl border border-[#22304A] bg-[#0D1324] p-3">
                    {node}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Agents" subtitle="Identity-aware operator directory.">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <input value="Search agents, ArcNS, wallet..." readOnly className="max-w-md rounded-xl border border-[#22304A] bg-[#111A2E] px-4 py-2 text-sm text-[#64748B]" />
              <div className="flex gap-2">{["All", "Research", "Code", "Data"].map((f) => <span key={f} className="rounded-full border border-[#22304A] px-3 py-1 text-xs text-[#94A3B8]">{f}</span>)}</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {agents.map((agent) => (
                <article key={agent.name} className="space-y-3 rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{agent.name}</h3>
                    <IntegrationBadge label="ArcNS" />
                  </div>
                  <p className="text-xs text-[#94A3B8]">Wallet: {agent.wallet}</p>
                  <p className="text-sm text-[#94A3B8]">{agent.capabilities}</p>
                  <p className="text-xs text-[#64748B]">Jobs completed: {agent.jobs} · Success rate: {agent.success}</p>
                  <button className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200">View profile</button>
                </article>
              ))}
              <article className="grid place-items-center rounded-2xl border border-dashed border-[#22304A] bg-[#0D1324] p-4 text-sm text-[#64748B]">+ Add agent</article>
            </div>
          </div>
        </Section>

        <Section title="Create Job" subtitle="Secure workflow setup console.">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-3 rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
              {[
                "Provider / agent",
                "Evaluator",
                "Job title",
                "Description",
                "USDC budget",
                "Expiry",
              ].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-xs text-[#94A3B8]">{field}</label>
                  <div className="rounded-lg border border-[#22304A] bg-[#0D1324] px-3 py-2 text-sm text-[#64748B]">{field === "Description" ? "Describe the requested output and acceptance criteria..." : `Input ${field.toLowerCase()}`}</div>
                </div>
              ))}
              <button className="mt-2 rounded-xl bg-[#2DD4FF] px-4 py-2 text-sm font-semibold text-[#070A12]">Connect wallet</button>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
                <p className="text-sm text-[#94A3B8]">Lifecycle preview</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Open", "Funded", "Submitted", "Completed"].map((s) => <StatusBadge key={s} label={s} />)}
                </div>
              </div>
              <div className="rounded-2xl border border-[#22304A] bg-[#111A2E] p-4 text-sm">
                <p className="text-[#94A3B8]">Network</p>
                <p className="mt-1">Arc Testnet</p>
                <p className="text-[#64748B]">Chain ID 5042002</p>
              </div>
              <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-100">
                This is a preview. Real transactions require wallet confirmation and gas fees on Arc Testnet.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Jobs" subtitle="Indexed from JobCreated events and enriched with getJob.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              {[
                ["Total jobs", "31,204"],
                ["Escrowed USDC", "87,412.20"],
                ["Completed", "12,948"],
                ["Paid out USDC", "54,988.50"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
                  <p className="text-xs text-[#64748B]">{k}</p>
                  <p className="mt-1 text-xl font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.6fr_0.9fr]">
              <aside className="rounded-2xl border border-[#22304A] bg-[#111A2E] p-4 text-sm text-[#94A3B8]">
                <p className="mb-2 text-white">Quick filters</p>
                <ul className="space-y-2">
                  <li>All recent</li><li>As client</li><li>As provider/agent</li><li>Completed only</li>
                </ul>
              </aside>
              <div className="rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-[#94A3B8]">Get jobs (limit=5)</p>
                  <code className="rounded bg-[#070A12] px-2 py-1 text-xs text-cyan-300">/api/jobs?limit=5</code>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-left text-[#94A3B8]"><tr><th className="py-2">Job</th><th>Client</th><th>Provider</th><th>Budget</th><th>Status</th></tr></thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id} className="border-t border-[#22304A]">
                          <td className="py-2">{job.id}</td><td>{job.client}</td><td>{job.provider}</td><td>{job.budget}</td><td><StatusBadge label={job.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <aside className="rounded-2xl border border-[#22304A] bg-[#111A2E] p-4 text-xs text-[#94A3B8]">
                <p className="mb-2 text-sm text-white">Indexing metadata</p>
                <p>fromBlock: 42677950</p>
                <p>chunkSize: 2000</p>
                <p>contract: 0x0747...e4583</p>
                <p className="mt-3 rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-100">Read path: logs + getJob enrichment</p>
              </aside>
            </div>
          </div>
        </Section>

        <Section title="Job Detail" subtitle="Operational control panel preview.">
          <div className="space-y-4 rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
            <p className="text-xs text-[#64748B]">Jobs / #31003</p>
            <h3 className="text-xl font-semibold">Cross-market research synthesis and scoring</h3>
            <div className="flex flex-wrap gap-2">{["Open", "Funded", "Submitted", "Completed"].map((s) => <StatusBadge key={s} label={s} />)}</div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-[#22304A] bg-[#0D1324] p-3 text-sm"><p className="text-[#64748B]">Client</p><p>agentpayclient.arc · 0xCc10...F771</p></div>
              <div className="rounded-xl border border-[#22304A] bg-[#0D1324] p-3 text-sm"><p className="text-[#64748B]">Provider/Agent</p><p>dataagent.arc · 0x447c...118E</p></div>
              <div className="rounded-xl border border-[#22304A] bg-[#0D1324] p-3 text-sm"><p className="text-[#64748B]">Evaluator</p><p>agentpayclient.arc · 0xCc10...F771</p></div>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 text-sm">
              {[
                ["Budget", "800 USDC"],
                ["Expiry", "2026-05-31 16:00 UTC"],
                ["Reference contract", "0x0747...e4583"],
                ["Chain", "Arc Testnet (5042002)"],
                ["USDC token", "0x3600...0000"],
                ["Status", "Submitted"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-[#22304A] bg-[#0D1324] p-3"><p className="text-[#64748B]">{k}</p><p>{v}</p></div>
              ))}
            </div>
            <div className="rounded-xl border border-[#22304A] bg-[#0D1324] p-3 text-sm">
              <p className="text-[#64748B]">Deliverable</p>
              <p className="mt-1">ipfs://bafybeig.../report.json · Hash: 0xd13c...f9a2</p>
            </div>
            <div className="rounded-xl border border-violet-400/30 bg-violet-400/10 p-3 text-sm">
              <p className="mb-2 text-violet-100">Action preview (static)</p>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg border border-cyan-400/40 px-3 py-1.5">Fund</button>
                <button className="rounded-lg border border-violet-400/40 px-3 py-1.5">Submit work</button>
                <button className="rounded-lg border border-emerald-400/40 px-3 py-1.5">Complete job</button>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Payments" subtitle="Derived from indexed job state. No fabricated settlement events.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["Completed settlements", "12,948"],
                ["Pending settlements", "1,204"],
                ["Total volume", "54,988.50 USDC"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-[#22304A] bg-[#111A2E] p-4"><p className="text-xs text-[#64748B]">{k}</p><p className="mt-1 text-xl font-semibold">{v}</p></div>
              ))}
            </div>
            <div className="overflow-x-auto rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
              <table className="min-w-full text-sm">
                <thead className="text-left text-[#94A3B8]"><tr><th className="py-2">Job ID</th><th>Client</th><th>Provider</th><th>Status</th><th>Amount</th><th>Completed</th><th>Details</th></tr></thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-t border-[#22304A]">
                      <td className="py-2">{p.id}</td><td>{p.client}</td><td>{p.provider}</td><td><StatusBadge label={p.status} /></td><td>{p.amount}</td><td>{p.completed}</td><td><span className="text-cyan-300">Open</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="rounded-xl border border-[#22304A] bg-[#111A2E] p-3 text-xs text-[#94A3B8]">
              Derived from job lifecycle state; dedicated settlement event API is not claimed.
            </p>
          </div>
        </Section>

        <Section title="Docs / API" subtitle="Developer-console style integration preview.">
          <div className="grid gap-4 xl:grid-cols-[0.8fr_1.6fr_0.8fr]">
            <aside className="rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
              <p className="mb-3 text-sm text-white">Endpoints</p>
              <ul className="space-y-2 text-xs text-[#94A3B8]">
                {endpoints.map((e) => (
                  <li key={e} className="rounded-lg border border-[#22304A] bg-[#0D1324] p-2 font-mono">{e}</li>
                ))}
              </ul>
            </aside>
            <main className="space-y-3 rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
              <h3 className="text-lg font-semibold">GET /api/jobs?limit=1</h3>
              <pre className="overflow-x-auto rounded-xl border border-[#22304A] bg-[#070A12] p-3 text-xs text-cyan-200">{`curl "https://agentpay-dusky.vercel.app/api/jobs?limit=1"`}</pre>
              <pre className="overflow-x-auto rounded-xl border border-[#22304A] bg-[#070A12] p-3 text-xs text-[#94A3B8]">{`{
  "ok": true,
  "service": "AgentPay",
  "environment": "Arc Testnet",
  "chainId": 5042002,
  "jobs": [{ "id": "31192", "statusLabel": "Completed" }],
  "readOnly": true
}`}</pre>
            </main>
            <aside className="space-y-3 rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">
              <p className="text-sm text-white">Integration status</p>
              <div className="flex flex-wrap gap-2">
                <StatusBadge label="Read-only" />
                <StatusBadge label="NOT_CLAIMED" />
              </div>
              <ul className="space-y-2 text-xs text-[#94A3B8]">
                <li>No custody</li>
                <li>No signing</li>
                <li>No write API</li>
              </ul>
            </aside>
          </div>
        </Section>

        <Section title="Component system preview" subtitle="Tokens, statuses, controls, and reusable UI language.">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">{["Open", "Funded", "Submitted", "Completed", "Unsupported", "NOT_CLAIMED"].map((s) => <StatusBadge key={s} label={s} />)}</div>
            <div className="flex flex-wrap gap-2">{["Arc Testnet", "USDC", "ArcNS", "API v0", "Read-only", "Paymaster Unsupported"].map((s) => <IntegrationBadge key={s} label={s} />)}</div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-xl bg-[#2DD4FF] px-4 py-2 text-sm font-semibold text-[#070A12]">Primary</button>
              <button className="rounded-xl border border-[#22304A] bg-[#111A2E] px-4 py-2 text-sm">Secondary</button>
              <button className="rounded-xl px-4 py-2 text-sm text-[#94A3B8] hover:text-white">Ghost</button>
            </div>
            <div className="rounded-2xl border border-[#22304A] bg-[#111A2E] p-4">Card component · elevated panel</div>
            <pre className="overflow-x-auto rounded-xl border border-[#22304A] bg-[#070A12] p-3 text-xs text-[#94A3B8]">{`GET /api/metadata
{ "readOnly": true, "environment": "Arc Testnet" }`}</pre>
            <div className="flex flex-wrap gap-2">{["Open", "Funded", "Submitted", "Completed"].map((s) => <StatusBadge key={`step-${s}`} label={s} />)}</div>
            <div className="inline-flex rounded-full border border-violet-400/40 bg-violet-400/10 px-3 py-1 text-xs text-violet-200">agentpayagent.circle · 0x9c90...ACBC</div>
            <p className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-xs text-cyan-100">Info: Arc Testnet MVP with read-only API boundaries.</p>
            <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-100">Warning: Paymaster unsupported on Arc Testnet.</p>
          </div>
        </Section>

        <Section title="Implementation notes" subtitle="Preview-only boundaries for founder review.">
          <ul className="list-inside list-disc space-y-2 text-sm text-[#94A3B8]">
            <li>Isolated route at <code className="text-cyan-300">/design-preview</code> with static mock data only.</li>
            <li>No wallet hooks, contract writes, API reads, chain calls, or transaction execution.</li>
            <li>Copy is claim-safe: Arc Testnet MVP, read-only API v0, Paymaster unsupported, mainnet readiness NOT_CLAIMED.</li>
            <li>Direction target: premium, technical, Arc-native command-center language using Settlement Grid metaphor.</li>
          </ul>
          <div className="pt-2 text-sm text-[#64748B]">
            Next after approval: apply this visual system incrementally to real routes without changing business logic.
          </div>
          <div className="pt-3 text-xs text-[#64748B]">
            <Link href="/" className="text-cyan-300 hover:underline">Return to product homepage</Link>
          </div>
        </Section>
      </div>
    </div>
  );
}