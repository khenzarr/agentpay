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
- Gateway integrated
- Circle Wallets signing/send/gasless/paymaster integrated
- Paymaster integrated

## 11) Circle product claims allowed now

Allowed current claims:
- USDC escrow on Arc Testnet
- ERC-8183 tutorial ABI integration
- Built for Arc’s agentic economy
- Designed to evolve toward ERC-8004 / ERC-8183 compatible workflows

## 12) Circle product claim boundary (strict)

- App Kit Send: **CURRENT_VERIFIED**
- Bridge/CCTP: **CURRENT_VERIFIED**
- Gateway / Unified Balance: **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED**
- Circle Wallets (developer-controlled): **CURRENT_VERIFIED (wallet creation only)**
- Paymaster: **NOT_CLAIMED**

Circle Wallets discovery note:

- See `docs/grant/agentpay/CIRCLE_WALLETS_DISCOVERY.md`
- Discovery classification: **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY**
- Additional gate: **FEASIBLE_BUT_NEEDS_BACKEND** (server-only credential handling)
- Arc Testnet support appears in official Circle Wallets chain support docs, and founder-run server-only wallet creation proof is now captured.

Paymaster discovery note:

- See `docs/grant/agentpay/PAYMASTER_DISCOVERY.md`
- Classification: **FEASIBLE_BUT_NEEDS_CIRCLE_WALLETS_SIGNING_FLOW**
- Arc Testnet support: documented
- Current Paymaster status: **NOT_CLAIMED**
- Claim rule: do not claim paymaster until a real sponsored/gasless transaction proof exists from a verified Circle Wallets signing/send flow (likely requiring an SCA/ERC-4337-capable account path).

