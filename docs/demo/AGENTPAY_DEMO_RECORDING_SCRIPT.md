# AgentPay Demo Recording Script (Grant Submission)

Target length: **under 5:00**

## 0:00–0:20 — Opening

“This is AgentPay, a USDC-native escrow and job settlement layer for autonomous agents and marketplaces on Arc Testnet.”

“You’re viewing the live deployment at: `https://agentpay-dusky.vercel.app`.”

“This is an Arc Testnet MVP focused on verified lifecycle behavior and claim-safe integration boundaries.”

## 0:20–0:55 — Problem and solution

“Agent work needs escrow-backed coordination, clients need clear status and settlement visibility, and agents need readable identity plus lifecycle tracking.”

“AgentPay coordinates job creation, escrow lifecycle, identity readability through ArcNS, and read-only integration visibility through API v0.”

## 0:55–1:35 — Product walkthrough: Homepage + Agents

1. Open `/` homepage.
2. Point to Arc Testnet MVP + read-only API v0 surfaces.
3. Open `/agents`.
4. State:
   - ArcNS identity/readability is supported.
   - Demo names include `agentpayagent.circle` and `agentpayclient.arc`.
   - The current agent registry page is a demo/static catalog.
   - **Production registry is NOT_CLAIMED.**

## 1:35–2:20 — Create Job flow

1. Open `/create-job`.
2. Show provider/agent wallet field, USDC budget planning context, and Arc Testnet context.
3. Say:
   - “This flow is wallet-confirmed.”
   - “There is no server custody and no server-side signing.”
4. Do **not** send a transaction unless pre-approved.
5. If not submitting, say exactly:

“For this recording, I’m showing the live configured flow without sending a new transaction.”

## 2:20–3:05 — Jobs + Job Detail

1. Open `/jobs`.
2. Show indexed jobs list, stats, and filters.
3. Open job detail (`/jobs/31003` if available; otherwise use the first live indexed job).
4. Say:
   - “This dashboard is derived from JobCreated logs with getJob enrichment.”
   - “Job detail actions are wallet-gated and role-dependent.”
   - “This is an Arc Testnet MVP read surface, not a protocol-wide finality claim.”

## 3:05–3:35 — Payments

1. Open `/payments`.
2. Show completed/pending states and derived totals.
3. Say exactly:

“This page is derived from job lifecycle state. A dedicated settlement event API is not claimed.”

## 3:35–4:20 — Developer Docs + API

1. Open `/docs`.
2. Highlight API v0 is read-only.
3. Open or run examples:
   - `/api/health`
   - `/api/jobs?limit=1`
   - `/api/payments?limit=1`
   - `/api/identity/resolve?name=agentpayagent.circle`
4. Say:
   - “The Developer API v0 is read-only.”
   - “No custody, no server-side signing, and no write API are exposed in v0.”

## 4:20–4:50 — Codebase walkthrough

Show briefly in repo:

- `src/app/*` routes
- `src/app/api/*` read-only routes
- lifecycle hooks (`useCreateJob`, `useFundJob`, `useSubmitDeliverable`, `useCompleteJob`)
- `src/lib/events.ts` (JobCreated parsing)
- `src/lib/erc8183.ts` (verified tutorial/reference subset framing)
- `src/lib/arcnsResolver.ts`
- `src/components/ui/agentpay/*`
- claim-safe docs under `docs/grant/agentpay/*` and `docs/demo/*`

## 4:50–5:00 — Closing

“AgentPay is live on Arc Testnet.”

“USDC escrow and the job lifecycle are verified in the current MVP scope.”

“Developer API v0 is live and read-only.”

“Paymaster/Gasless on Arc Testnet is NOT_CLAIMED until Circle support and deployment exist.”

“AgentPay is ready for grant review as an Arc Testnet MVP.”
