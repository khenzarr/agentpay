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
- App Kit Bridge/CCTP local script implemented with estimate-first and dry-run default (`scripts/appkit-bridge-usdc-to-arc.ts`)
- App Kit Bridge/CCTP run command added (`package.json` → `appkit:bridge:usdc:arc`)
- App Kit Bridge/CCTP env placeholders added (`.env.example`)
- App Kit Gateway / Unified Balance discovery completed with official docs + installed SDK type confirmation (`docs/grant/agentpay/APP_KIT_GATEWAY_UNIFIED_BALANCE_DISCOVERY.md`)
- App Kit Gateway / Unified Balance local check script implemented (`scripts/appkit-unified-balance-check.ts`)
- App Kit Gateway / Unified Balance local spend-to-Arc script implemented with estimate-first + dry-run default (`scripts/appkit-unified-balance-spend-to-arc.ts`)
- App Kit Gateway / Unified Balance run commands added (`package.json` → `appkit:ub:check`, `appkit:ub:spend:arc`)
- App Kit Gateway / Unified Balance env placeholders added (`.env.example`)

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
- Gateway / Unified Balance live spend verified
- Circle Wallets signing/transfers/gasless/paymaster integrated
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
- `APPKIT_BRIDGE_PRIVATE_KEY`
- `APPKIT_BRIDGE_FROM_CHAIN` (default `Ethereum_Sepolia`)
- `APPKIT_BRIDGE_TO_CHAIN` (default `Arc_Testnet`)
- `APPKIT_BRIDGE_RECIPIENT_ADDRESS`
- `APPKIT_BRIDGE_AMOUNT` (default `0.01`)
- `APPKIT_BRIDGE_TOKEN` (default `USDC`)
- `APPKIT_BRIDGE_DRY_RUN` (default `true`)
- `APPKIT_UB_PRIVATE_KEY`
- `APPKIT_UB_SOURCE_CHAINS` (default `Ethereum_Sepolia`)
- `APPKIT_UB_DESTINATION_CHAIN` (default `Arc_Testnet`)
- `APPKIT_UB_RECIPIENT_ADDRESS`
- `APPKIT_UB_AMOUNT` (default `0.01`)
- `APPKIT_UB_TOKEN` (default `USDC`)
- `APPKIT_UB_DRY_RUN` (default `true`)
- `APPKIT_UB_INCLUDE_PENDING` (default `true`)

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
- `scripts/appkit-bridge-usdc-to-arc.ts`
- `package.json` (script: `appkit:bridge:usdc:arc`)
- `tsconfig.json` (includes `scripts/**/*.ts` and Node typings for script typecheck)

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
- Bridge/CCTP: **CURRENT_VERIFIED**
- Gateway / Unified Balance: **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED**
- Circle Wallets (developer-controlled): **CURRENT_VERIFIED (wallet creation + metadata read only)**
- Circle Wallets transfer estimate path: **CURRENT_CODE_IMPLEMENTED_TRANSFER_ESTIMATE_VERIFIED**
- Circle Wallets signing/send/gasless: **NOT_CLAIMED**
- Paymaster: **NOT_CLAIMED**

