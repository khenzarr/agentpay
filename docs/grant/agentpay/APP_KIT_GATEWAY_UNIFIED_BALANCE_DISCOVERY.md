# App Kit Gateway / Unified Balance Discovery — AgentPay (Master Prompt #9)

**Date:** 2026-05-18  
**Scope:** Discovery-first feasibility analysis for App Kit Gateway / Unified Balance integration using official Arc docs and installed SDK surface.

## 1) Official docs used

- https://docs.arc.io/app-kit/unified-balance
- https://docs.arc.io/app-kit/quickstarts/unified-balance-deposit-and-spend
- https://docs.arc.io/app-kit/quickstarts/unified-balance-delegate-deposit-and-spend
- https://docs.arc.io/app-kit/concepts/unified-balance-fees
- https://docs.arc.io/app-kit/tutorials/unified-balance/check-unified-balance
- https://docs.arc.io/app-kit/tutorials/unified-balance/select-source-blockchains
- https://docs.arc.io/app-kit/tutorials/unified-balance/estimate-spend-fees
- https://docs.arc.io/app-kit/tutorials/unified-balance/collect-custom-spend-fees
- https://docs.arc.io/app-kit/tutorials/unified-balance/manage-delegates
- https://docs.arc.io/app-kit/tutorials/unified-balance/use-forwarding-service
- https://docs.arc.io/app-kit/tutorials/unified-balance/remove-funds-trustlessly
- https://docs.arc.io/app-kit/references/supported-blockchains
- https://docs.arc.io/app-kit/references/sdk-reference
- https://docs.arc.io/app-kit/tutorials/installation

## 2) Exact Gateway / Unified Balance API shape found (installed SDK)

Installed package: `@circle-fin/app-kit@^1.5.1`.

From `node_modules/@circle-fin/app-kit/index.d.ts`:

- `new AppKit().unifiedBalance`
- `kit.unifiedBalance.getSupportedChains(token?)`
- `kit.unifiedBalance.getBalances(params)`
- `kit.unifiedBalance.deposit(params)`
- `kit.unifiedBalance.depositFor(params)`
- `kit.unifiedBalance.spend(params)`
- `kit.unifiedBalance.estimateSpend(params)`
- delegate methods:
  - `kit.unifiedBalance.addDelegate(params)`
  - `kit.unifiedBalance.removeDelegate(params)`
  - `kit.unifiedBalance.getDelegateStatus(params)`

Type surface confirmed:

- `UnifiedBalanceChain` enum includes `Arc_Testnet`.
- `SpendParams` with `from`, `to`, `amount`, optional `token` (USDC-supported).
- `DepositParams` with `from`, `amount`, optional `token` and allowance strategy.
- `GetBalancesParams` with `token`, `sources`, and optional `includePending`.
- `EstimateSpendResult` includes `fees`.

## 3) Required imports (local script path)

- `import { AppKit } from "@circle-fin/app-kit";`
- `import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";`
- Optional typed params for spend:
  - `import type { SpendParams } from "@circle-fin/app-kit";`

## 4) Required package(s)

- `@circle-fin/app-kit`
- `@circle-fin/adapter-viem-v2`
- `tsx` (already present for script execution)

## 5) Supported source chains (discovery result)

`UnifiedBalanceChain` in installed types includes:

- Mainnet: Arbitrum, Avalanche, Base, Ethereum, HyperEVM, Optimism, Polygon, Sei, Solana, Sonic, Unichain, World_Chain
- Testnet: Arbitrum_Sepolia, **Arc_Testnet**, Avalanche_Fuji, Base_Sepolia, Ethereum_Sepolia, HyperEVM_Testnet, Optimism_Sepolia, Polygon_Amoy_Testnet, Sei_Testnet, Solana_Devnet, Sonic_Testnet, Unichain_Sepolia, World_Chain_Sepolia

## 6) Supported spend/destination chains

Gateway spend destination uses Unified Balance-supported chains; installed type/docs path includes `Arc_Testnet`.

## 7) Supported token(s)

- Gateway / Unified Balance path in current SDK surface is USDC-centric.
- Spend/deposit docs and types indicate **USDC** support for this flow.

## 8) Whether Arc_Testnet is supported

**Yes.** Confirmed in installed `UnifiedBalanceChain` enum and runtime discovery of:

- `kit.unifiedBalance.getSupportedChains("USDC")` including **Arc Testnet** (`isTestnet: true`).

## 9) Whether USDC unified balance deposit/spend to Arc_Testnet is supported

