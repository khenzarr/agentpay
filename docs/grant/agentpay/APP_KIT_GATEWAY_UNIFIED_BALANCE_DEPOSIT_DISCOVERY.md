# App Kit Gateway / Unified Balance Deposit Discovery — AgentPay (Master Prompt #9A)

**Date:** 2026-05-18  
**Scope:** Deposit-path API validation and safe local-script implementation readiness.

## Official references used

- https://docs.arc.io/app-kit/unified-balance
- https://docs.arc.io/app-kit/quickstarts/unified-balance-deposit-and-spend
- https://docs.arc.io/app-kit/quickstarts/unified-balance-delegate-deposit-and-spend
- https://docs.arc.io/app-kit/tutorials/unified-balance/check-unified-balance
- https://docs.arc.io/app-kit/tutorials/unified-balance/select-source-blockchains
- https://docs.arc.io/app-kit/tutorials/unified-balance/estimate-spend-fees
- https://docs.arc.io/app-kit/tutorials/unified-balance/remove-funds-trustlessly
- https://docs.arc.io/app-kit/references/sdk-reference
- https://docs.arc.io/app-kit/references/supported-blockchains

## SDK/type evidence inspected

- `@circle-fin/app-kit@1.5.1`
- `node_modules/@circle-fin/app-kit/index.d.ts`
- `node_modules/@circle-fin/app-kit/README.md`

## 1) Exact `deposit` API shape

```ts
deposit(params: DepositParams): Promise<DepositResult>
```

`DepositParams` includes:

- `from: { adapter, chain }`
- `amount: string`
- `token?: SupportedTokenInput` (USDC path)
- `allowanceStrategy?: 'approve' | 'permit' | 'authorize'`

`DepositResult` includes:

- `amount`
- `token`
- `depositedTo`
- `depositedBy`
- `chain`
- `txHash`
- `explorerUrl?`

## 2) Required params

For `deposit` minimum runtime params are:

- `from.adapter`
- `from.chain`
- `amount`
- token defaults to USDC but we pass `USDC` explicitly

## 3) Whether `depositFor` is needed instead of `deposit`

Not required for self-deposit. Use `depositFor` only when crediting a different Gateway account.

```ts
depositFor(params: DepositForParams): Promise<DepositResult>
```

`DepositForParams` extends deposit params with required:

- `depositAccount: string`

and does not expose allowanceStrategy (approval-based path).

## 4) Whether estimate for deposit exists

No `estimateDeposit` method was found in the SDK type surface. Spend has `estimateSpend`; deposit does not.

## 5) Whether deposit supports dry-run

No native deposit dry-run/estimate API found. Dry-run must be app-level guard logic that prints intended params and exits before execution.

## 6) Whether source chain USDC + native gas are required

Yes. Live deposit requires:

- sufficient source-chain USDC for deposit amount
- sufficient source-chain native gas for approval/deposit tx path

## 7) Whether deposit produces tx/operation output

Yes. `DepositResult` includes `txHash` and optional `explorerUrl`, plus metadata (`depositedTo`, `depositedBy`, `chain`, `amount`, `token`).

## 8) Whether Arc_Testnet can be selected as destination/spend chain after deposit

Yes for spend destination path. Arc_Testnet is present in Unified Balance chain support and already validated in check discovery/runtime output.

## Classification

**FEASIBLE_BUT_DEPOSIT_IS_LIVE_ONLY**

Rationale:

- API shape is clear and scriptable now.
- No native deposit estimate/dry-run method exists.
- Safe default is script-level dry-run guard with live execution only when explicitly toggled.

## Current claim boundary

- Deposit script can be implemented and dry-run validated.
- Without real live deposit proof + post-deposit balance proof, Gateway status must remain below CURRENT_VERIFIED.
- Current status is now: **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED**.

## Deposit pending verification evidence (Master Prompt #9B)

- Command: `npm run appkit:ub:deposit`
- Env mode: `APPKIT_UB_DEPOSIT_DRY_RUN=false`
- Deposit API used: `kit.unifiedBalance.deposit(params)`
- Deposit mode: `deposit self`
- Deposit chain: `Ethereum_Sepolia`
- Token: `USDC`
- Amount: `0.01`
- Depositor: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Deposited to: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Tx hash: `0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a`
- Explorer: https://sepolia.etherscan.io/tx/0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a
- Private key was not printed.

Post-deposit check evidence (`npm run appkit:ub:check`):

- token: `USDC`
- include pending: `true`
- `totalConfirmedBalance: 0.010000`
- `totalPendingBalance: 0.000000`
- `Ethereum_Sepolia confirmedBalance: 0.010000`
- `Ethereum_Sepolia pendingBalance: 0.000000`
- `Arc_Testnet confirmedBalance: 0.000000`

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

Gateway / Unified Balance remains below **CURRENT_VERIFIED** until all are captured:

1. Live spend proof is captured.

Important cost note:

- Live spend was intentionally not executed because the fee estimate is high relative to the `0.01 USDC` test amount.
