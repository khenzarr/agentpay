import Link from "next/link";

const navItems = ["Home", "Agents", "Create job", "Jobs", "Payments", "Docs"];
const topBadges = ["Arc Testnet MVP", "Read-only API v0", "Paymaster unsupported"];
const integrationBadges = ["Arc Testnet", "USDC", "ArcNS", "API v0", "Paymaster Unsupported"];

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
];

const jobs = [
  { id: "#31001", client: "0x1453...D030", provider: "0x9c90...ACBC", budget: "350 USDC", status: "Open" },
  { id: "#31002", client: "0xAA12...9013", provider: "0x8aa1...72F1", budget: "1200 USDC", status: "Funded" },
  { id: "#31003", client: "0xCc10...F771", provider: "0x447c...118E", budget: "800 USDC", status: "Submitted" },
  { id: "#31004", client: "0x9911...Ab10", provider: "0xb01d...330A", budget: "450 USDC", status: "Completed" },
  { id: "#31005", client: "0x77AA...19Fc", provider: "0x4b12...AA10", budget: "200 USDC", status: "Open" },
];

const payments = [
  { id: "#30991", status: "Completed", amount: "210 USDC", completed: "2026-05-19 11:23" },
  { id: "#30994", status: "Funded", amount: "600 USDC", completed: "�" },
  { id: "#30999", status: "Pending", amount: "430 USDC", completed: "�" },
  { id: "#31000", status: "Completed", amount: "980 USDC", completed: "2026-05-20 08:02" },
];