**Supported by SDK/API surface.**

Operational success still depends on:

- source account having required balances
- chain route/token support at runtime
- valid adapter/account context

## 10) Whether estimate API exists

**Yes.** `kit.unifiedBalance.estimateSpend(params)` exists in installed types.

## 11) Whether private-key adapter can be reused

**Yes**, for local script usage:

- `createViemAdapterFromPrivateKey` can be reused as in existing Send/Bridge scripts.

## 12) Whether additional Circle credentials/API keys are required

No mandatory Circle Console API key requirement was found for basic local App Kit Unified Balance method usage in installed SDK surface.

## 13) Whether delegate setup is required

- **Not required** for owner-operated account flows.
- **Required** if spending/depositing on behalf of another account (`sourceAccount`, delegated control pattern).

## 14) Whether backend/custody infra is required

- **Not required** for local owner-operated scripts with private-key adapter.
- Backend/custody may be required for production custody/compliance workflows, but not required for this local discovery integration path.

## 15) Whether source-chain testnet funds are required

**Yes**, for real operation verification.

- Deposit/spend execution requires sufficient USDC + native gas on source chain(s).
- Pure code implementation and static validation do not require live funds.

## 16) Whether this can run as a local script safely

**Yes**, with guardrails:

- use isolated `.env.appkit.local`
- validate env vars before execution
- never print private key
- default to dry-run behavior
- estimate first for spend path

## 17) Whether live verification is possible now

**Potentially yes**, but only if founder-approved and required source balances/config are available.

For this sprint, live Unified Balance operation is **not executed**.

## Final classification

**FEASIBLE_IMPLEMENT_NOW** (for local script integration and estimate/check path)  
Live verification remains pending explicit founder approval and runtime funding preconditions.

## Deposit-path update (Master Prompt #9A)

- Dedicated deposit discovery completed: `docs/grant/agentpay/APP_KIT_GATEWAY_UNIFIED_BALANCE_DEPOSIT_DISCOVERY.md`
- Deposit script implemented: `scripts/appkit-unified-balance-deposit.ts`
- Package command added: `npm run appkit:ub:deposit`
- Safety model: script-level dry-run guard by default (`APPKIT_UB_DEPOSIT_DRY_RUN=true`), because no SDK `estimateDeposit` method is exposed.
- Current boundary remains unchanged until real proof exists:
  - no live deposit proof captured in this sprint
  - no non-zero unified balance proof captured in this sprint
  - no spend estimate/spend proof after deposit captured in this sprint

## Claim boundary status after live deposit confirmed-balance verification

- Gateway / Unified Balance status is now **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED**.
- Verified check evidence captured via `npm run appkit:ub:check` with `token=USDC` and `includePending=true`.
- Check output confirmed support visibility for:
  - Arc Testnet
  - Ethereum Sepolia
  - Base Sepolia
  - Arbitrum Sepolia
  - Polygon Amoy
  - Optimism Sepolia
  - Avalanche Fuji
  - Sonic Testnet
  - World Chain Sepolia
  - Sei Testnet
  - HyperEVM Testnet
  - Unichain Sepolia
- Balance response recorded:
  - `totalConfirmedBalance: 0.010000 USDC`
  - `totalPendingBalance: 0.000000 USDC`
  - `Ethereum_Sepolia confirmedBalance: 0.010000`
  - `Ethereum_Sepolia pendingBalance: 0.000000`
  - `Arc_Testnet confirmedBalance: 0.000000`
- Private key was not printed.
- Live deposit was executed; spend was not executed.

Spend estimate verification evidence captured:

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
- Live spend execution: **not executed** (dry-run stopped after estimate).

Deposit pending verification evidence captured:

- Command: `npm run appkit:ub:deposit`
- Env mode: `APPKIT_UB_DEPOSIT_DRY_RUN=false`
- Deposit API path: `kit.unifiedBalance.deposit(params)`
- Deposit mode: `deposit self`
- Deposit source chain: `Ethereum_Sepolia`
- Token: `USDC`
- Amount: `0.01`
- Depositor: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Deposited to: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Tx hash: `0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a`
- Explorer: https://sepolia.etherscan.io/tx/0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a
- Private key was not printed.

Gateway / Unified Balance remains below **CURRENT_VERIFIED** until all are captured:

1. Live spend proof is captured.

Important cost note:

- Live spend was intentionally not executed because the fee estimate is high relative to the `0.01 USDC` test amount.
