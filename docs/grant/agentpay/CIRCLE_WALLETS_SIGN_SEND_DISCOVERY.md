# Circle Wallets Signing/Send/Gasless Discovery — AgentPay (ARC-TESTNET)

## Scope and safety

- Scope: feasibility-only discovery for the already-created Circle Developer-Controlled wallet on `ARC-TESTNET`.
- This document does **not** prove runtime signing/send/gasless execution.
- No live mutation proof is added in this sprint.
- Secrets are intentionally excluded.

Known verified Circle Wallets proof (non-mutating + creation):

- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `walletAddress: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`

Additional non-mutating metadata-read proof:

- Command: `npm run circle:wallets:get-wallet`
- Result: wallet metadata fetched
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `address: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `accountType: EOA`
- `custodyType: DEVELOPER`
- `state: LIVE`

## Sources reviewed

Local files (narrow scope):

- `package.json`
- `scripts/circle-wallets-create-arc-wallet.ts`
- `scripts/circle-wallets-readiness.ts`
- `docs/grant/agentpay/CIRCLE_WALLETS_SERVER_SETUP.md`
- `docs/grant/agentpay/PAYMASTER_DISCOVERY.md`
- Installed SDK types:
  - `node_modules/@circle-fin/developer-controlled-wallets/dist/types/clients/core.d.ts`
  - `node_modules/@circle-fin/developer-controlled-wallets/dist/types/clients/developer-controlled-wallets.d.ts`

Official Circle docs (targeted):

- Wallets supported blockchains page (includes `ARC-TESTNET`)
- Developer-Controlled Wallets transaction/signing/gasless related references (as surfaced in SDK API/type docs)

---

## 1) Can the existing ARC-TESTNET wallet sign messages?

**Feasibility:** Yes in principle, but **not verified here**.

Evidence:

- SDK exposes `signMessage(...)` for developer-controlled wallets.
- Existing repo proof covers wallet creation + metadata read only; no signing proof artifact exists.

- Verified non-mutating metadata read proof recorded:
  - Command: `npm run circle:wallets:get-wallet`
  - Result: wallet metadata fetched
  - `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
  - `address: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
  - `blockchain: ARC-TESTNET`
  - `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
  - `accountType: EOA`
  - `custodyType: DEVELOPER`
  - `state: LIVE`

- Readiness non-mutation proof recorded:
  - Command: `npm run circle:wallets:readiness`
  - Result: readiness checks passed
  - `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`
  - `CIRCLE_WALLETS_DRY_RUN=true`
  - secrets redacted
  - no live mutation performed by readiness

Conservative decision: keep signing as **NOT_CLAIMED** until explicit proof is captured.

## 2) Can it create/send transfer transactions?

**Feasibility:** Yes in API surface, but **not verified here**.

Evidence:

- SDK exposes `createDeveloperTransactionTransfer(...)`.
- Existing docs already gate Circle Wallets to wallet-creation-only verification.

Operational caveat:

- Actual send requires sufficient wallet funding (asset + gas path as applicable).

## 3) Can it estimate transfer/contract execution fees?

**Feasibility:** Yes, and this is the safest next technical check.

Evidence:

- SDK exposes `createTransferEstimateFee(...)`.
- SDK exposes `createTransactionEstimateFee(...)` (contract execution estimate).

This is non-mutating and should be the first verification step before any future send attempts.

Token ID requirement boundary (updated with verified proof):

