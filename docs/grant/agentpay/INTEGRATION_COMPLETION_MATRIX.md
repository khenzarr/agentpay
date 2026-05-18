# Integration Completion Matrix — AgentPay (Master Prompt #8)

**Date:** 2026-05-18  
**Scope:** Strictly verified in-repo integration status for product/demo claims.

## Status Legend

- **VERIFIED**: Implemented and demonstrably present in this repo/runtime flow.
- **NOT_CLAIMED**: Not implemented/verified; must not be claimed in product/demo scope.
- **BLOCKED**: Technically blocked from operation due to missing required dependency/config/runtime proof.

## Current Matrix

| Integration Area | Status | Evidence in repo | Claim policy |
|---|---|---|---|
| Arc Testnet execution (chain 5042002) | **VERIFIED** | `src/app/page.tsx`, wallet/network guards and runtime demo flow docs | Claim allowed |
| USDC escrow lifecycle on Arc Testnet | **VERIFIED** | Create/fund/submit/complete flow in UI + docs dry-run notes | Claim allowed |
| ERC-8183 tutorial ABI contract integration | **VERIFIED** | `src/lib/erc8183`, integration banner, lifecycle actions | Claim allowed as tutorial-subset only |
| Real Arc Testnet lifecycle completion | **VERIFIED** | `docs/grant/agentpay/IMPLEMENTATION_STATUS.md` dry-run section (Job #21683) | Claim allowed |
| ArcNS identity display/resolution | **VERIFIED (OPTIONAL/NON-BLOCKING)** | `AddressIdentity.tsx`, `ArcnsResolutionBadge.tsx`, resolver hooks/config | Claim allowed only as optional/non-blocking |
| App Kit Send | **CURRENT_VERIFIED** | Live send verified via `npm run appkit:send:arc:usdc` with `APPKIT_DRY_RUN=false` on Arc Testnet (`Arc_Testnet`), token `USDC`, amount `0.01`; tx `0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb`; isolated `.env.appkit.local`; private key not printed | Claim allowed |
| Bridge / CCTP | **CURRENT_VERIFIED** | Live verification executed via `npm run appkit:bridge:usdc:arc` with `APPKIT_BRIDGE_DRY_RUN=false` using `CCTPV2BridgingProvider`; route `Ethereum_Sepolia -> Arc_Testnet`; token `USDC`; amount `0.01`; result state `success`; transfer speed `FAST`; approve/burn/mint tx proofs recorded; isolated `.env.appkit.local`; private key not printed | Claim allowed |
| Gateway / Unified Balance | **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED** | Live deposit executed via `npm run appkit:ub:deposit` with `APPKIT_UB_DEPOSIT_DRY_RUN=false` using `kit.unifiedBalance.deposit(params)` in deposit-self mode on `Ethereum_Sepolia` for `USDC` amount `0.01`; depositor/deposited-to `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`; tx `0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a` (https://sepolia.etherscan.io/tx/0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a); post-deposit check via `npm run appkit:ub:check` (`token=USDC`, `includePending=true`) returned `totalConfirmedBalance: 0.010000 USDC`, `totalPendingBalance: 0.000000 USDC`, `Ethereum_Sepolia confirmedBalance: 0.010000`, `Ethereum_Sepolia pendingBalance: 0.000000`; private key not printed. Spend estimate executed via `npm run appkit:ub:spend:arc` in dry-run mode (`APPKIT_UB_DRY_RUN=true`) with `from=Ethereum_Sepolia`, `to=Arc_Testnet`, recipient `0xCdc3735BCC1DE14c48704859715F835d0A5a7168`, amount `0.01`, token `USDC`, `useForwarder=true`; estimate output: `gasFee: 1.203595 USDC`, gas allocation `Ethereum_Sepolia, 1.203595 USDC`, forwarder fee `0.203594 USDC`; live spend not executed because dry-run stops after estimate. | Do not claim CURRENT_VERIFIED until live spend proof is captured |
| Circle Wallets (Developer-Controlled) | **CURRENT_VERIFIED (wallet creation + metadata read only)** | Founder-run server-only proof captured: entity secret registration succeeded, readiness passed (`CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`, `CIRCLE_WALLETS_DRY_RUN=true`, secrets redacted, no live mutation by readiness), `npm run circle:wallets:create:arc` created an ARC-TESTNET wallet, and non-mutating `npm run circle:wallets:get-wallet` metadata read succeeded; `walletSetId=70d4bdf1-74a3-5098-8b37-5c573641e764`, `walletId=d99113e2-2e24-5d3f-ab6d-7b8c49367566`, `walletAddress/address=0x156c37d9a28b67588720116a13fba1ff7a5275f8`, `accountType=EOA`, `custodyType=DEVELOPER`, `state=LIVE`; `.env.circle.local` + `.circle-recovery` git-ignored; no secrets committed | Claim allowed only for wallet creation and metadata read on ARC-TESTNET; signing/send/gasless/paymaster remain unverified |
| Paymaster / gas sponsorship | **NOT_CLAIMED** | Discovery in `docs/grant/agentpay/PAYMASTER_DISCOVERY.md` classifies paymaster as **FEASIBLE_BUT_NEEDS_CIRCLE_WALLETS_SIGNING_FLOW**; Arc Testnet support is documented; no real sponsored/gasless transaction proof captured yet | Do not claim until Circle Wallets signing/send gasless flow is verified with sponsorship proof (likely SCA/ERC-4337-capable account path) |
| Full ERC-8183 compliance | **NOT_CLAIMED** | Tutorial-subset integration only | Do not claim |
| Full ERC-8004 compliance | **NOT_CLAIMED** | No full ERC-8004 implementation/compliance proof in MVP | Do not claim |

## Product-safe claim boundary

Only the following are currently claimable:

1. USDC escrow on Arc Testnet
2. ERC-8183 tutorial ABI integration (subset)
3. Real Arc Testnet lifecycle completed
4. Optional ArcNS identity display/resolution support (non-blocking)
5. App Kit Send on Arc Testnet
6. App Kit Bridge/CCTP on Arc Testnet
- 7. Circle Developer-Controlled Wallet creation and metadata read on ARC-TESTNET

Everything else above remains **NOT_CLAIMED** until implemented and re-verified.

Circle Wallets discovery/readiness classification note:

- **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY_AND_ENTITY_SECRET**
- Additional gate remains server-only backend handling for secrets and approval-controlled runtime verification.
- Internal readiness scaffold status: **CURRENT_VERIFIED** (wallet creation + metadata read only)
- Current public/demo status: **CURRENT_VERIFIED (wallet creation + metadata read only)** with strict boundary; signing/send/gasless/paymaster remain unverified.
- Token-ID resolution discovery (Master Prompt #16): `docs/grant/agentpay/CIRCLE_WALLETS_TOKEN_ID_RESOLUTION.md`
- Current token-ID blocker classification: **BLOCKED_NEEDS_WALLET_FUNDING_TO_REVEAL_TOKEN_ID**
- Added non-mutating helper: `npm run circle:wallets:list-balances` to surface wallet token IDs if/when token balance exists.

Paymaster discovery classification note:

- Discovery report: `docs/grant/agentpay/PAYMASTER_DISCOVERY.md`
- Classification: **FEASIBLE_BUT_NEEDS_CIRCLE_WALLETS_SIGNING_FLOW**
- Arc Testnet support: documented
- Current claim status: **NOT_CLAIMED**
- Claim gate: do not claim paymaster until a real sponsored/gasless transaction proof exists from a verified Circle Wallets signing/send flow.

Circle Wallets server-only scaffold artifacts (Master Prompt #10B):

- `docs/grant/agentpay/CIRCLE_WALLETS_SERVER_SETUP.md`
- `scripts/circle-wallets-readiness.ts`
- `npm run circle:wallets:readiness`
- `npm run circle:wallets:generate-entity-secret`
- `npm run circle:wallets:register-entity-secret`
- `npm run circle:wallets:create:arc`
- `.env.example` Circle server-only placeholders
- `.gitignore` explicit `.env.circle.local` coverage

Founder-run live Circle wallet creation proof was executed in this sprint; sign/send proof remains unverified.

Circle Wallets verification evidence:

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

Gateway / Unified Balance implementation status for this sprint: **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED**.

Deposit-path implementation update (Master Prompt #9A):

- Added discovery: `docs/grant/agentpay/APP_KIT_GATEWAY_UNIFIED_BALANCE_DEPOSIT_DISCOVERY.md`
- Added script: `scripts/appkit-unified-balance-deposit.ts`
- Added command: `npm run appkit:ub:deposit`
- Added `.env.example` deposit vars (`APPKIT_UB_DEPOSIT_*`, optional `APPKIT_UB_DEPOSIT_ACCOUNT`)
- Deposit confirmed-balance proof and spend estimate proof captured in this sprint; status is now **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED**.

Deposit pending evidence recorded:

- Command: `npm run appkit:ub:deposit`
- Env mode: `APPKIT_UB_DEPOSIT_DRY_RUN=false`
- Deposit API: `kit.unifiedBalance.deposit(params)`
- Mode: `deposit self`
- Chain: `Ethereum_Sepolia`
- Token: `USDC`
- Amount: `0.01`
- Depositor: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Deposited to: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Tx hash: `0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a`
- Explorer: https://sepolia.etherscan.io/tx/0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a
- Private key was not printed.

Post-deposit check evidence:

- Command: `npm run appkit:ub:check`
- Token: `USDC`
- `includePending`: `true`
- `totalConfirmedBalance: 0.010000`
- `totalPendingBalance: 0.000000`
- `Ethereum_Sepolia confirmedBalance: 0.010000`
- `Ethereum_Sepolia pendingBalance: 0.000000`
- `Arc_Testnet confirmedBalance: 0.000000`

Gateway / Unified Balance remains below **CURRENT_VERIFIED** until all are captured:

1. Live spend proof is captured.

Spend estimate verification status:

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

Bridge/CCTP implementation status for this sprint: **CURRENT_VERIFIED**.

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
13. approve tx: `0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd`
14. burn tx: `0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9`
15. fetchAttestation: state `success`, cctpVersion `2`, status `complete`, sourceDomain `0`, destinationDomain `26`
16. mint tx: `0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436` (Arc block `42834309`)
17. Private key was not printed.
18. Script used isolated `.env.appkit.local` (git-ignored).
