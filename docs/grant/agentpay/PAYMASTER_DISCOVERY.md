# PAYMASTER_DISCOVERY

## Scope
This document evaluates Circle/Arc Paymaster (gasless) feasibility for AgentPay using official docs and existing local integration status.

## Official docs reviewed
- Circle Wallets — Gas Station quickstart: https://developers.circle.com/wallets/gas-station/send-a-gasless-transaction
- Circle Wallets — Supported blockchains: https://developers.circle.com/wallets/supported-blockchains
- Arc docs — Account abstraction: https://docs.arc.io/arc/tools/account-abstraction

## Product/feature evaluated
- **Circle Gas Station (managed Paymaster) for gasless transactions** in Circle Wallets.
- Related Arc context: Arc supports ERC-4337 account abstraction ecosystem and paymaster-compatible tooling.

## Findings

### 1) Relevant Circle/Arc Paymaster or gasless product
- Relevant product is **Circle Wallets Gas Station** (Circle-managed paymaster sponsorship).

### 2) Arc Testnet support
- **Yes (documented)**.
- Circle gasless quickstart content explicitly lists Arc for EVM gasless SCA support.
- Circle supported blockchains includes **ARC-TESTNET**.

### 3) Requires Circle Wallets?
- **Yes** for Circle Gas Station path.
- Gasless flow is described as a Programmable Wallet transaction flow using supported wallet types.

### 4) Requires signing/send transaction flow?
- **Yes**.
- Verification necessarily requires creating/funding wallet and sending a transaction to observe sponsorship.

### 5) Requires Circle Console policy/config?
- **Testnet:** docs state preconfigured policy is in place for quickstart (no manual policy creation required for testnet quickstart).
- **Mainnet:** policy configuration is required.

### 6) Requires smart accounts / ERC-4337?
- For **EVM gasless with Circle Gas Station**, docs indicate **SCA requirement** (smart contract account).
- Arc AA docs confirm ERC-4337/paymaster ecosystem support at chain/tooling level.

### 7) Can AgentPay verify it now?
- **Not fully with current claimed scope.**
- Current status says Circle Wallets is verified for wallet creation only; no verified Circle Wallets signing/send gasless path is claimed yet.
- Therefore paymaster cannot be conservatively claimed as verified now.

## Required prerequisites
1. Circle Wallets signing/send transaction flow implemented and verified (not just wallet creation).
2. SCA-capable wallet/account path on ARC-TESTNET for EVM gasless flow.
3. Wallet funding for transfer asset (per quickstart).
4. Execute a gasless outbound transaction and confirm sponsorship evidence (response fields and/or console policy transaction visibility).

## Feasibility classification
- **FEASIBLE_BUT_NEEDS_CIRCLE_WALLETS_SIGNING_FLOW**

## Minimal verification path (if pursued)
1. Create Circle wallet on `ARC-TESTNET` with account type suitable for gasless EVM flow (SCA path).
2. Fund test wallet with transferable asset.
3. Send outbound transfer through Circle Wallets transaction API path.
4. Confirm gas sponsorship behavior and capture proof in local grant docs.
5. Only after successful proof, upgrade claim from NOT_CLAIMED.

## Current claim recommendation
- **Paymaster claim status: NOT_CLAIMED**
- Rationale: product appears technically supported on Arc Testnet, but AgentPay lacks completed/verified Circle Wallets signing + send verification for gasless sponsorship proof.