- `CIRCLE_WALLET_TRANSFER_TOKEN_ID` is required for transfer estimate.
- Token ID must **not** be guessed.
- Added server-only helper: `npm run circle:wallets:token-lookup` (`scripts/circle-wallets-token-lookup.ts`) to inspect non-mutating SDK read paths (`getToken` by optional id, `listMonitoredTokens`, optional wallet balance token listing).
- Added server-only helper: `npm run circle:wallets:list-balances` (`scripts/circle-wallets-list-balances.ts`) for explicit wallet token-balance/token-id listing via non-mutating SDK read path.
- Verified result for `lookupBlockchain=ARC-TESTNET` and `lookupSymbol=USDC`: `candidateCount=1`.
- Verified token ID: `15dc2b5d-0994-58b0-bf8c-3a0501148ee8` (source: `getWalletTokenBalance`).
- Installed Wallets SDK type surface does **not** expose a reverse resolver like `getTokenId(blockchain+symbol/address)`.
- `getToken({ id })` is id->details only (requires pre-known token id).
- `listMonitoredTokens(...)` is a monitored-token view, not a guaranteed global supported-token inventory for Wallets token IDs.
- Transfer estimate verification proof captured with:
  - `CIRCLE_WALLET_TRANSFER_TOKEN_ID=15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
  - `CIRCLE_WALLET_TRANSFER_DRY_RUN=true`
  - Command: `npm run circle:wallets:estimate-transfer`
  - Result: transfer estimate succeeded (low/medium/high fee tiers recorded).
- No live transfer/send was executed.

## 4) Is the existing wallet EOA or SCA?

**Verified EOA** via direct non-mutating wallet metadata read.

Evidence:

- `npm run circle:wallets:get-wallet` returned `accountType: EOA`.
- Same read confirmed `custodyType: DEVELOPER` and `state: LIVE` on `ARC-TESTNET`.

## 5) Is SCA/ERC-4337 required for gasless/Paymaster?

**For Circle Gas Station/paymaster-style gasless flow: effectively yes (SCA path required).**

Evidence:

- Existing `PAYMASTER_DISCOVERY.md` already records SCA/ERC-4337 requirement expectations for Circle gasless flow.
- SDK error/type surface includes SCA-specific constraints and paymaster policy-related behavior.

## 6) Is Circle Wallets signing/send separate from Paymaster?

**Yes.**

- Signing/send are base wallet transaction capabilities.
- Paymaster/gasless sponsorship is an additional policy/account-mode layer on top (not equivalent to ordinary signing/send).

Therefore, signing/send can be feasible while paymaster remains not claimable.

## 7) What env vars would be needed?

Minimum server-side set (no UI/public vars):

- `CIRCLE_API_KEY`
- `CIRCLE_ENTITY_SECRET`
- `CIRCLE_ENTITY_PUBLIC_KEY`
- `CIRCLE_ENTITY_SECRET_CIPHER_TEXT`
- `CIRCLE_WALLET_SET_ID`
- `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`
- `CIRCLE_WALLETS_DRY_RUN=true` (for safety-first script gating)

Optional for targeted scripts:

- `CIRCLE_WALLET_ID` and/or `CIRCLE_WALLET_ADDRESS`
- `CIRCLE_DESTINATION_ADDRESS`
- `CIRCLE_TOKEN_ID` or token address inputs

## 8) What funds would be needed?

For future live verification (not in this sprint):

- Small test amount of transferable token (e.g., USDC test amount if transfering USDC).
- Native gas token liquidity as required by the selected transaction path/account type.
- For gasless path specifically: sponsorship policy readiness (not a substitute for transfer asset itself).

## 9) What is the minimal safe verification path?

Recommended **server-only**, staged, conservative path:

1. **Read wallet details** (non-mutating) to confirm account type (`EOA` vs `SCA`).
2. **Estimate transfer fee** using Circle estimate API (non-mutating).
3. Optionally **estimate contract execution fee** (non-mutating) for escrow-related future tx shape.
4. Only if explicitly approved later: isolated signing proof and then tiny live transfer proof.
5. For gasless/paymaster: create/verify proper SCA path + gas station/paymaster policy, then separate proof run.

## 10) What is the correct claim status now?

- Circle Wallets overall: **CURRENT_VERIFIED (wallet creation + metadata read only)**.
- Circle Wallets signing: **CURRENT_VERIFIED** (message signing only).
- Circle Wallets send/transfer: **NOT_CLAIMED**.
- Circle Wallets gasless: **NOT_CLAIMED**.
- Paymaster: **NOT_CLAIMED**.
- Circle Wallets transfer estimate path is now **CURRENT_CODE_IMPLEMENTED_TRANSFER_ESTIMATE_VERIFIED**.
- Message signing is now verified from server-only benign-message proof; send/transfer remains **NOT_CLAIMED** until explicit runtime transfer proof artifacts are captured and verified.

Message-signing proof artifact (server-only, non-fund-moving):

- Command: `npm run circle:wallets:sign-message`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `message: AgentPay Circle Wallets signing proof on ARC-TESTNET`
- `signature: 0x78d2d1364b64fb0be9b053b78abe519890dfb82e0ab3d52125675ada7e4913533f54e056b33121a95a886a4446bfb2db3a864a2a328314bf3e66f00b651f5aee1c`
- `status: 200`
- No funds moved; no transfer created.

Conservative claim classification for this discovery:

- Signing/send today: **FEASIBLE_BUT_NEEDS_TRANSFER_ESTIMATE_FIRST**
- If attempting live transfer afterward: **FEASIBLE_BUT_NEEDS_WALLET_FUNDING**
- Gasless/paymaster path: **FEASIBLE_BUT_NEEDS_SCA_WALLET** + **FEASIBLE_BUT_NEEDS_GAS_STATION_POLICY**
- Current overall status decision for this sprint: **DO_NOT_CLAIM** (for signing/send/gasless verification)

---

## Minimal next mini-sprint recommendation (no implementation in this sprint)

Future server-only scripts (suggested only):

- `scripts/circle-wallets-get-wallet.ts` (read wallet/accountType proof)
- `scripts/circle-wallets-estimate-transfer.ts` (non-mutating fee estimate proof)
- `scripts/circle-wallets-sign-message.ts` (controlled signing proof)
- `scripts/circle-wallets-send-test-transfer.ts` (tiny live transfer proof, approval-gated)

Execution order recommendation:

1. `get-wallet`
2. `estimate-transfer`
3. `sign-message` (if needed)
4. `send-test-transfer`
5. Separate gasless/paymaster sprint after SCA + policy prerequisites are proven
