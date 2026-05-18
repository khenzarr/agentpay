# Circle + Arc Integration Audit — AgentPay (Master Prompt #8)

**Date:** 2026-05-18  
**Method:** Strict code/docs/runtime-path audit in current AgentPay repo.

## 1) Audit objective

Determine which Circle/Arc integrations are actually implemented and verifiable now, and classify everything else as **NOT_CLAIMED** or **BLOCKED** (never “planned” for product-facing claims).

## 2) Verified current integration scope

- **USDC escrow on Arc Testnet**: implemented and demoed.
- **ERC-8183 tutorial ABI integration**: implemented for MVP lifecycle flow.
- **Real Arc Testnet lifecycle completion**: documented for Job #21683.
- **ArcNS identity support**: optional/non-blocking display-resolution support only.

## 3) Strict Circle product audit

| Product / Capability | Status | Audit finding | Classification rationale |
|---|---|---|---|
| App Kit Send | **CURRENT_VERIFIED** | Live verification executed via `npm run appkit:send:arc:usdc` with `APPKIT_DRY_RUN=false` on `Arc_Testnet` sending `USDC` amount `0.01`; tx hash: `0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb` ([ArcScan](https://testnet.arcscan.app/tx/0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb)); script used isolated `.env.appkit.local`; private key was not printed | Runtime path now verifiably executed and confirmed |
| Bridge / CCTP | **CURRENT_VERIFIED** | Live verification executed via `npm run appkit:bridge:usdc:arc` with `APPKIT_BRIDGE_DRY_RUN=false` using `CCTPV2BridgingProvider`, route `Ethereum_Sepolia -> Arc_Testnet`, token `USDC`, amount `0.01`; bridge result state `success`, transfer speed `FAST`; approve tx `0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd`, burn tx `0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9`, mint tx `0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436`; isolated `.env.appkit.local`; private key not printed | Runtime path now verifiably executed and confirmed |
| Gateway / Unified Balance | **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED** | Live deposit executed via `npm run appkit:ub:deposit` with `APPKIT_UB_DEPOSIT_DRY_RUN=false` using `kit.unifiedBalance.deposit(params)` in deposit-self mode on `Ethereum_Sepolia` for `USDC` amount `0.01`; depositor/deposited-to `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`; tx `0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a` (https://sepolia.etherscan.io/tx/0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a). Post-deposit check via `npm run appkit:ub:check` (`token=USDC`, `includePending=true`) returned `totalConfirmedBalance: 0.010000 USDC`, `totalPendingBalance: 0.000000 USDC`, `Ethereum_Sepolia confirmedBalance: 0.010000`, `Ethereum_Sepolia pendingBalance: 0.000000`; private key not printed. Spend estimate executed via `npm run appkit:ub:spend:arc` in dry-run mode (`APPKIT_UB_DRY_RUN=true`) with `from=Ethereum_Sepolia`, `to=Arc_Testnet`, recipient `0xCdc3735BCC1DE14c48704859715F835d0A5a7168`, amount `0.01`, token `USDC`, `useForwarder=true`; estimate output: `gasFee: 1.203595 USDC`, gas allocation `Ethereum_Sepolia, 1.203595 USDC`, forwarder fee `0.203594 USDC`; live spend not executed because dry-run stops after estimate. | Deposit + confirmed-balance + spend-estimate proof captured; remains below CURRENT_VERIFIED until live spend proof |
| Circle Wallets (Developer-Controlled / Programmable) | **CURRENT_VERIFIED (wallet creation only)** | Founder-run server-only flow verified: entity secret registration succeeded, readiness passed, and live wallet creation on `ARC-TESTNET` succeeded via `npm run circle:wallets:create:arc`; proof: `walletSetId=70d4bdf1-74a3-5098-8b37-5c573641e764`, `walletId=d99113e2-2e24-5d3f-ab6d-7b8c49367566`, `walletAddress=0x156c37d9a28b67588720116a13fba1ff7a5275f8`; `.env.circle.local`/`.circle-recovery` git-ignored; no secrets committed | Claim allowed only for wallet creation on ARC-TESTNET; signing/send/gasless/paymaster remain unverified |
| Paymaster / gas sponsorship | **NOT_CLAIMED** | Discovery in `docs/grant/agentpay/PAYMASTER_DISCOVERY.md` classifies paymaster as **FEASIBLE_BUT_NEEDS_CIRCLE_WALLETS_SIGNING_FLOW**; Arc Testnet support is documented, but no real sponsored/gasless transaction proof exists yet | Do not claim until Circle Wallets signing/send gasless flow is implemented and sponsorship proof is captured (likely SCA/ERC-4337-capable account path) |

## 4) Blocked state policy

For this repo snapshot, none of the above non-integrated Circle products are partially wired in a way that qualifies as runtime-**BLOCKED** integration attempts. They are treated as **NOT_CLAIMED** due to missing verifiable implementation paths.

## 5) Product-copy enforcement applied

- Homepage copy updated to:
  - **“Live on Arc Testnet”**
  - **“Mainnet-ready architecture, waiting for Arc mainnet availability.”**
- Product-facing roadmap/planned integration language removed from landing-page scope.
- Demo/readiness docs updated to strict classification wording: App Kit Send is CURRENT_VERIFIED; Bridge/CCTP is CURRENT_VERIFIED; Gateway/Unified Balance is CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED (below CURRENT_VERIFIED pending live spend proof); Circle Wallets is CURRENT_VERIFIED (wallet creation only); Paymaster remains NOT_CLAIMED.

## 6) Claim-safe statement set (allowed now)

1. USDC escrow on Arc Testnet
2. ERC-8183 tutorial ABI integration (subset)
3. Real Arc Testnet lifecycle completed
4. Optional ArcNS identity display/resolution support (non-blocking)

- Everything else remains **NOT_CLAIMED** until implemented and re-verified.

App Kit Send is currently classified as **CURRENT_VERIFIED** for this sprint.

Bridge / CCTP is now **CURRENT_VERIFIED** in this sprint with live bridge proof recorded.

Live verification evidence recorded:

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
- Approve tx: `0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd` (https://sepolia.etherscan.io/tx/0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd)
- Burn tx: `0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9` (https://sepolia.etherscan.io/tx/0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9)
- Attestation: state `success`, cctpVersion `2`, status `complete`, sourceDomain `0`, destinationDomain `26`
- Mint tx: `0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436` (https://testnet.arcscan.app/tx/0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436), Arc block `42834309`
- Private key was not printed.
- Script used isolated `.env.appkit.local` (git-ignored).

## 7) Unified Balance deposit-path implementation update (Master Prompt #9A)

- Deposit API surface inspected and documented in:
  - `docs/grant/agentpay/APP_KIT_GATEWAY_UNIFIED_BALANCE_DEPOSIT_DISCOVERY.md`
- Added local deposit script:
  - `scripts/appkit-unified-balance-deposit.ts`
- Added package command:
  - `npm run appkit:ub:deposit`
- Added env template keys in `.env.example`:
  - `APPKIT_UB_DEPOSIT_PRIVATE_KEY`
  - `APPKIT_UB_DEPOSIT_CHAIN`
  - `APPKIT_UB_DEPOSIT_AMOUNT`
  - `APPKIT_UB_DEPOSIT_TOKEN`
  - `APPKIT_UB_DEPOSIT_DRY_RUN`
- Gateway / Unified Balance status is now **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED**.
- Deposit pending evidence recorded:
  - Command: `npm run appkit:ub:deposit`
  - Env mode: `APPKIT_UB_DEPOSIT_DRY_RUN=false`
  - API: `kit.unifiedBalance.deposit(params)`
  - Mode: `deposit self`
  - Chain: `Ethereum_Sepolia`
  - Token: `USDC`
  - Amount: `0.01`
  - Depositor: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
  - Deposited to: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
  - Tx hash: `0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a`
  - Explorer: https://sepolia.etherscan.io/tx/0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a
  - Private key was not printed.
- Post-deposit check evidence:
  - Command: `npm run appkit:ub:check`
  - token: `USDC`
  - include pending: `true`
  - `totalConfirmedBalance: 0.010000`
  - `totalPendingBalance: 0.000000`
  - `Ethereum_Sepolia confirmedBalance: 0.010000`
  - `Ethereum_Sepolia pendingBalance: 0.000000`
  - `Arc_Testnet confirmedBalance: 0.000000`
- Gateway / Unified Balance remains below **CURRENT_VERIFIED** until: live spend proof is captured.

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

- Circle Wallets discovery/update (Master Prompt #10)

- Discovery artifact added: `docs/grant/agentpay/CIRCLE_WALLETS_DISCOVERY.md`
- Classification from discovery: **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY**
- Additional gating condition: **FEASIBLE_BUT_NEEDS_BACKEND** (server-only secret handling)
- Current claim status is now: **CURRENT_VERIFIED (wallet creation only)**
- Remaining unverified scope:
  1. Circle Wallet signing proof is not captured
  2. Circle Wallet token transfer/send proof is not captured
  3. Circle Wallet gasless transaction proof is not captured
  4. Paymaster/gas sponsorship proof is not captured; paymaster remains **NOT_CLAIMED** despite feasibility until real sponsored/gasless tx proof exists

Paymaster discovery status update (Master Prompt #11B):

- Discovery artifact: `docs/grant/agentpay/PAYMASTER_DISCOVERY.md`
- Feasibility classification: **FEASIBLE_BUT_NEEDS_CIRCLE_WALLETS_SIGNING_FLOW**
- Arc Testnet support: documented
- Current claim status: **NOT_CLAIMED**
- Reason: Circle Wallets signing/send transaction flow and real gas sponsorship proof are not yet verified in-repo; gasless path likely requires SCA/ERC-4337-capable account flow evidence.

## 9) Circle Wallets server-only readiness scaffold update (Master Prompt #10B)

- Added server-only setup guide:
  - `docs/grant/agentpay/CIRCLE_WALLETS_SERVER_SETUP.md`
- Added local readiness script:
  - `scripts/circle-wallets-readiness.ts`
- Added package command:
  - `npm run circle:wallets:readiness`
- Added setup scripts:
  - `npm run circle:wallets:generate-entity-secret`
  - `npm run circle:wallets:register-entity-secret`
  - `npm run circle:wallets:create:arc`
- Added `.env.example` placeholders for Circle Wallets (server-only, no `NEXT_PUBLIC_*`):
  - `CIRCLE_API_KEY`
  - `CIRCLE_ENTITY_SECRET`
  - `CIRCLE_WALLET_SET_ID`
  - `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`
  - `CIRCLE_WALLETS_DRY_RUN=true`
  - `CIRCLE_WALLET_SET_NAME=AgentPay Arc Testnet Wallet Set`
  - `CIRCLE_WALLET_ACCOUNT_TYPE=EOA`
- Added explicit `.gitignore` protection for `.env.circle.local` patterns.

Dependency decision:

- Official Circle SDK dependency is in use: `@circle-fin/developer-controlled-wallets`.
- Founder-run verification now includes live wallet creation proof on ARC-TESTNET; signing and transaction sending remain unverified.

Status policy after founder-run verification:

- Circle Wallets product claim: **CURRENT_VERIFIED (wallet creation only)**.
- Classification remains tracked as **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY_AND_ENTITY_SECRET** for secure operational continuation.
- Internal readiness implementation state is upgraded from `CURRENT_CODE_IMPLEMENTED_PENDING_WALLET_PROOF` to **CURRENT_VERIFIED** for wallet creation.

Circle Wallets verification evidence captured:

- Command: `npm run circle:wallets:register-entity-secret`
- Result: entity secret registered successfully
- Recovery directory: `./.circle-recovery`
- Command: `npm run circle:wallets:readiness`
- Result: readiness checks passed with redacted secret output and no wallet mutation calls
- Command: `npm run circle:wallets:create:arc`
- Result: wallet creation succeeded
- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `walletAddress: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- `.env.circle.local` remains git-ignored
- `.circle-recovery` remains git-ignored
- No secrets committed

Post-proof safety reminder:

- Set/restore `CIRCLE_WALLETS_DRY_RUN=true` to prevent accidental duplicate wallet creation.
