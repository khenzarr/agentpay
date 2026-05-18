# AgentPay Demo Readiness (Arc Testnet MVP)

**Last updated:** 2026-05-18

## 1) Current demo status

MVP demo-path is implemented for Arc Testnet:
- `createJob` transaction flow with `JobCreated` receipt parsing
- Redirect to `/jobs/{jobId}` on successful parse
- `/jobs` indexes real `JobCreated` logs and enriches with `getJob`
- `/payments` shows derived activity/settlement from indexed job state

## 2) What this demo proves

- USDC-native escrow workflow for agentic jobs on Arc Testnet
- ERC-8183 tutorial ABI integration for create/fund/submit/complete lifecycle
- Event-driven UX from on-chain logs (no fake data)
- Demo-range dashboard indexing with transparent scope labeling

## 3) Required wallets

- **Client wallet**
  - creates job
  - funds escrow
  - completes job
- **Agent wallet**
  - sets budget if required by reference contract
  - submits deliverable
  - receives USDC payout

## 4) Required balances

- Client wallet: enough Arc Testnet native USDC for gas + enough ERC-20 USDC for escrow if faucet provides ERC-20 USDC separately
- Agent wallet: enough Arc Testnet native USDC for gas

## 5) Required environment variables

- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_DEMO_AGENT_ADDRESS`
- `NEXT_PUBLIC_DEMO_CLIENT_ADDRESS`
- `NEXT_PUBLIC_DEMO_AGENT_NAME`
- `NEXT_PUBLIC_DEMO_AGENT_ARCNS_NAME` (optional; non-blocking ArcNS display on `/agents`)
- `NEXT_PUBLIC_DEMO_CLIENT_ARCNS_NAME` (optional; non-blocking ArcNS display for connected client/evaluator identity)
- `NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK`
- `NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK` (optional fixed upper bound for clean recording window)

## 6) Local run commands

```bash
npm install
cp .env.example .env.local
npm run dev
```

Validation commands:

```bash
npm run lint
npm run typecheck
npm run build
```

## 7) Step-by-step rehearsal flow

1. `npm install`
2. copy `.env.example` to `.env.local`
3. set `NEXT_PUBLIC_DEMO_AGENT_ADDRESS`
4. set `NEXT_PUBLIC_DEMO_AGENT_NAME` if using demo label
5. optionally set `NEXT_PUBLIC_DEMO_AGENT_ARCNS_NAME=agentpayagent.circle`
6. optionally set `NEXT_PUBLIC_DEMO_CLIENT_ARCNS_NAME=agentpayclient.arc`
7. set `NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK` to a recent block if dashboard indexing is slow
8. optionally set `NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK` to freeze the demo window and avoid post-demo noise
9. `npm run dev`
10. connect client wallet
11. create job
12. confirm redirect to `/jobs/{jobId}`
13. switch to agent wallet
14. set budget if required
15. submit deliverable
16. switch to client wallet
17. approve/fund USDC if required by flow
18. complete job
19. verify job status and ArcScan links
20. open `/jobs` and `/payments` to show indexed state

> Note: if live contract constraints require a slightly different order (e.g., budget before funding), follow and state the verified on-chain order during recording.

## 8) Known demo risks

- Arc RPC slowness / temporary instability
- Wallet network mismatch (must be Arc Testnet)
- Insufficient gas or ERC-20 USDC
- Event indexing may feel slow if from-block is too old
- `JobCreated` parse fallback may be needed in rare receipt/log mismatch cases

## 9) Troubleshooting notes

- If `/jobs` is slow/empty, set a newer `NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK`
- If `/payments` includes unrelated newer jobs during recording, set `NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK` to bound the demo range
- If redirect fails after create, open tx in ArcScan and manually open `/jobs/<jobId>`
- Confirm both wallets are funded and on chain ID `5042002`
- Retry with a fresh page load if wallet connector state gets stale

## 10) What not to claim in the video

Do not claim:
- Full ERC-8183 compliance
- App Kit integrated
- CCTP integrated
- Gateway integrated
- Circle Wallets integrated
- Paymaster integrated

## 11) Circle product claims allowed now

Allowed current claims:
- USDC escrow on Arc Testnet
- ERC-8183 tutorial ABI integration
- Built for Arc’s agentic economy
- Designed to evolve toward ERC-8004 / ERC-8183 compatible workflows

## 12) Circle product claim boundary (strict)

- App Kit Send: **CURRENT_VERIFIED**
- Bridge/CCTP: **NOT_CLAIMED**
- Gateway / Unified Balance: **NOT_CLAIMED**
- Circle Wallets (developer-controlled): **NOT_CLAIMED**
- Paymaster: **NOT_CLAIMED**

Note: App Kit Send live send verified via `npm run appkit:send:arc:usdc` with `APPKIT_DRY_RUN=false` on Arc Testnet USDC (`0.01`), tx `0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb`.

For App Kit Send private-key usage, run via isolated env file `.env.appkit.local` (through `npm run appkit:send:arc:usdc`). Keep frontend/demo runtime values in `.env.local` only.

## 13) Integration readiness matrix (recording-safe)

| Capability | Status now | Recording note |
|---|---|---|
| Arc Testnet chain flow | ✅ Implemented | Show chain ID `5042002` in wallet/network guard |
| USDC escrow lifecycle | ✅ Implemented | Show create → setBudget → approve/fund → submit → complete |
| ERC-8183 tutorial ABI subset | ✅ Implemented | Explicitly say “tutorial subset”, not full compliance |
| JobCreated receipt parsing + redirect | ✅ Implemented | Show redirect to `/jobs/{jobId}` after create |
| `/jobs` and `/payments` indexing | ✅ Implemented (demo-range) | Label as indexed demo block range only |
| ArcNS resolution | 🟨 Optional/non-blocking | Show with `agentpayagent.circle` (agent) and `agentpayclient.arc` (client/evaluator); fallback to raw wallet if resolver fails |
| App Kit Send | ✅ CURRENT_VERIFIED | Live send verified on Arc Testnet USDC with isolated `.env.appkit.local`; private key not printed |
| CCTP / Gateway / Wallets / Paymaster | ❌ NOT_CLAIMED | Not implemented/verified in this repo; do not claim in product demo |

## 14) Final pre-recording checklist

- [ ] Client and agent wallets funded
- [ ] `.env.local` set with correct demo agent + indexing range (`fromBlock` and optional `toBlock`)
- [ ] Arc Testnet selected in wallet
- [ ] One dry-run completed end-to-end
- [ ] ArcScan backup links saved for fallback
- [ ] `/jobs` and `/payments` show indexed data in selected range
- [ ] Claims in narration match implemented scope only

---

## 15) Latest verified rehearsal note (Master Prompt #4)

- Preflight completed and green:
  - `npm run lint` ✅
  - `npm run typecheck` ✅
  - `npm run build` ✅
- Runtime values now configured in `.env.local`:
  - `NEXT_PUBLIC_DEMO_AGENT_ADDRESS=0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
  - `NEXT_PUBLIC_DEMO_AGENT_NAME=AgentPay Demo Agent`
  - `NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK=42677950`
  - `NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK=42679120` (bounded demo window)
- Founder confirmed wallet readiness (gas + client ERC-20 USDC).
- One real end-to-end Arc Testnet lifecycle succeeded for **Job #21683** (final status: Completed, budget: 1 USDC).
- Demo recording can proceed after `/jobs` dashboard and `/payments` page verification are confirmed, and `createJob` tx hash is retrieved if desired.
- Use `docs/grant/agentpay/DRY_RUN_REPORT.md` as the source of truth for tx hashes, pass/fail steps, and blockers before recording.