const endpoints = [
  "GET /api/health",
  "GET /api/metadata",
  "GET /api/agents",
  "GET /api/jobs?limit=1",
  "GET /api/payments?limit=1",
  "GET /api/identity/resolve?name=agentpayagent.circle",
  "GET /api/integration/status",
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
    "Arc Testnet MVP": "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
    "Read-only API v0": "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
    "Paymaster unsupported": "border-amber-400/40 bg-amber-400/10 text-amber-200",
  };

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[label] ?? styles.NOT_CLAIMED}`}>{label}</span>;
}

function IntegrationBadge({ label }: { label: string }) {
  return <span className="inline-flex rounded-full border border-cyan-300/15 bg-[#111A2E] px-3 py-1 text-xs text-[#94A3B8]">{label}</span>;
}

function Panel({ title, subtitle, className = "", children }: { title: string; subtitle?: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`relative overflow-hidden rounded-3xl border border-cyan-300/10 bg-[#0D1324]/80 p-5 shadow-[0_0_80px_rgba(45,212,255,0.08)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_0%_0%,rgba(45,212,255,0.10),transparent_45%),radial-gradient(circle_at_100%_0%,rgba(139,92,246,0.08),transparent_40%)] ${className}`}>
      <div className="relative z-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-[#94A3B8] md:text-sm">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export default function DesignPreviewPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,rgba(45,212,255,0.15),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(139,92,246,0.14),transparent_32%),#070A12] text-[#F8FAFC]">
      <div className="mx-auto max-w-[1760px] space-y-6 px-4 py-6 md:px-8 md:py-8 2xl:px-12">
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <p>Preview only. Static mock data. No wallet, contract, API, or transaction calls.</p>
          <p className="mt-1">Founder review target: approve direction before applying to real pages.</p>
        </div>

        <header className="sticky top-3 z-20 rounded-3xl border border-cyan-300/10 bg-[#0D1324]/85 p-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400/30 to-violet-500/30 text-sm font-bold">AP</div><div><p className="text-lg font-semibold">AgentPay</p><p className="text-xs text-cyan-300">Arc Testnet command center</p></div></div>
            <nav className="flex flex-wrap gap-2 text-sm text-[#94A3B8]">{navItems.map((item) => <span key={item} className="rounded-lg px-3 py-1.5 hover:bg-[#111A2E] hover:text-white">{item}</span>)}</nav>
            <div className="flex flex-wrap items-center gap-2">{topBadges.map((b) => <StatusBadge key={b} label={b} />)}<button className="rounded-xl border border-cyan-400/50 bg-cyan-400/15 px-4 py-2 text-sm">Connect wallet</button></div>
          </div>
        </header>

        <main className="grid gap-5 xl:grid-cols-12 2xl:gap-6">
          <Panel title="Homepage mockup" subtitle="Settlement infrastructure landing view with premium board composition." className="xl:col-span-12">
            <div className="grid gap-6 xl:grid-cols-[1.18fr_1fr]">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Arc Testnet MVP</p>
                <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">Settlement infrastructure for autonomous work.</h1>
                <p className="max-w-3xl text-base text-[#94A3B8]">AgentPay coordinates jobs, escrow, identity, and USDC settlement for agents and marketplaces on Arc Testnet.</p>
                <div className="flex flex-wrap gap-3"><button className="rounded-xl bg-[#2DD4FF] px-4 py-2 text-sm font-semibold text-[#070A12]">Create job</button><button className="rounded-xl border border-cyan-300/20 bg-[#111A2E] px-4 py-2 text-sm">Explore jobs</button><button className="rounded-xl border border-violet-400/40 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">Read docs</button></div>
                <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">{homeStats.map((s) => <div key={s.label} className="rounded-2xl border border-cyan-300/10 bg-[#111A2E]/90 p-4"><p className="text-xs text-[#64748B]">{s.label}</p><p className="mt-1 text-xl font-semibold">{s.value}</p></div>)}</div>
                <div className="flex flex-wrap gap-2">{integrationBadges.map((b) => <IntegrationBadge key={b} label={b} />)}</div>
              </div>
              <div className="rounded-3xl border border-cyan-300/15 bg-[#0B1120]/90 p-5"><p className="mb-4 text-sm text-[#94A3B8]">Settlement Grid</p><div className="relative h-[390px] rounded-2xl border border-cyan-300/10 bg-[linear-gradient(180deg,rgba(17,26,46,0.75),rgba(8,12,22,0.95))]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,255,0.14),transparent_45%)]" /><div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-45" /><div className="absolute inset-x-[14%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" /><div className="absolute left-1/2 top-[16%] h-[68%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/35 to-transparent" /><div className="absolute left-1/2 top-1/2 h-36 w-52 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-cyan-300/45 bg-gradient-to-b from-[#121B35] to-[#0C1326] p-4 shadow-[0_0_80px_rgba(45,212,255,0.28)]"><p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Core Node</p><p className="mt-1 text-2xl font-semibold">AgentPay</p><p className="mt-1 text-xs text-[#94A3B8]">USDC escrow � identity � read-only API v0</p></div>{["Client","Agent","Escrow","ArcNS","API"].map((n,i)=>{const pos=["left-8 top-10","right-8 top-12","left-10 bottom-12","right-10 bottom-14","left-1/2 -translate-x-1/2 top-4"][i];return <div key={n} className={`absolute ${pos} rounded-xl border border-cyan-300/20 bg-[#111A2E]/95 px-3.5 py-2 text-xs`}>{n}</div>;})}</div></div>
            </div>
          </Panel>

          <Panel title="Agents mockup" subtitle="Identity-aware operator directory." className="xl:col-span-3">
            <div className="space-y-3"><div className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 px-3 py-2 text-sm text-[#64748B]">Search agents, ArcNS, wallet...</div>{agents.map((a)=><article key={a.name} className="rounded-2xl border border-cyan-300/10 bg-[#111A2E]/90 p-4"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold">{a.name}</h3><IntegrationBadge label="ArcNS" /></div><p className="mt-1 text-xs text-[#94A3B8]">{a.wallet}</p><p className="mt-2 text-xs text-[#94A3B8]">{a.capabilities}</p><p className="mt-2 text-xs text-[#64748B]">Jobs: {a.jobs} � Success: {a.success}</p></article>)}</div>
          </Panel>

          <Panel title="Create Job mockup" subtitle="Secure workflow setup console." className="xl:col-span-5">
            <div className="grid gap-4 md:grid-cols-[1.45fr_1fr]"><div className="space-y-3">{["Provider / agent","Evaluator","Job title","Description","USDC budget","Expiry"].map((field)=><div key={field} className="space-y-1.5"><label className="text-xs font-medium text-[#94A3B8]">{field}</label><div className="rounded-xl border border-cyan-300/10 bg-[#0D1324] px-3 py-2.5 text-sm text-[#64748B]">{field==="Description"?"Describe output and acceptance criteria...":`Input ${field.toLowerCase()}`}</div></div>)}<div className="grid gap-2 sm:grid-cols-2"><button className="rounded-xl bg-[#2DD4FF] px-4 py-2.5 text-sm font-semibold text-[#070A12]">Connect wallet</button><button className="rounded-xl border border-cyan-300/20 bg-[#111A2E] px-4 py-2.5 text-sm">Review draft</button></div></div><div className="space-y-3"><div className="rounded-2xl border border-cyan-300/10 bg-[#111A2E]/90 p-4"><p className="text-xs font-medium text-[#94A3B8]">Lifecycle preview</p><div className="mt-2 flex flex-wrap gap-2">{["Open","Funded","Submitted","Completed"].map((s)=><StatusBadge key={s} label={s} />)}</div></div><div className="rounded-2xl border border-cyan-300/10 bg-[#111A2E]/90 p-4 text-sm"><p className="text-xs text-[#94A3B8]">Network</p><p className="mt-1">Arc Testnet � 5042002</p></div><p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">Preview only: wallet confirmation and chain writes are not executed here.</p></div></div>
          </Panel>

          <Panel title="Job Detail mockup" subtitle="Operational control panel preview." className="xl:col-span-4">
            <div className="space-y-4"><p className="text-xs text-[#64748B]">Jobs / #31003</p><h3 className="text-lg font-semibold">Cross-market research synthesis and scoring</h3><div className="flex flex-wrap gap-2">{["Open","Funded","Submitted","Completed"].map((s)=><StatusBadge key={s} label={s} />)}</div><div className="grid gap-2 sm:grid-cols-2"><div className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 p-3 text-sm"><p className="text-xs text-[#64748B]">Client</p><p>agentpayclient.arc � 0xCc10...F771</p></div><div className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 p-3 text-sm"><p className="text-xs text-[#64748B]">Provider</p><p>dataagent.arc � 0x447c...118E</p></div></div><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 p-3 text-sm"><p className="text-xs text-[#64748B]">Budget</p><p>800 USDC</p></div><div className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 p-3 text-sm"><p className="text-xs text-[#64748B]">Expiry</p><p>2026-05-31 16:00 UTC</p></div><div className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 p-3 text-sm"><p className="text-xs text-[#64748B]">Reference</p><p>JOB-ARC-31003</p></div><div className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 p-3 text-sm"><p className="text-xs text-[#64748B]">Chain</p><p>Arc 5042002</p></div></div><div className="rounded-xl border border-violet-400/30 bg-violet-400/10 p-3 text-sm"><p className="mb-2 text-violet-100">Action preview (static � no transaction execution)</p><div className="flex flex-wrap gap-2"><button className="rounded-lg border border-cyan-400/40 px-3 py-1.5">Fund</button><button className="rounded-lg border border-violet-400/40 px-3 py-1.5">Submit work</button><button className="rounded-lg border border-emerald-400/40 px-3 py-1.5">Complete job</button></div></div></div>
          </Panel>

          <Panel title="Jobs mockup" subtitle="Indexed from JobCreated events and enriched with getJob." className="xl:col-span-7">
            <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Total jobs","31,204"],["Escrowed USDC","87,412.20"],["Completed","12,948"],["Paid out USDC","54,988.50"]].map(([k,v])=><div key={k} className="rounded-2xl border border-cyan-300/10 bg-[#111A2E]/90 p-3"><p className="text-xs text-[#64748B]">{k}</p><p className="mt-1 text-lg font-semibold">{v}</p></div>)}</div><div className="rounded-2xl border border-cyan-300/10 bg-[#111A2E]/90 p-3"><div className="grid grid-cols-[0.8fr_1fr_1fr_0.9fr_0.9fr] gap-3 border-b border-cyan-300/10 pb-2 text-xs font-medium uppercase tracking-wide text-[#94A3B8]"><p>Job</p><p>Client</p><p>Provider</p><p>Budget</p><p>Status</p></div><div className="mt-1 space-y-1.5">{jobs.map((j)=><div key={j.id} className="grid grid-cols-[0.8fr_1fr_1fr_0.9fr_0.9fr] items-center gap-3 rounded-xl px-2 py-2.5 text-sm hover:bg-[#0D1324]"><p className="font-medium">{j.id}</p><p className="text-[#94A3B8]">{j.client}</p><p className="text-[#94A3B8]">{j.provider}</p><p>{j.budget}</p><StatusBadge label={j.status} /></div>)}</div></div></div>
          </Panel>

          <Panel title="Payments mockup" subtitle="Derived from indexed job state. No fabricated settlement events." className="xl:col-span-5">
            <div className="space-y-4"><div className="overflow-x-auto rounded-2xl border border-cyan-300/10 bg-[#111A2E]/90 p-3"><table className="min-w-full text-sm"><thead className="text-left text-[#94A3B8]"><tr><th className="py-2">Job</th><th>Status</th><th className="text-right">Amount</th><th className="pl-4">Completed</th></tr></thead><tbody>{payments.map((p)=><tr key={p.id} className="border-t border-cyan-300/10"><td className="py-2.5 font-medium">{p.id}</td><td><StatusBadge label={p.status} /></td><td className="text-right font-medium">{p.amount}</td><td className="pl-4 text-[#94A3B8]">{p.completed}</td></tr>)}</tbody></table></div><p className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 p-3 text-sm text-[#94A3B8]">Derived from job lifecycle state; dedicated settlement event API is not claimed.</p></div>
          </Panel>

          <Panel title="Docs/API mockup" subtitle="Developer-console style integration preview." className="xl:col-span-8">
            <div className="grid gap-3 xl:grid-cols-[0.95fr_1.4fr_0.85fr]"><aside className="rounded-2xl border border-cyan-300/10 bg-[#111A2E]/90 p-3"><p className="mb-3 text-sm text-white">Endpoints</p><ul className="space-y-2 text-[11px] text-[#94A3B8]">{endpoints.map((e)=><li key={e} className="rounded-lg border border-cyan-300/10 bg-[#0D1324] p-2 font-mono">{e}</li>)}</ul></aside><main className="space-y-3 rounded-2xl border border-cyan-300/10 bg-[#111A2E]/90 p-3"><h3 className="text-base font-semibold">GET /api/jobs?limit=1</h3><pre className="overflow-x-auto rounded-xl border border-cyan-300/20 bg-[#070A12] p-3 text-xs text-cyan-200">{`curl "https://agentpay-dusky.vercel.app/api/jobs?limit=1"`}</pre><pre className="overflow-x-auto rounded-xl border border-cyan-300/20 bg-[#070A12] p-3 text-xs text-[#94A3B8]">{`{\n  "ok": true,\n  "environment": "Arc Testnet",\n  "jobs": [{ "id": "31192", "statusLabel": "Completed" }],\n  "readOnly": true\n}`}</pre><div className="rounded-xl border border-cyan-300/15 bg-[#0D1324] p-3 text-xs text-[#94A3B8]">Read path is index-driven (`logs + getJob`) and does not expose write API in v0.</div></main><aside className="space-y-3 rounded-2xl border border-cyan-300/10 bg-[#111A2E]/90 p-3"><p className="text-sm text-white">Claim boundary</p><div className="flex flex-wrap gap-2"><StatusBadge label="Read-only" /><StatusBadge label="NOT_CLAIMED" /><span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">No custody</span><span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">No signing</span><span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">No write API</span></div><p className="text-xs text-[#94A3B8]">Mainnet readiness NOT_CLAIMED</p></aside></div>
          </Panel>

          <Panel title="Component system preview" subtitle="Reusable status, integration, controls, and lifecycle language." className="xl:col-span-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"><div className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 p-3"><p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#94A3B8]">Status badges</p><div className="flex flex-wrap gap-2">{["Open","Funded","Submitted","Completed","Unsupported","NOT_CLAIMED"].map((s)=><StatusBadge key={s} label={s} />)}</div></div><div className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 p-3"><p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#94A3B8]">Integration badges</p><div className="flex flex-wrap gap-2">{["Arc Testnet","USDC","ArcNS","API v0","Read-only","Paymaster Unsupported"].map((s)=><IntegrationBadge key={s} label={s} />)}</div></div><div className="rounded-xl border border-cyan-300/10 bg-[#111A2E]/90 p-3 2xl:col-span-2"><p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#94A3B8]">Buttons + lifecycle + code</p><div className="mb-2 flex flex-wrap gap-2"><button className="rounded-xl bg-[#2DD4FF] px-4 py-2 text-sm font-semibold text-[#070A12]">Primary</button><button className="rounded-xl border border-cyan-300/15 bg-[#111A2E] px-4 py-2 text-sm">Secondary</button></div><pre className="overflow-x-auto rounded-xl border border-cyan-300/15 bg-[#070A12] p-3 text-[11px] text-cyan-200">{`<StatusBadge label=\"Completed\" />\n<IntegrationBadge label=\"ArcNS\" />`}</pre></div></div>
          </Panel>

          <Panel title="Implementation notes" subtitle="Preview-only boundaries for founder review." className="xl:col-span-12">
            <div className="grid gap-4 md:grid-cols-2 text-sm text-[#94A3B8]"><ul className="list-inside list-disc space-y-2"><li>Isolated route at <code className="text-cyan-300">/design-preview</code> with static mock data only.</li><li>No wallet hooks, contract writes, API reads, chain calls, or transaction execution.</li><li>Copy is claim-safe: Arc Testnet MVP, read-only API v0, Paymaster unsupported, mainnet readiness NOT_CLAIMED.</li><li>No custody / no signing / no write API.</li></ul><div className="space-y-3"><p>Direction target: premium, technical, Arc-native command-center language using Settlement Grid metaphor.</p><p>Next after approval: apply this visual system incrementally to real routes without changing business logic.</p><p className="text-xs text-amber-200">Paymaster unsupported on Arc Testnet. Mainnet readiness NOT_CLAIMED.</p><Link href="/" className="inline-block text-cyan-300 hover:underline">Return to product homepage</Link></div></div>
          </Panel>
        </main>
      </div>
    </div>
  );
}
