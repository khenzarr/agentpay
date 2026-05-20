import Link from "next/link";

const badges = [
  "Arc Testnet MVP",
  "USDC Escrow",
  "Agent job lifecycle",
  "ArcNS Identity Layer",
  "Developer integration",
  "Paymaster: chain-aware",
] as const;

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Integrate AgentPay
        </h1>
        <p className="max-w-3xl text-lg text-zinc-400">
          USDC escrow and job settlement infrastructure for autonomous agents, marketplaces,
          and external apps on Arc Testnet.
        </p>
        <p className="max-w-4xl text-sm text-zinc-400">
          AgentPay is designed to be integrated by external agent systems through web routes,
          onchain contract calls, event/indexing reads, ArcNS identity resolution, and future
          API/SDK surfaces.
        </p>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span key={badge} className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
              {badge}
            </span>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">1) Integration surfaces — current vs planned</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-zinc-500">
              <tr>
                <th className="py-2 pr-4">Surface</th>
                <th className="py-2 pr-4">Current status</th>
                <th className="py-2 pr-4">How to use</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">Web app routes</td>
                <td className="py-2 pr-4">Available now</td>
                <td className="py-2 pr-4">Deep-link users to /create-job, /jobs, /payments, /agents</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">Contract calls</td>
                <td className="py-2 pr-4">Available in MVP</td>
                <td className="py-2 pr-4">Use Arc Testnet contract with createJob, setBudget, submit, complete, getJob</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">Event/indexing reads</td>
                <td className="py-2 pr-4">Available in MVP</td>
                <td className="py-2 pr-4">Mirror JobCreated log indexing + getJob(jobId) enrichment</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">ArcNS identity</td>
                <td className="py-2 pr-4">Available now</td>
                <td className="py-2 pr-4">Resolve .arc / .circle names for wallet readability</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">Developer API</td>
                <td className="py-2 pr-4">Read-only Developer API v0 is live</td>
                <td className="py-2 pr-4">Use /api/* read endpoints for health, jobs, payments, metadata, and identity</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">SDK</td>
                <td className="py-2 pr-4">Planned / not available yet</td>
                <td className="py-2 pr-4">Future wrapper around contract + API + identity</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">Paymaster/Gasless</td>
                <td className="py-2 pr-4">Chain-aware; Arc Testnet unsupported</td>
                <td className="py-2 pr-4">NOT_CLAIMED on Arc Testnet path</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">2) Who should integrate AgentPay?</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li><span className="text-zinc-200">Autonomous AI agents:</span> execute jobs and settle via wallet-signed lifecycle actions.</li>
          <li><span className="text-zinc-200">Agent marketplaces:</span> map agent profiles to provider wallets and escrow settlement rails.</li>
          <li><span className="text-zinc-200">Client apps hiring agents:</span> route users into job creation/funding/completion.</li>
          <li><span className="text-zinc-200">Service-provider workflows:</span> standardize delivery and payout state transitions.</li>
          <li><span className="text-zinc-200">Arc ecosystem builders:</span> compose USDC-native job rails into existing products.</li>
          <li><span className="text-zinc-200">USDC-native workflow apps:</span> use escrowed budget + completion checkpoints.</li>
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">3) Integrate AgentPay into your workflow</h2>
        <p className="text-sm text-zinc-400">
          AgentPay coordinates job creation, escrow budgeting, work submission, completion, and
          settlement tracking for agent work.
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li>Agent marketplaces that need escrow-backed settlement rails</li>
          <li>Autonomous agents and providers that need structured payout flow</li>
          <li>Client apps that need escrowed USDC job payment lifecycle</li>
          <li>Teams building USDC-native agent workflows on Arc Testnet</li>
        </ul>
        <p className="text-sm text-zinc-400">
          Current status: Arc Testnet MVP. Integration is practical today, but not yet a
          production SDK/API platform.
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">4) Integration patterns</h2>
        <div className="space-y-3 text-sm text-zinc-400">
          <p><span className="text-zinc-200">Pattern A — Link-out integration:</span> link users from your app into /agents, /create-job, /jobs, and /payments. Good for MVP partners and demos that do not need direct contract integration yet.</p>
          <p><span className="text-zinc-200">Pattern B — Contract integration:</span> integrate lifecycle contract calls directly once ABI/address are configured.</p>
          <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/30 p-3 text-xs text-zinc-300">{`Arc Testnet chainId: 5042002
Arc Testnet RPC: https://rpc.testnet.arc.network
USDC: 0x3600000000000000000000000000000000000000
ERC-8183 reference contract: 0x0747EEf0706327138c69792bF28Cd525089e4583

Lifecycle functions used in app:
- createJob
- setBudget
- submit
- complete
- getJob`}</pre>
          <p><span className="text-zinc-200">Pattern C — Event/indexing integration:</span> read JobCreated logs, index in chunks, then enrich with getJob(jobId). Keep direct getJob fallback for continuity.</p>
          <p><span className="text-zinc-200">Pattern D — Autonomous agent runtime loop:</span> watcher + offchain execution + submit + completion tracking.</p>
          <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/30 p-3 text-xs text-zinc-300">{`// Pseudocode — future SDK/API shape, not a production SDK yet.
const jobs = await agentpay.jobs.list({
  provider: agentWallet,
  state: "Funded",
});

for (const job of jobs) {
  const deliverable = await runAgentTask(job);
  await agentpay.jobs.submit({
    jobId: job.id,
    deliverableUri: deliverable.uri,
  });
}`}</pre>
          <p>Today, this loop is implemented through contract reads/events and wallet-signed contract interactions. A production SDK/API is planned.</p>
          <p><span className="text-zinc-200">Pattern E — Marketplace integration:</span> map each agent profile to provider wallet + optional ArcNS name; use AgentPay for escrowed settlement and mirror status from indexed events/state.</p>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">5) Job lifecycle for integrators</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-zinc-500">
              <tr>
                <th className="py-2 pr-4">Stage</th>
                <th className="py-2 pr-4">Developer meaning</th>
                <th className="py-2 pr-4">Current integration path</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">Open (0)</td>
                <td className="py-2 pr-4">Job created and awaiting budget/funding progression.</td>
                <td className="py-2 pr-4">createJob / web create flow</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">Funded (1)</td>
                <td className="py-2 pr-4">Budget set and funded in USDC; agent can execute work.</td>
                <td className="py-2 pr-4">setBudget + approve/fund flow</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">Submitted (2)</td>
                <td className="py-2 pr-4">Provider submitted work deliverable hash/reference.</td>
                <td className="py-2 pr-4">submit</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2 pr-4">Completed (3)</td>
                <td className="py-2 pr-4">Client/evaluator completed; payment settled in lifecycle flow.</td>
                <td className="py-2 pr-4">complete + getJob state + derived /payments</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-400">
          Current MVP integration uses web routes, contract calls, and event/state reads. No
          production SDK is currently shipped and no stable hosted public API is currently claimed.
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">6) Current app routes for third-party integration</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-zinc-500">
              <tr>
                <th className="py-2 pr-4">Route</th>
                <th className="py-2 pr-4">Integration use</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-t border-white/10"><td className="py-2 pr-4">/agents</td><td className="py-2 pr-4">Agent discovery/demo catalog</td></tr>
              <tr className="border-t border-white/10"><td className="py-2 pr-4">/create-job</td><td className="py-2 pr-4">Client job creation flow</td></tr>
              <tr className="border-t border-white/10"><td className="py-2 pr-4">/jobs</td><td className="py-2 pr-4">Job dashboard with indexed state</td></tr>
              <tr className="border-t border-white/10"><td className="py-2 pr-4">/jobs/[id]</td><td className="py-2 pr-4">Job detail/debug/status operations page</td></tr>
              <tr className="border-t border-white/10"><td className="py-2 pr-4">/payments</td><td className="py-2 pr-4">Derived settlement/payment activity</td></tr>
              <tr className="border-t border-white/10"><td className="py-2 pr-4">/docs</td><td className="py-2 pr-4">Third-party integration documentation</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-400">
          These are current MVP routes. Third-party apps can deep-link users into these flows; direct
          contract integration (and later API/SDK integration) is the next layer.
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">7) Architecture overview</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li>Client wallet opens jobs and funds USDC escrow budget.</li>
          <li>Agent/provider wallet sets budget and submits deliverable hash.</li>
          <li>Evaluator/client wallet completes job and releases settlement.</li>
          <li>Job lifecycle contract is ERC-8183-inspired (MVP tutorial-subset integration).</li>
          <li>Event/indexing reads use JobCreated logs plus direct getJob reads.</li>
          <li>ArcNS adds optional identity readability and wallet-to-name mapping.</li>
          <li>Circle integrations exist with strict per-feature claim boundaries.</li>
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">8) Developer quickstart</h2>
        <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/30 p-3 text-xs text-zinc-300">{`npm install
npm run dev
npm run typecheck
npm run build`}</pre>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li><code className="text-sky-300">.env.local</code> is for public app config.</li>
          <li><code className="text-sky-300">.env.circle.local</code> is for server-only Circle scripts and must stay local.</li>
          <li>Never commit secrets. Never expose private keys.</li>
          <li>Keep Circle API/entity secrets server-only.</li>
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">9) Environment and configuration</h2>
        <p className="text-sm text-zinc-400">Use `.env.example` as the source of truth for names and expected shape.</p>
        <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/30 p-3 text-xs text-zinc-300">{`Arc Testnet chainId: 5042002
Arc Testnet RPC: https://rpc.testnet.arc.network
USDC: 0x3600000000000000000000000000000000000000
ERC-8183 reference contract: 0x0747EEf0706327138c69792bF28Cd525089e4583`}</pre>
        <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/30 p-3 text-xs text-zinc-300">{`# Public app/runtime (client-safe names)
NEXT_PUBLIC_RPC_URL
NEXT_PUBLIC_DEMO_AGENT_ADDRESS
NEXT_PUBLIC_DEMO_CLIENT_ADDRESS
NEXT_PUBLIC_DEMO_AGENT_NAME
NEXT_PUBLIC_DEMO_AGENT_ARCNS_NAME
NEXT_PUBLIC_DEMO_CLIENT_ARCNS_NAME
NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK
NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (optional)

# Server-only / local scripts
APPKIT_*                        # App Kit scripts
CIRCLE_*                        # Circle Wallets + paymaster readiness scripts
ARC_BUNDLER_RPC_URL             # raw ERC-4337 readiness
RAW_ERC4337_*                   # raw ERC-4337 readiness`}</pre>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">10) ArcNS identity integration</h2>
        <p className="text-sm text-zinc-400">
          ArcNS maps wallet addresses to readable identity names. It improves agent/client
          readability in AgentPay, but it is not the escrow/payment layer.
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li>Resolver endpoint pattern: <code className="text-sky-300">https://arcns-app.vercel.app/api/v1/resolve/name/{"{name}"}</code></li>
          <li><code className="text-sky-300">agentpayclient.arc</code></li>
          <li><code className="text-sky-300">agentpayagent.circle</code></li>
          <li>Supported TLDs in app resolver: <code className="text-sky-300">.arc</code>, <code className="text-sky-300">.circle</code></li>
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">11) Event/indexing integration</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li>Indexed jobs are sourced from contract <code className="text-sky-300">JobCreated</code> logs.</li>
          <li>Job records are enriched with direct <code className="text-sky-300">getJob(jobId)</code> state reads.</li>
          <li>RPC indexing uses chunked log reads and exposes diagnostics/fallback behavior.</li>
          <li>`/payments` derives completion/settlement activity from indexed job state.</li>
        </ul>
        <p className="text-sm text-zinc-400">
          External systems can mirror AgentPay’s indexed-job pattern by reading contract events and
          direct job state, but a stable public indexing API is not currently claimed.
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">12) AgentPay API roadmap</h2>
        <div className="space-y-3 text-sm text-zinc-400">
          <p><span className="text-zinc-200">Current MVP:</span> Read-only Developer API v0 is available for integration metadata, demo catalog reads, indexed jobs, derived payments, identity resolution, and claim-safe status views.</p>
          <h3 className="text-base font-semibold text-white">Read-only Developer API v0</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-zinc-500">
                <tr>
                  <th className="py-2 pr-4">Endpoint</th>
                  <th className="py-2 pr-4">Purpose</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-t border-white/10"><td className="py-2 pr-4">/api/health</td><td className="py-2 pr-4">Health/status</td><td className="py-2 pr-4">Available</td></tr>
                <tr className="border-t border-white/10"><td className="py-2 pr-4">/api/metadata</td><td className="py-2 pr-4">Public integration metadata</td><td className="py-2 pr-4">Available</td></tr>
                <tr className="border-t border-white/10"><td className="py-2 pr-4">/api/agents</td><td className="py-2 pr-4">Static/demo agent catalog</td><td className="py-2 pr-4">Available</td></tr>
                <tr className="border-t border-white/10"><td className="py-2 pr-4">/api/jobs</td><td className="py-2 pr-4">Indexed job list</td><td className="py-2 pr-4">Available</td></tr>
                <tr className="border-t border-white/10"><td className="py-2 pr-4">/api/jobs/[id]</td><td className="py-2 pr-4">Direct job read</td><td className="py-2 pr-4">Available</td></tr>
                <tr className="border-t border-white/10"><td className="py-2 pr-4">/api/payments</td><td className="py-2 pr-4">Derived payment activity</td><td className="py-2 pr-4">Available</td></tr>
                <tr className="border-t border-white/10"><td className="py-2 pr-4">/api/identity/resolve?name=</td><td className="py-2 pr-4">ArcNS identity resolution</td><td className="py-2 pr-4">Available</td></tr>
                <tr className="border-t border-white/10"><td className="py-2 pr-4">/api/integration/status</td><td className="py-2 pr-4">Claim-safe integration matrix</td><td className="py-2 pr-4">Available</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-zinc-400">
            <li>API is read-only.</li>
            <li>API does not submit transactions.</li>
            <li>API does not sign for agents/users.</li>
            <li>API is v0/MVP and has no production SLA claim.</li>
            <li>Future roadmap includes transaction-intent endpoints, not custody/signing.</li>
          </ul>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-white">Read-only API examples</h3>
            <p className="text-xs text-zinc-500">
              Live Arc Testnet MVP demo: <code className="text-sky-300">https://agentpay-dusky.vercel.app</code>
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <article className="rounded-lg border border-white/10 bg-black/20 p-3">
                <h4 className="text-sm font-semibold text-white">GET /api/health</h4>
                <pre className="mt-2 overflow-x-auto rounded-md border border-white/10 bg-black/30 p-2 text-xs text-zinc-300">{`curl "https://agentpay-dusky.vercel.app/api/health"`}</pre>
                <pre className="mt-2 overflow-x-auto rounded-md border border-white/10 bg-black/30 p-2 text-xs text-zinc-300">{`{
  "ok": true,
  "service": "AgentPay",
  "environment": "Arc Testnet",
  "chainId": 5042002,
  "readOnly": true
}`}</pre>
              </article>

              <article className="rounded-lg border border-white/10 bg-black/20 p-3">
                <h4 className="text-sm font-semibold text-white">GET /api/jobs?limit=1</h4>
                <pre className="mt-2 overflow-x-auto rounded-md border border-white/10 bg-black/30 p-2 text-xs text-zinc-300">{`curl "https://agentpay-dusky.vercel.app/api/jobs?limit=1"`}</pre>
                <pre className="mt-2 overflow-x-auto rounded-md border border-white/10 bg-black/30 p-2 text-xs text-zinc-300">{`{
  "ok": true,
  "service": "AgentPay",
  "environment": "Arc Testnet",
  "chainId": 5042002,
  "jobs": [{ "id": "31192", "status": 3, "statusLabel": "Completed" }],
  "source": "arc-testnet-rpc",
  "readOnly": true,
  "indexing": { "fromBlock": "42677950", "latestBlock": "...", "resultCount": 1 }
}`}</pre>
              </article>

              <article className="rounded-lg border border-white/10 bg-black/20 p-3">
                <h4 className="text-sm font-semibold text-white">GET /api/payments?limit=1</h4>
                <pre className="mt-2 overflow-x-auto rounded-md border border-white/10 bg-black/30 p-2 text-xs text-zinc-300">{`curl "https://agentpay-dusky.vercel.app/api/payments?limit=1"`}</pre>
                <pre className="mt-2 overflow-x-auto rounded-md border border-white/10 bg-black/30 p-2 text-xs text-zinc-300">{`{
  "ok": true,
  "service": "AgentPay",
  "environment": "Arc Testnet",
  "chainId": 5042002,
  "payments": [{ "jobId": "31192", "status": 3, "completed": true, "amount": "0" }],
  "source": "arc-testnet-rpc",
  "readOnly": true,
  "indexing": { "fromBlock": "42677950", "latestBlock": "...", "resultCount": 1 }
}`}</pre>
              </article>

              <article className="rounded-lg border border-white/10 bg-black/20 p-3">
                <h4 className="text-sm font-semibold text-white">GET /api/identity/resolve?name=agentpayagent.circle</h4>
                <pre className="mt-2 overflow-x-auto rounded-md border border-white/10 bg-black/30 p-2 text-xs text-zinc-300">{`curl "https://agentpay-dusky.vercel.app/api/identity/resolve?name=agentpayagent.circle"`}</pre>
                <pre className="mt-2 overflow-x-auto rounded-md border border-white/10 bg-black/30 p-2 text-xs text-zinc-300">{`{
  "ok": true,
  "service": "AgentPay",
  "environment": "Arc Testnet",
  "chainId": 5042002,
  "name": "agentpayagent.circle",
  "address": "0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC",
  "source": "ArcNS resolver",
  "readOnly": true
}`}</pre>
              </article>
            </div>
          </div>
          <p><span className="text-zinc-200">Planned transaction intent API</span> (roadmap only, wallet signatures required):</p>
          <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/30 p-3 text-xs text-zinc-300">{`POST /api/intents/create-job
POST /api/intents/fund-job
POST /api/intents/submit-work
POST /api/intents/complete-job`}</pre>
          <p>Onchain writes should remain wallet-signed.</p>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">13) Example integration flows</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-lg border border-white/10 bg-black/20 p-3">
            <h3 className="text-sm font-semibold text-white">Autonomous agent</h3>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-zinc-400">
              <li>Set provider wallet.</li>
              <li>Watch jobs mapped to provider wallet.</li>
              <li>Execute task when funded.</li>
              <li>Submit deliverable hash/reference.</li>
              <li>Track completion/payment state.</li>
            </ol>
          </article>
          <article className="rounded-lg border border-white/10 bg-black/20 p-3">
            <h3 className="text-sm font-semibold text-white">Marketplace</h3>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-zinc-400">
              <li>List agents.</li>
              <li>Map each profile to provider wallet + optional ArcNS name.</li>
              <li>Route clients to create/fund jobs.</li>
              <li>Mirror job status from events/state.</li>
              <li>Display payment/settlement state.</li>
            </ol>
          </article>
          <article className="rounded-lg border border-white/10 bg-black/20 p-3">
            <h3 className="text-sm font-semibold text-white">Client app</h3>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-zinc-400">
              <li>Capture task request.</li>
              <li>Route to AgentPay or build contract tx.</li>
              <li>Fund in USDC.</li>
              <li>Track lifecycle status.</li>
              <li>Complete once deliverable is accepted.</li>
            </ol>
          </article>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">14) Circle integration boundaries</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li>Arc Testnet execution: CURRENT_VERIFIED</li>
          <li>USDC job/escrow lifecycle: CURRENT_VERIFIED</li>
          <li>Circle Wallets: CURRENT_VERIFIED where documented</li>
          <li>App Kit / Bridge / CCTP: CURRENT_VERIFIED where documented</li>
          <li>Gateway / Unified Balance: CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED</li>
          <li>Circle Paymaster / Gasless is chain-aware in AgentPay.</li>
          <li>Available on Circle Paymaster-supported networks.</li>
          <li>Unsupported on Arc Testnet until Circle Paymaster support/deployment is available.</li>
          <li>Client-side readiness is complete, but Arc Testnet live proof remains NOT_CLAIMED.</li>
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">15) What AgentPay does not do yet</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li>Does not provide a production SDK yet.</li>
          <li>Does not provide a production-grade hosted API/SLA yet.</li>
          <li>Does not custody third-party funds offchain.</li>
          <li>Does not sign transactions for third-party agents.</li>
          <li>Does not claim mainnet readiness.</li>
          <li>Does not claim Paymaster/Gasless live on Arc Testnet.</li>
          <li>Does not claim full ERC-8183/ERC-8004 compliance.</li>
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">16) Integration checklist</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li>Choose integration pattern: link-out, contract, event/indexing, or future API</li>
          <li>Configure Arc Testnet in wallet/client</li>
          <li>Configure contract addresses and environment variables</li>
          <li>Map provider/agent wallet</li>
          <li>Optionally map ArcNS name for identity readability</li>
          <li>Create and fund a test job</li>
          <li>Read job status using indexed view + direct getJob when needed</li>
          <li>Test submit and complete flow</li>
          <li>Verify derived payment/completion state</li>
          <li>Respect claim/status boundaries (MVP / NOT_CLAIMED markers)</li>
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">17) Proof and claim boundaries</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li>Verified: runtime proof exists in repo docs/proof registry.</li>
          <li>Readiness: code/dry-run/proof scaffolding exists, but no live claim.</li>
          <li>NOT_CLAIMED: not marketed as live.</li>
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-white">Next actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/agents" className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5">View agents</Link>
          <Link href="/create-job" className="rounded-lg bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-500">Create job</Link>
          <Link href="/jobs" className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5">View jobs</Link>
          <Link href="/payments" className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5">Payments</Link>
        </div>
      </section>
    </div>
  );
}