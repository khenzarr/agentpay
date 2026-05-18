# Implementation Status — AgentPay MVP Demo Path

**Date:** 2026-05-18  
**Phase:** Master Prompt #7A (App Kit Send local script integration)

---

## 1) Summary

AgentPay frontend now supports an end-to-end Arc Testnet MVP demo path with real on-chain interactions and event-driven UX, based on the verified tutorial subset ABI.

### Verified implemented

- `JobCreated` parsing utility exists (`src/lib/events.ts`)
- Create flow parses receipt logs and redirects to `/jobs/{jobId}` (`src/components/agentpay/CreateJobForm.tsx`)
- `/jobs` indexes real `JobCreated` logs and enriches records with `getJob` (`src/hooks/useAgentPayJobs.ts`, `src/app/jobs/page.tsx`)
- Dashboard stats are computed from indexed demo range (`src/hooks/useAgentPayJobs.ts`, `src/components/agentpay/JobsStats.tsx`)
- `/payments` uses derived indexed job state and does not fabricate unverified events (`src/app/payments/page.tsx`)
- `/jobs` and `/payments` now include Arc RPC indexing diagnostics + manual verified `getJob(jobId)` fallback for demo continuity when log indexing fails (`src/hooks/useAgentPayJobs.ts`, `src/app/jobs/page.tsx`, `src/app/payments/page.tsx`)
- Job detail UX includes role/action guidance and ArcScan links (`src/components/agentpay/JobDetailPanel.tsx`)
- Wagmi connector list cleaned up to reduce duplicate wallet options (`src/lib/wagmi.ts`)
- Homepage copy updated to strict product-safe language (`src/app/page.tsx`)
- App Kit Send local script utility implemented for Arc Testnet USDC with safe default dry-run (`scripts/appkit-send-arc-usdc.ts`)
- App Kit Send run command added (`package.json` → `appkit:send:arc:usdc`)
- App Kit Send env placeholders added (`.env.example`)
- App Kit Send script explicitly uses isolated env file: `.env.appkit.local` (not frontend `.env.local`)

---

## 2) Scope and claims

### Allowed current claims

- USDC escrow on Arc Testnet
- ERC-8183 tutorial ABI integration
- Real Arc Testnet lifecycle completed
- Optional ArcNS identity display/resolution support (non-blocking)

### Not implemented / do not claim

- Full ERC-8183 compliance
- Full ERC-8004 compliance
- CCTP integrated
- Gateway integrated
- Circle Wallets integrated
- Paymaster integrated

### App Kit Send status

- **CURRENT_VERIFIED**
- Live App Kit Send execution verified via `npm run appkit:send:arc:usdc` with `APPKIT_DRY_RUN=false`.
- Evidence: Arc Testnet (`Arc_Testnet`), token `USDC`, amount `0.01 USDC`.
- Tx hash: `0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb`
- ArcScan: https://testnet.arcscan.app/tx/0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb
- Private key was not printed during execution.
- Script uses isolated `.env.appkit.local` (git-ignored).

---

## 3) Feature status table

| Area | Status | Notes |
|------|--------|-------|
| `JobCreated` parsing | ✅ | `parseJobCreatedFromReceipt` implemented with parse + decode fallback |
| Create-job redirect to `/jobs/{jobId}` | ✅ | Redirect happens when event parse succeeds |
| Fallback when parse fails | ✅ | Tx hash + ArcScan + manual job ID instructions |
| `/jobs` event indexing | ✅ | Client-side log indexing from configurable from-block |
| `/jobs` filters | ✅ | All / as client / as provider |
| Dashboard stats | ✅ | Explicitly “indexed demo range”, not protocol-wide totals |
| `/payments` history | ✅ (derived) | Derived from current job status, no invented settlement events |
| Job detail grant-demo polish | ✅ | Status, participants, actions, role guidance, ArcScan links |
| ArcNS in core flow | ⏸ Optional | Non-blocking; core flow does not require ArcNS |

---

## 4) Environment variables

Current `.env.example` includes:

- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_DEMO_AGENT_ADDRESS`
- `NEXT_PUBLIC_DEMO_CLIENT_ADDRESS`
- `NEXT_PUBLIC_DEMO_AGENT_NAME`
- `NEXT_PUBLIC_DEMO_AGENT_ARCNS_NAME` (optional ArcNS resolver input for `/agents`)
- `NEXT_PUBLIC_DEMO_CLIENT_ARCNS_NAME` (optional ArcNS primary name mapping for connected client/evaluator displays)
- `NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK`
- `NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK` (optional fixed upper bound for demo recording window)
- `APPKIT_PRIVATE_KEY`
- `APPKIT_RECIPIENT_ADDRESS`
- `APPKIT_AMOUNT`
- `APPKIT_DRY_RUN` (default `true`)

For App Kit Send private-key operations, use a separate local-only file:

- `.env.appkit.local` (consumed by `npm run appkit:send:arc:usdc`)

Do not place App Kit private-key values in frontend runtime `.env.local`.

`NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK` is recommended for tighter, faster dashboard indexing in live demos.

When present, `NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK` bounds indexing to a fixed demo window
(`fromBlock -> toBlock`) to reduce post-demo noise in `/jobs` and `/payments`.

---

## 5) Files changed in MVP demo path + follow-up docs

### Core implementation files

- `src/lib/events.ts`
- `src/hooks/useCreateJob.ts`
- `src/hooks/useAgentPayJobs.ts`
- `src/components/agentpay/CreateJobForm.tsx`
- `src/components/agentpay/JobsStats.tsx`
- `src/components/agentpay/JobDetailPanel.tsx`
- `src/app/jobs/page.tsx`
- `src/app/payments/page.tsx`
- `src/app/page.tsx`
- `src/app/agents/page.tsx`
- `src/components/agentpay/ArcnsResolutionBadge.tsx`
- `src/components/agentpay/AddressIdentity.tsx`
- `src/hooks/useArcnsNameResolution.ts`
- `src/config/demo-agents.ts`
- `src/config/demo-identities.ts`
- `src/lib/wagmi.ts`
- `.env.example`
- `scripts/appkit-send-arc-usdc.ts`
- `package.json` (script: `appkit:send:arc:usdc`)

### Documentation / hygiene files

- `docs/grant/agentpay/DEMO_READINESS.md` (new)
- `docs/grant/agentpay/OPEN_QUESTIONS.md` (updated)
- `docs/grant/agentpay/IMPLEMENTATION_STATUS.md` (updated)
- `docs/REPO_HYGIENE.md` (new)
- `.gitignore` (updated)

---

## 6) Validation status

Validation rerun in this phase (Master Prompt #6):

| Command | Result |
|---------|--------|
| `npm run lint` | ✅ Pass |
| `npm run typecheck` | ✅ Pass |
| `npm run build` | ✅ Pass |

Notes:
- Build output showed successful compilation and route generation.
- No hidden failures were accepted.

---

## 6.1) Strict Circle integration classification

- App Kit Send: **CURRENT_VERIFIED**
- Bridge/CCTP: **NOT_CLAIMED**
- Gateway / Unified Balance: **NOT_CLAIMED**
- Circle Wallets (developer-controlled): **NOT_CLAIMED**
- Paymaster: **NOT_CLAIMED**

Reason: App Kit Send now has verified live-send evidence; other Circle products remain unimplemented/unverified in this repo.

---

## 7) What can now be demoed

- Connect client wallet and create on-chain job
- Auto-redirect to job detail using parsed `JobCreated` event job ID
- Switch wallets for role-based flow (set budget / submit / complete)
- Show indexed jobs dashboard and demo-range stats from real logs
- Show `/payments` derived activity from indexed job states
- Use ArcScan links for transparency and fallback

## 8) What still cannot be honestly demoed as implemented

- Full ERC-8183 ABI/event coverage or full compliance claim
- Circle App Kit/CCTP/Gateway/Wallets/Paymaster integration claims
- Protocol-wide analytics beyond indexed client-side demo range

---

## 9) Founder next steps

1. Set real values in `.env.local`
2. Set App Kit send values in `.env.appkit.local` (private-key script only)
3. Fund client + agent wallets on Arc Testnet
4. Set a practical `NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK`
5. (Optional but recommended for recording) Set `NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK`
6. Run end-to-end dry-run and capture fallback tx links
7. Record video using `docs/grant/agentpay/DEMO_READINESS.md`

---

## 10) Real Arc Testnet Dry-Run Status

**Status:** ✅ Lifecycle completed for Job #21683 (final confirmations pending)

### Dry-run preflight result

- ✅ Working directory context confirmed: `c:\Users\mertb\Desktop\NODE\agentpay`
- ✅ Required docs/code preflight reviewed
- ✅ Validation passed:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- ✅ Founder provided client/agent wallets and confirmed funding readiness
- ✅ `.env.local` configured with demo agent and temporary indexing block (`42654907`)
- ✅ Real Arc Testnet lifecycle completed for **Job #21683**
- ✅ Final on-chain job status observed as **Completed**
- ✅ Budget for the tested job: **1 USDC**

### Tx hashes (Job #21683)

- `createJob`: pending founder retrieval
- `setBudget`: `0x069dab5cf3f04ecba2f0a8945e82358aec0cda90e724cbdff5f2143c64ae4741`
- `approve/fund` (recorded as combined tx): `0x88ed0068e587bd3b2568fbe4b777ab1886f19e5e081bd9946b6ca81dfc85b0c3`
- `submit`: `0xa1e547989076080082cf7236468b779dc2000153c38c99a45ceacb30294fd466`
- `complete`: `0x7fc94712315aa9a040eea9fe4c9e3e979c8cfa0d2f07ad24cd1c9d8c99a2c424`

### Blockers

1. Retrieve and record `createJob` tx hash for Job #21683
2. Confirm `/jobs` indexing/dashboard verification for Job #21683
3. Confirm `/payments` page verification for Job #21683

### Demo indexing window for recording clarity

- Recommended bounded range for Job #21683 recording:
  - `NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK=42677950`
  - `NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK=42679120`
- This window is explicitly presented in UI copy as an indexed demo range and is
  **not** a protocol-wide ledger view.

### Next action

- Add the remaining confirmations in `docs/grant/agentpay/DRY_RUN_REPORT.md`, then proceed with grant demo recording.