Circle Wallets server-only readiness scaffold note (Master Prompt #10B):

- Setup/runbook added: `docs/grant/agentpay/CIRCLE_WALLETS_SERVER_SETUP.md`
- Local readiness script added: `scripts/circle-wallets-readiness.ts`
- Readiness command added: `npm run circle:wallets:readiness`
- Setup commands added:
  - `npm run circle:wallets:generate-entity-secret`
  - `npm run circle:wallets:register-entity-secret`
  - `npm run circle:wallets:create:arc`
- Circle env placeholders added to `.env.example` as server-only vars (no `NEXT_PUBLIC_*`)
- `.gitignore` now explicitly covers `.env.circle.local` patterns
- Internal readiness state: **CURRENT_VERIFIED** (wallet creation only)
- Product claim: **CURRENT_VERIFIED (wallet creation only)**
- Classification gate: **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY_AND_ENTITY_SECRET**
- Founder-run live wallet creation proof captured in this sprint; signing/send remains unverified.

Circle Wallets verification evidence:

- Command: `npm run circle:wallets:register-entity-secret`
- Result: entity secret registered successfully
- Recovery directory: `./.circle-recovery`
- Command: `npm run circle:wallets:readiness`
- Result: readiness checks passed (redacted secret output; no wallet mutation calls)
- Command: `npm run circle:wallets:create:arc`
- Result: wallet creation succeeded
- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `walletAddress: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- `.env.circle.local` remains git-ignored
- `.circle-recovery` remains git-ignored
- No secrets committed
- Safety follow-up: set/restore `CIRCLE_WALLETS_DRY_RUN=true` after live proof

Note: App Kit Send live send verified via `npm run appkit:send:arc:usdc` with `APPKIT_DRY_RUN=false` on Arc Testnet USDC (`0.01`), tx `0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb`.

Bridge/CCTP verification note: `docs/grant/agentpay/APP_KIT_BRIDGE_CCTP_DISCOVERY.md` confirms official SDK/docs support and Arc Testnet compatibility, and live bridge verification is now completed, so Bridge/CCTP is **CURRENT_VERIFIED**.

Bridge live verification evidence recorded:

- Command: `npm run appkit:bridge:usdc:arc`
- Env mode: `APPKIT_BRIDGE_DRY_RUN=false`
- Provider: `CCTPV2BridgingProvider`
- Source chain: `Ethereum_Sepolia`
- Destination chain: `Arc_Testnet`
- Source address: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Recipient address: `0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
- Token: `USDC`
- Amount: `0.01`
- Estimate was shown before live execution.
- Bridge result state: `success`
- Transfer speed: `FAST`
- `approve`: `0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd` (https://sepolia.etherscan.io/tx/0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd)
- `burn`: `0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9` (https://sepolia.etherscan.io/tx/0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9)
- `fetchAttestation`: state `success`, cctpVersion `2`, status `complete`, sourceDomain `0`, destinationDomain `26`
- `mint`: `0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436` (https://testnet.arcscan.app/tx/0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436), Arc block `42834309`
- Private key was not printed.
- Script used isolated `.env.appkit.local` (git-ignored).

### Bridge/CCTP pre-live execution checklist (founder runbook)

> Scope guardrails: do **not** run live bridge until this checklist is satisfied; do **not** change ABI; do **not** downgrade App Kit Send.

1. **Required source wallet balances (Ethereum_Sepolia)**
   - USDC balance >= `0.01` USDC (bridge amount)
   - USDC balance to cover fees observed in estimate:
     - provider fee: `0.000001` USDC
     - mint gas fee (quoted in USDC): `0.00498572012526` USDC
   - ETH for source-chain tx gas >= approve + burn estimate:
     - approve gas: `0.000034443320303273` ETH
     - burn gas: `0.000128975023984196` ETH
   - Practical buffer recommendation: keep extra ETH/USDC above estimate in case fees move.

2. **Expected transaction stages**
   - Stage A: `estimateBridge` preflight output
   - Stage B: token approval (if allowance needed)
   - Stage C: burn/bridge initiation on source chain
   - Stage D: CCTP attestation/finalization wait
   - Stage E: mint completion on destination (`Arc_Testnet`)

3. **Output fields to capture (proof artifact set)**
   - Command used and env mode (`APPKIT_BRIDGE_DRY_RUN=false`)
   - Source chain + destination chain
   - Source and recipient addresses
   - Token + amount
   - Full printed `bridge result` object from script
   - Any operation IDs / tx hashes (approve, burn, mint/finalization) present in output
   - Timestamp of execution

4. **What counts as successful live proof**
   - Script completes without `bridge failed` error
   - `bridge result` indicates successful completion/finalization
   - At least one verifiable on-chain artifact is recorded (tx hash/operation reference)
  - Documentation reflects `CURRENT_VERIFIED` **only after** live proof is captured

5. **Likely errors and recovery**
   - Missing env vars / invalid key / invalid address / invalid amount
     - Fix `.env.appkit.local` values and re-run
   - Unsupported chain/token route
     - Ensure `Ethereum_Sepolia -> Arc_Testnet` with `USDC`
   - Insufficient USDC or insufficient ETH gas
     - Top up source wallet, then retry
   - Temporary attestation/finalization delay
     - Wait and re-check before retrying duplicate bridge submission

6. **Private key exposure check**
   - Script does **not** log private key (only configuration fields: chain, recipient, amount, token, dry-run).

7. **Attestation/finalization wait expectation**
   - Yes. Live CCTP bridge may require asynchronous waiting between burn and destination mint finalization.

8. **Exact live command**

```bash
npm run appkit:bridge:usdc:arc
```

Prerequisite in `.env.appkit.local`:

```bash
APPKIT_BRIDGE_DRY_RUN=false
```

9. **Exact docs to update after successful live proof**
   - `docs/grant/agentpay/APP_KIT_BRIDGE_CCTP_DISCOVERY.md`
   - `docs/grant/agentpay/DEMO_READINESS.md`
   - Update status label to `CURRENT_VERIFIED` only with captured live proof artifacts.

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
| CCTP / Gateway / Wallets / Paymaster | 🟨 MIXED | CCTP is **CURRENT_VERIFIED**; Gateway is **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED** (below CURRENT_VERIFIED until live spend proof); Wallets are **CURRENT_VERIFIED (wallet creation only)**; Paymaster remains **NOT_CLAIMED** |

Gateway / Unified Balance live deposit + confirmed-balance verification evidence recorded:

- Command: `npm run appkit:ub:check`
- Token: `USDC`
- `includePending`: `true`
- Supported chains included: Arc Testnet, Ethereum Sepolia, Base Sepolia, Arbitrum Sepolia, Polygon Amoy, Optimism Sepolia, Avalanche Fuji, Sonic Testnet, World Chain Sepolia, Sei Testnet, HyperEVM Testnet, Unichain Sepolia
- `totalConfirmedBalance: 0.010000 USDC`
- `totalPendingBalance: 0.000000 USDC`
- `Ethereum_Sepolia confirmedBalance: 0.010000`
- `Ethereum_Sepolia pendingBalance: 0.000000`
- `Arc_Testnet confirmedBalance: 0.000000`

Live deposit evidence recorded:

- Command: `npm run appkit:ub:deposit`
- Env mode: `APPKIT_UB_DEPOSIT_DRY_RUN=false`
- Deposit API: `kit.unifiedBalance.deposit(params)`
- Deposit mode: `deposit self`
- Deposit chain: `Ethereum_Sepolia`
- Token: `USDC`
- Amount: `0.01`
- Depositor: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Deposited to: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Tx hash: `0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a`
- Explorer: https://sepolia.etherscan.io/tx/0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a
- Private key was not printed.

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

## 14) Final pre-recording checklist

- [ ] Client and agent wallets funded
- [ ] `.env.local` set with correct demo agent + indexing range (`fromBlock` and optional `toBlock`)
- [ ] Arc Testnet selected in wallet
- [ ] One dry-run completed end-to-end
- [ ] ArcScan backup links saved for fallback
- [ ] `/jobs` and `/payments` show indexed data in selected range
- [ ] Claims in narration match implemented scope only

## 17) Circle Wallets founder safety gate (post-wallet-creation proof)

Wallet creation is verified. For any next Circle Wallets step (sign/send/gasless), keep these gates:

1. Founder confirms Circle Developer Console readiness.
2. Founder keeps Circle secrets server-only and out-of-chat/client scope.
3. Founder approves each live mutation step explicitly (sign/send).
4. Capture artifacts without exposing secrets.

Current status boundary: **CURRENT_VERIFIED (wallet creation only)**.
Unverified: signing, token transfer/send, gasless, paymaster.

Paymaster status boundary: **NOT_CLAIMED** (feasible in principle, but no real sponsored/gasless tx proof captured yet).

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

---

## 16) Unified Balance deposit-path readiness update (Master Prompt #9A)

- Deposit discovery completed and recorded in:
  - `docs/grant/agentpay/APP_KIT_GATEWAY_UNIFIED_BALANCE_DEPOSIT_DISCOVERY.md`
- Local script implemented:
  - `scripts/appkit-unified-balance-deposit.ts`
- Command added:
  - `npm run appkit:ub:deposit`
- Live deposit was executed with explicit env toggle (`APPKIT_UB_DEPOSIT_DRY_RUN=false`).
- Gateway / Unified Balance status is now **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED**.
- Status remains below **CURRENT_VERIFIED** until live spend proof is captured.