Paymaster discovery update (Master Prompt #11B):

- Discovery report: `docs/grant/agentpay/PAYMASTER_DISCOVERY.md`
- Feasibility classification: **FEASIBLE_BUT_NEEDS_CIRCLE_WALLETS_SIGNING_FLOW**
- Arc Testnet support: documented
- Current claim status: **NOT_CLAIMED**
- Reason: no real sponsored/gasless transaction proof exists yet; Circle Wallets signing/send transaction flow must be implemented and verified first, and gasless proof likely requires an SCA/ERC-4337-capable account path.

Circle Wallets discovery status (Master Prompt #10):

- Discovery report: `docs/grant/agentpay/CIRCLE_WALLETS_DISCOVERY.md`
- Feasibility classification: **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY**
- Additional gate: **FEASIBLE_BUT_NEEDS_BACKEND** (server-only secrets and backend approval)
- Arc Testnet support is documented in official Circle Wallets supported-blockchains docs, and founder-run in-repo wallet creation runtime proof is captured.
- Circle Wallets is **CURRENT_VERIFIED (wallet creation + metadata read only)** for grant/demo scope in this sprint.

Circle Wallets server-only readiness scaffold status (Master Prompt #10B):

- Added setup doc: `docs/grant/agentpay/CIRCLE_WALLETS_SERVER_SETUP.md`
- Added readiness script: `scripts/circle-wallets-readiness.ts`
- Added command: `npm run circle:wallets:readiness`
- Added setup commands:
  - `npm run circle:wallets:generate-entity-secret`
  - `npm run circle:wallets:register-entity-secret`
  - `npm run circle:wallets:create:arc`
- Added `.env.example` server-only placeholders:
  - `CIRCLE_API_KEY`
  - `CIRCLE_ENTITY_SECRET`
  - `CIRCLE_WALLET_SET_ID`
  - `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`
  - `CIRCLE_WALLETS_DRY_RUN=true`
  - `CIRCLE_WALLET_SET_NAME=AgentPay Arc Testnet Wallet Set`
  - `CIRCLE_WALLET_ACCOUNT_TYPE=EOA`
- Added explicit `.gitignore` entries for `.env.circle.local` patterns.
- Dependency decision: official Circle SDK dependency added (`@circle-fin/developer-controlled-wallets`).
- Internal readiness status: **CURRENT_VERIFIED** (wallet creation + metadata read only).
- Product/public claim status: **CURRENT_VERIFIED (wallet creation + metadata read only)**.
- Classification gate: **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY_AND_ENTITY_SECRET**.
- Founder-run live Circle wallet creation executed and verified in this sprint.

Circle Wallets verification evidence recorded:

- Command: `npm run circle:wallets:register-entity-secret`
- Result: entity secret registered successfully
- Recovery directory: `./.circle-recovery`
- Command: `npm run circle:wallets:readiness`
- Result: readiness checks passed
- `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`
- `CIRCLE_WALLETS_DRY_RUN=true`
- secrets redacted
- no live mutation performed by readiness
- Command: `npm run circle:wallets:create:arc`
- Result: wallet creation succeeded
- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `walletAddress: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- Command: `npm run circle:wallets:get-wallet`
- Result: wallet metadata fetched
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `address: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `accountType: EOA`
- `custodyType: DEVELOPER`
- `state: LIVE`
- `.env.circle.local` remains git-ignored
- `.circle-recovery` remains git-ignored
- No secrets committed
- Safety follow-up: set/restore `CIRCLE_WALLETS_DRY_RUN=true` after live proof

Circle Wallets transfer-estimate verification evidence recorded:

- Command: `npm run circle:wallets:list-balances`
- Result: `returnedTokenBalanceCount=1`, `filteredCount=1`, `filterBlockchain=ARC-TESTNET`, `filterSymbol=USDC`
- `tokenId: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`, `symbol: USDC`, `name: USDC`, `blockchain: ARC-TESTNET`, `decimals: 18`, `amount: 20`
- Command: `npm run circle:wallets:token-lookup`
- Result: `lookupBlockchain=ARC-TESTNET`, `lookupSymbol=USDC`, `candidateCount=1`, `source=getWalletTokenBalance`, `id=15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- Command: `npm run circle:wallets:estimate-transfer`
- Env: `CIRCLE_WALLET_TRANSFER_TOKEN_ID=15dc2b5d-0994-58b0-bf8c-3a0501148ee8`, `CIRCLE_WALLET_TRANSFER_DRY_RUN=true`
- Result: transfer estimate succeeded
- Low tier: `gasLimit=21000`, `networkFee=0.000897567715086`, `networkFeeRaw=0.000477567715086`, `baseFee=20`, `priorityFee=2.741319766`, `maxFee=42.741319766`
- Medium tier: `gasLimit=21000`, `networkFee=0.000911224445355`, `networkFeeRaw=0.000491224445355`, `baseFee=20`, `priorityFee=3.391640255`, `maxFee=43.391640255`
- High tier: `gasLimit=21000`, `networkFee=0.000933483353355`, `networkFeeRaw=0.000513483353355`, `baseFee=20`, `priorityFee=4.451588255`, `maxFee=44.451588255`
- No live transfer was executed.

Strict claim boundary:

- ✅ Allowed: Circle Developer-Controlled Wallet creation and metadata read verified on ARC-TESTNET
- ❌ Not yet verified: signing, token transfer/send, gasless transactions, paymaster

Paymaster-specific claim guardrail:

- Paymaster is feasible in principle, but must remain **NOT_CLAIMED** until a real sponsored/gasless transaction proof artifact is captured.

Reason: App Kit Send and Bridge/CCTP now have verified live-execution evidence; other Circle products remain unimplemented/unverified in this repo.

Bridge/CCTP discovery was completed in `docs/grant/agentpay/APP_KIT_BRIDGE_CCTP_DISCOVERY.md` and found feasible API support (`bridge`, `estimateBridge`, `Arc_Testnet`). Live verification has now been executed successfully, so status is **CURRENT_VERIFIED**.

Live verification evidence recorded:

1. Command: `npm run appkit:bridge:usdc:arc`
2. Env mode: `APPKIT_BRIDGE_DRY_RUN=false`
3. Provider: `CCTPV2BridgingProvider`
4. Source chain: `Ethereum_Sepolia`
5. Destination chain: `Arc_Testnet`
6. Source address: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
7. Recipient address: `0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
8. Token: `USDC`
9. Amount: `0.01`
10. Estimate was shown before live execution.
11. Bridge result state: `success`
12. Transfer speed: `FAST`
13. `approve` tx: `0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd`
14. `burn` tx: `0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9`
15. `fetchAttestation`: state `success`, cctpVersion `2`, status `complete`, sourceDomain `0`, destinationDomain `26`
16. `mint` tx: `0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436` (Arc block `42834309`)
17. Private key was not printed.
18. Script used isolated `.env.appkit.local` (git-ignored).

---

## 7) What can now be demoed

- Connect client wallet and create on-chain job
- Auto-redirect to job detail using parsed `JobCreated` event job ID
- Switch wallets for role-based flow (set budget / submit / complete)
- Show indexed jobs dashboard and demo-range stats from real logs
- Show `/payments` derived activity from indexed job states
- Use ArcScan links for transparency and fallback

Gateway / Unified Balance live deposit + pending-balance verification evidence recorded:

1. Command: `npm run appkit:ub:check`
2. Token: `USDC`
3. `includePending`: `true`
4. Supported chains included: Arc Testnet, Ethereum Sepolia, Base Sepolia, Arbitrum Sepolia, Polygon Amoy, Optimism Sepolia, Avalanche Fuji, Sonic Testnet, World Chain Sepolia, Sei Testnet, HyperEVM Testnet, Unichain Sepolia
5. `totalConfirmedBalance: 0.010000 USDC`
6. `totalPendingBalance: 0.000000 USDC`
7. `Ethereum_Sepolia confirmedBalance: 0.010000`
8. `Ethereum_Sepolia pendingBalance: 0.000000`
9. `Arc_Testnet confirmedBalance: 0.000000`

Live deposit evidence:

12. Command: `npm run appkit:ub:deposit`
13. Env mode: `APPKIT_UB_DEPOSIT_DRY_RUN=false`
14. Deposit API: `kit.unifiedBalance.deposit(params)`
15. Deposit mode: `deposit self`
16. Deposit chain: `Ethereum_Sepolia`
17. Token: `USDC`
18. Amount: `0.01`
19. Depositor: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
20. Deposited to: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
21. Tx hash: `0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a`
22. Explorer: https://sepolia.etherscan.io/tx/0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a
23. Private key was not printed.

Gateway / Unified Balance remains below **CURRENT_VERIFIED** until all are captured:

1. Live spend proof is captured.

Spend estimate verification update:

- Command: `npm run appkit:ub:spend:arc`
- Dry-run mode: `APPKIT_UB_DRY_RUN=true`
- Source chains: `Ethereum_Sepolia`
- Destination chain: `Arc_Testnet`
- Recipient: `0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
- Amount: `0.01`
- Token: `USDC`
- Forwarder: `true`
- Estimate output:
  - `gasFee: 1.203595 USDC`
  - gas allocation: `Ethereum_Sepolia, 1.203595 USDC`
  - forwarder fee: `0.203594 USDC`
- Live spend was intentionally not executed because fee estimate is high relative to `0.01 USDC`, and dry-run stops after estimate.

## 8) What still cannot be honestly demoed as implemented

- Full ERC-8183 ABI/event coverage or full compliance claim
- Circle Wallets signing/send/gasless/paymaster integration claims
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

Circle Wallets-specific founder gate for any next live mutation beyond wallet creation:
8. Founder confirms Circle Developer Console readiness for any next live mutation beyond wallet creation
9. Founder approves server-only backend scope for any additional Circle mutations
10. Provision Circle API key + entity secret flow out-of-band (do not paste secrets in chat)
11. Approve minimal verification runbook for any next step (sign/send/gasless proof capture)

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
