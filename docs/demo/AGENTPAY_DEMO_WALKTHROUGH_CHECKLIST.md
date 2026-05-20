# AgentPay Demo Walkthrough Checklist

Related final guides:

- `./AGENTPAY_TIMED_REHEARSAL_PLAN.md` (strict recording timeline + compressed script)
- `./AGENTPAY_FINAL_GRANT_ASSETS_CHECKLIST.md` (final submission links + form snippets)

## Pre-recording environment checklist

- [ ] Browser is clean and ready (no unrelated tabs pinned in view).
- [ ] MetaMask is unlocked **only if** wallet surfaces are shown.
- [ ] Correct network selected: **Arc Testnet**.
- [ ] No sensitive tabs open (email, dashboards, private tools).
- [ ] No private keys, seed phrases, or secret managers visible.
- [ ] `.env*` files are closed and not visible in editor.
- [ ] Terminal font size is readable on recording.
- [ ] Browser zoom is readable (typically 100–125%).
- [ ] Vercel deployment is the latest expected build.
- [ ] GitHub repo page is preloaded.
- [ ] API curl commands are pre-staged.
- [ ] Demo wallet has no sensitive unrelated assets visible (if wallet popup appears).

## Live route checklist

- [ ] `https://agentpay-dusky.vercel.app`
- [ ] `https://agentpay-dusky.vercel.app/agents`
- [ ] `https://agentpay-dusky.vercel.app/create-job`
- [ ] `https://agentpay-dusky.vercel.app/jobs`
- [ ] `https://agentpay-dusky.vercel.app/jobs/31003` (or fallback indexed job)
- [ ] `https://agentpay-dusky.vercel.app/payments`
- [ ] `https://agentpay-dusky.vercel.app/docs`
- [ ] `https://agentpay-dusky.vercel.app/api/health`

## Recording flow checklist (final order)

- [ ] Opening statement (AgentPay + Arc Testnet MVP + live URL).
- [ ] Problem/solution framing (escrow coordination + lifecycle visibility).
- [ ] Homepage walkthrough.
- [ ] Agents page with ArcNS names (`agentpayagent.circle`, `agentpayclient.arc`).
- [ ] State that production registry is NOT_CLAIMED.
- [ ] Create Job flow walkthrough (no transaction submission unless approved).
- [ ] If no tx: say exact line about showing configured flow without sending.
- [ ] Jobs page walkthrough (indexed list, filters, stats).
- [ ] Job detail walkthrough (`/jobs/31003` or fallback job).
- [ ] Payments walkthrough and explicit derived-ledger boundary statement.
- [ ] Docs walkthrough + API v0 read-only boundary.
- [ ] Show API endpoints (health, jobs, payments, identity, integration status).
- [ ] Codebase quick walkthrough (routes, APIs, hooks, libs, UI primitives, docs).
- [ ] Closing statement with NOT_CLAIMED paymaster boundary.

## What not to do during recording

- [ ] Do **not** show `.env.local`.
- [ ] Do **not** show `.env.circle.local`.
- [ ] Do **not** show `.env.appkit.local`.
- [ ] Do **not** show private keys, seed phrases, or secrets.
- [ ] Do **not** claim Paymaster is live on Arc.
- [ ] Do **not** claim gasless is live on Arc.
- [ ] Do **not** claim mainnet readiness.
- [ ] Do **not** claim production SDK/API SLA.
- [ ] Do **not** send a transaction unless explicitly approved.
- [ ] Do **not** open unrelated wallet assets if avoidable.

## Backup plan (if RPC/API is slow)

- [ ] Keep previously loaded pages open and narrate from visible state.
- [ ] Pivot to `/docs` API examples while live endpoint catches up.
- [ ] Use prepared `curl.exe` output as read-only proof.
- [ ] State clearly: “Read-only endpoint may depend on live RPC availability.”
