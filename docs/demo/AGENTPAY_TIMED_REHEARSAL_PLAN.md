# AgentPay Timed Rehearsal Plan (Final)

## 1. Final recording target

- Duration target: **4:30–4:50**
- Hard limit: **5:00**
- Style: **founder-level, clear, claim-safe, product-first**
- Do not perform live transaction unless separately approved.
- Use already indexed jobs and read-only API evidence.

## 2. Final timeline

| Time | Screen | What to show | Talk track | Risk |
|---|---|---|---|---|
| 0:00–0:15 | Live URL | Open `https://agentpay-dusky.vercel.app` and pause on homepage hero/badges. | “AgentPay is live on Arc Testnet. This is a claim-safe MVP walkthrough.” | Slow first load |
| 0:15–0:45 | Homepage | Problem and solution framing over hero + lifecycle sections. | “AgentPay is a USDC-native escrow and job settlement layer for autonomous agents and marketplaces on Arc Testnet.” | Over-explaining |
| 0:45–1:15 | Homepage | Show lifecycle states and status boundaries. | “Arc Testnet MVP, verified lifecycle/read surfaces, clear NOT_CLAIMED boundaries.” | Time drift |
| 1:15–1:45 | `/agents` | Show ArcNS names and static registry note. | “ArcNS identity/readability is live; production registry is NOT_CLAIMED.” | Claim drift |
| 1:45–2:15 | `/create-job` | Show configured flow only; wallet-confirmed boundary text. | “For the recording, I’m showing the live configured flow without sending a new transaction. Actions remain wallet-confirmed by the user.” | Wallet popup distraction |
| 2:15–2:55 | `/jobs` + `/jobs/31003` | Show indexed jobs, then detail page and role-based actions. | “Indexed from JobCreated + getJob enrichment; not a protocol-wide finality claim.” | Job ID unavailable |
| 2:55–3:20 | `/payments` | Show derived totals + activity table. | “Payments are derived from indexed job lifecycle state; a dedicated settlement event API is not claimed.” | RPC lag |
| 3:20–3:55 | `/docs` + API tabs | Show docs claim matrix and 2–3 read-only endpoint outputs. | “The Developer API v0 is read-only. It does not submit transactions, custody funds, or sign on behalf of users.” | Large payload / slow response |
| 3:55–4:35 | GitHub repo | Quick file-order walkthrough only (6–8 files). | “This is how product routes, lifecycle hooks, events, and read-only API tie together.” | Too deep in code |
| 4:35–4:50 | Closing screen | Return to live app or docs for close. | “Circle Paymaster/Gasless on Arc Testnet is NOT_CLAIMED until Circle support/deployment is available.” | Missing boundary statement |
| 4:50–5:00 | Buffer only | Pause, breathe, and end cleanly. | No new content unless needed for recovery. | Exceeding 5:00 |

## 3. Compressed voiceover script

“AgentPay is a USDC-native escrow and job settlement layer for autonomous agents and marketplaces on Arc Testnet.

This demo shows the live Arc Testnet MVP at agentpay-dusky.vercel.app, with verified lifecycle behavior, ArcNS readability, and clear claim boundaries.

Autonomous work needs escrow-backed coordination, lifecycle visibility, and readable identity between clients and agents. AgentPay provides that through job creation, lifecycle state transitions, and read surfaces.

On the homepage you can see the current scope: Arc Testnet MVP, USDC lifecycle context, ArcNS identity support, and read-only Developer API v0.

On Agents, identities like agentpayagent.circle and agentpayclient.arc improve readability. This page is a static MVP catalog; a production registry is NOT_CLAIMED.

On Create Job, the flow is wallet-confirmed. For the recording, I’m showing the live configured flow without sending a new transaction. Actions remain wallet-confirmed by the user.

On Jobs and Job Detail, the dashboard is derived from indexed JobCreated logs with getJob enrichment. Reads are live, and write actions are role-based and wallet-gated.

On Payments, settlement visibility is read-only and derived. Payments are derived from indexed job lifecycle state; a dedicated settlement event API is not claimed.

In Docs and API, the Developer API v0 is read-only. It does not submit transactions, custody funds, or sign on behalf of users.

Circle Paymaster/Gasless on Arc Testnet is NOT_CLAIMED until Circle support/deployment is available.

AgentPay is submitted as a live, claim-safe Arc Testnet MVP.”

## 4. Final tab order

Preload these tabs in this exact order:

1. `https://agentpay-dusky.vercel.app`
2. `https://agentpay-dusky.vercel.app/agents`
3. `https://agentpay-dusky.vercel.app/create-job`
4. `https://agentpay-dusky.vercel.app/jobs`
5. `https://agentpay-dusky.vercel.app/jobs/31003`
6. `https://agentpay-dusky.vercel.app/payments`
7. `https://agentpay-dusky.vercel.app/docs`
8. `https://agentpay-dusky.vercel.app/api/health`
9. `https://agentpay-dusky.vercel.app/api/jobs?limit=1`
10. `https://github.com/khenzarr/agentpay`

If job `31003` is unavailable, use `/api/jobs?limit=1` to select the first live job ID.

## 5. Final API commands to show

Use at most 3 commands in the recording:

```powershell
curl.exe https://agentpay-dusky.vercel.app/api/health
curl.exe "https://agentpay-dusky.vercel.app/api/jobs?limit=1"
curl.exe "https://agentpay-dusky.vercel.app/api/identity/resolve?name=agentpayagent.circle"
```

Optional if time permits:

```powershell
curl.exe "https://agentpay-dusky.vercel.app/api/payments?limit=1"
curl.exe https://agentpay-dusky.vercel.app/api/integration/status
```

## 6. Codebase walkthrough file order

Use max 6–8 files on camera:

1. `README.md` — Scope, live links, and claim boundaries at the top level.
2. `src/app/page.tsx` — Product entry surface showing MVP positioning and boundary badges.
3. `src/app/create-job/page.tsx` — Job creation route framing wallet-confirmed on-chain flow.
4. `src/components/agentpay/CreateJobForm.tsx` — Form logic for provider/evaluator inputs and tx-trigger path.
5. `src/hooks/useCreateJob.ts` — Direct wallet write hook for `createJob` with receipt tracking.
6. `src/app/jobs/page.tsx` — Indexed jobs UI with filters, diagnostics, and fallback behavior.
7. `src/lib/events.ts` — `JobCreated` parsing helpers for normalized lifecycle indexing.
8. `src/app/api/jobs/route.ts` — Read-only API v0 jobs endpoint and safe query validation.
9. Optional: `src/lib/circle-paymaster-support.ts` — Explicit unsupported-on-Arc Testnet paymaster status model.

## 7. Live transaction decision

Default:
- Do not send a transaction during recording.

Use this exact wording:

“For the recording, I’m showing the live configured flow without sending a new transaction. Actions remain wallet-confirmed by the user.”

If founder explicitly decides to send one:
- Create a separate pre-approved transaction runbook.
- Use tiny amount.
- Rehearse once.
- Capture tx hash.
- Do not improvise live.

## 8. Common failure handling

- If RPC is slow: keep already loaded pages visible and narrate observed state first.
- If job detail is slow: use `/api/jobs?limit=1` to choose a fallback live job ID; open that detail route.
- If API response is large: use `?limit=1` and show only key fields (`id`, `status`, `readOnly`, `source`).
- If wallet popup appears: close or minimize and restate that no live transaction is being sent in this recording.
- If a page needs refresh: do one hard refresh only, then continue from `/docs` or `/api/health` while route reloads.
- If demo exceeds time: skip optional API commands and optional code file; go straight to claim-safe closing.