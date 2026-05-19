## Circle Paymaster / Gasless discovery checkpoint (Master Prompt #22)

- Date: 2026-05-19
- Scope: Official docs deep dive only (no mutations, no sponsored tx, no wallet creation)
- Sources:
  - `https://developers.circle.com/paymaster`
  - `https://developers.circle.com/paymaster/pay-gas-fees-usdc`
  - `https://developers.circle.com/paymaster/addresses-and-events`
- Arc Testnet paymaster addresses (doc-level):
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- Current claim boundary:
  - Circle Wallets gasless: `NOT_CLAIMED`
  - Paymaster: `NOT_CLAIMED`
- Runtime proof artifact: **none captured in this checkpoint**

## Circle Paymaster deployment read-only verification checkpoint (Master Prompt #42C)

- Date: 2026-05-20
- Scope: Arc Testnet read-only diagnostics only (`eth_chainId`, `eth_blockNumber`, `eth_getCode`)
- Script: `scripts/circle-paymaster-deployment-readonly-check.ts`
- Command: `npm run circle:paymaster:deployment-check`
- Diagnostics doc: `docs/grant/agentpay/CIRCLE_PAYMASTER_DEPLOYMENT_READONLY_CHECK.md`
- Triggering blocker reference: `AA30 paymaster not deployed` from v0.8 live proof artifact
- Mutation executed: none
- userOp submitted: none
- transaction sent: none

Claim boundary unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

# Proof Registry — AgentPay

## Circle Wallets (Developer-Controlled) — ARC-TESTNET

### Verified Circle Wallets live scope (CURRENT_VERIFIED boundary)

- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `walletAddress: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- `accountType: EOA`
- `custodyType: DEVELOPER`
- `state: LIVE`

### SCA wallet creation proof (developer-controlled, ARC-TESTNET)

Command: `npm run circle:wallets:create-sca:arc`

- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: 494ad75a-4d03-5021-9ddb-0c70cf566954`
- `walletAddress: 0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- `blockchain: ARC-TESTNET`
- `accountType: SCA`
- `state: LIVE`
- `responseStatus: success`

Boundary for this proof step:

- No sponsored transaction was executed.
- No Paymaster userOp was executed.
- No token transfer was executed in this SCA wallet creation step.
- No secrets were printed.

### Token ID resolution proof (non-mutating)

Command: `npm run circle:wallets:list-balances`

- `returnedTokenBalanceCount: 1`
- `filteredCount: 1`
- `filterBlockchain: ARC-TESTNET`
- `filterSymbol: USDC`
- `tokenId: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `symbol: USDC`
- `name: USDC`
- `blockchain: ARC-TESTNET`
- `decimals: 18`
- `amount: 20`

Command: `npm run circle:wallets:token-lookup`

- `lookupBlockchain: ARC-TESTNET`
- `lookupSymbol: USDC`
- `candidateCount: 1`
- `source: getWalletTokenBalance`
- `id: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `symbol: USDC`
- `name: USDC`
- `blockchain: ARC-TESTNET`
- `decimals: 18`

### Transfer estimate proof (non-mutating)

Env:

- `CIRCLE_WALLET_TRANSFER_TOKEN_ID=15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `CIRCLE_WALLET_TRANSFER_DRY_RUN=true`

Command: `npm run circle:wallets:estimate-transfer`

Result: transfer estimate succeeded.

Low:

- `gasLimit: 21000`
- `networkFee: 0.000897567715086`
- `networkFeeRaw: 0.000477567715086`
- `baseFee: 20`
- `priorityFee: 2.741319766`
- `maxFee: 42.741319766`

Medium:

- `gasLimit: 21000`
- `networkFee: 0.000911224445355`
- `networkFeeRaw: 0.000491224445355`
- `baseFee: 20`
- `priorityFee: 3.391640255`
- `maxFee: 43.391640255`

High:

- `gasLimit: 21000`
- `networkFee: 0.000933483353355`
- `networkFeeRaw: 0.000513483353355`
- `baseFee: 20`
- `priorityFee: 4.451588255`
- `maxFee: 44.451588255`

No live transfer was executed.

### Message signing proof (server-only, non-fund-moving)

Command: `npm run circle:wallets:sign-message`

Result: message signing succeeded.

- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `message: AgentPay Circle Wallets signing proof on ARC-TESTNET`
- `signature: 0x78d2d1364b64fb0be9b053b78abe519890dfb82e0ab3d52125675ada7e4913533f54e056b33121a95a886a4446bfb2db3a864a2a328314bf3e66f00b651f5aee1c`
- `status: 200`
- No funds moved.
- No transfer created.

### Live tiny transfer/send proof (founder-run)

Submitted command: `npm run circle:wallets:send-tiny-transfer`

- `transactionId: 373289ce-27f9-55d7-8601-b853f8fd9cc2`
- `state: INITIATED`
- `sourceWalletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `destinationAddress: 0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
- `tokenId: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `amount: 0.001`
- `blockchain: ARC-TESTNET`
- `status: 201`

Finality check command (non-mutating): `npm run circle:wallets:get-transaction`

- `transactionId: 373289ce-27f9-55d7-8601-b853f8fd9cc2`
- `state: COMPLETE`
- `txHash: 0x702c86b15ee071666327004e2ded60eb8ed065b9f153e52ba2bbcd60378e912e`
- `finalityFieldsPresent: true`
- `responseShape: response.data.transaction`
- No secrets were printed.
- No gasless/paymaster flow was run.

### Classification guardrail

- Circle Wallets transfer estimate path: `CURRENT_CODE_IMPLEMENTED_TRANSFER_ESTIMATE_VERIFIED`
- Circle Wallets signing: `CURRENT_VERIFIED` (message signing only)
- Circle Wallets send/transfer: `CURRENT_VERIFIED` (live tiny transfer/send verified on ARC-TESTNET)
- Circle Wallets SCA wallet creation: `CURRENT_VERIFIED` (developer-controlled SCA wallet creation verified on ARC-TESTNET)
- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

### Gas Station / Paymaster readiness preflight (non-mutating)

Command: `npm run circle:gas-station:readiness`

Documented scope:

- Server-only env validation for Circle keys + wallet + ARC-TESTNET baseline
- Wallet metadata read (`walletId`, `walletAddress`, `blockchain`, `accountType`, `custodyType`, `state`)
- Policy env presence check (`CIRCLE_GAS_STATION_POLICY_ID`, `CIRCLE_PAYMASTER_POLICY_ID`)
- No sponsored transaction sent
- No wallet created

Founder-observed Console context recorded for readiness (not API-verified in script):

- `Default Arc Testnet Policy`
- status `Active`
- network `Arc Testnet`
- daily spend limit `50 USDC-TESTNET`
- `Sponsored Transactions` UI present
- settled sponsored tx count `0`

Current claim boundary remains:

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

Gasless/paymaster discovery update (Master Prompt #19):

- Discovery report: `docs/grant/agentpay/CIRCLE_WALLETS_GASLESS_PAYMASTER_DISCOVERY.md`
- Setup checklist: `docs/grant/agentpay/GAS_STATION_PAYMASTER_SETUP_CHECKLIST.md`
- Classification: `DO_NOT_CLAIM`
- Blocking tags: `BLOCKED_EXISTING_WALLET_IS_EOA`, `FEASIBLE_BUT_NEEDS_SCA_WALLET`, `FEASIBLE_BUT_NEEDS_GAS_STATION_POLICY`, `FEASIBLE_BUT_NEEDS_CONSOLE_SETUP`
- Arc-testnet gasless/paymaster path remains unverified without real sponsored transaction proof.

## SCA/Paymaster planning checkpoint (Master Prompt #23)

- Date: 2026-05-19
- Scope: planning + optional non-mutating readiness only
- Planning artifact: `docs/grant/agentpay/SCA_PAYMASTER_PROOF_PATH_PLAN.md`
- Optional script artifact: `scripts/circle-sca-paymaster-readiness.ts`
- Script command: `npm run circle:sca-paymaster:readiness`
- Runtime sponsored tx proof: none in this checkpoint

Classification:

- `FEASIBLE_BUT_NEEDS_SCA_WALLET_CREATION`
- `FEASIBLE_BUT_NEEDS_APP_KIT_PAYMASTER_PATH`
- `FEASIBLE_BUT_NEEDS_RAW_ERC4337_PATH`
- `DO_NOT_CLAIM`

Boundary unchanged:

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

## Master Prompt #25 — Sponsored transfer dry-run readiness proof (no mutation)

- Date: 2026-05-19
- Script: `scripts/circle-paymaster-sponsored-transfer.ts`
- Command: `npm run circle:paymaster:sponsored-transfer`
- Execution mode: `CIRCLE_PAYMASTER_DRY_RUN=true`
- Mutation executed: none
- Secrets printed: none

Captured output fields:

- `scaWalletId: 494ad75a-4d03-5021-9ddb-0c70cf566954`
- `scaWalletAddress: 0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- `blockchain: ARC-TESTNET`
- `paymasterVersion: v0.8`
- `paymasterAddress: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- `tokenId: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `destinationAddress: 0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
- `amount: 0.001`
- `gasStationPolicyIdPresent: no`

Proof caveat:

- This is readiness evidence only.
- No sponsored transaction/userOperation was executed.
- No `userOpHash` or sponsored tx hash was captured in this checkpoint.

Claim boundary unchanged:

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

## Master Prompt #32 — Circle Paymaster v0.8 7702 account dry-run (non-mutating)

- Date: 2026-05-19
- Script: `scripts/circle-paymaster-v08-7702-account-dry-run.ts`
- Command: `npm run circle:paymaster:v08-7702:account-dry-run`
- Findings doc: `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_7702_ACCOUNT_DRY_RUN.md`

Recorded local findings (installed viem types/source only):

- `toSimple7702SmartAccount` import path: `viem/account-abstraction`
- `entryPoint07Address` and `entryPoint08Address` import path: `viem/account-abstraction`
- Arc chain helper import path: `defineChain` from `viem`
- `toSimple7702SmartAccount` requires `owner: PrivateKeyAccount`

Checkpoint boundary:

- no private key usage
- no signer construction
- no wallet creation
- no `sendUserOperation`
- no network calls

Status unchanged:

- paymasterStatus=`NOT_CLAIMED`
- gaslessStatus=`NOT_CLAIMED`

## Master Prompt #33 — Circle Paymaster v0.8 7702 owner signer readiness (server-only)

- Date: 2026-05-19
- Script: `scripts/circle-paymaster-v08-7702-owner-readiness.ts`
- Command: `npm run circle:paymaster:v08-7702:owner-readiness`
- Doc: `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_7702_OWNER_READINESS.md`

Recorded findings:

- owner helper for future 7702 path: `privateKeyToAccount` from `viem/accounts`
- owner public address can be derived from private key locally without signing
- enforced guardrails:
  - `PAYMASTER_7702_OWNER_DRY_RUN` must be true
  - placeholder/all-zero keys are rejected
  - expected-address mismatch is rejected when configured

Checkpoint safety boundary:

- no network calls
- no signing
- no userOperation submission
- no token transfers
- no wallet creation

Status unchanged:

- paymasterStatus=`NOT_CLAIMED`
- gaslessStatus=`NOT_CLAIMED`

## Master Prompt #34 — Circle Paymaster v0.8 7702 owner readiness verified (server-only)

- Date: 2026-05-19
- Command: `npm run circle:paymaster:v08-7702:owner-readiness`
- Checkpoint type: `verified / readiness-only`

Verified output fields:

- `ownerAddressPresent: yes`
- `ownerAddress: 0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- `expectedAddressMatched: yes`
- `signing: false`
- `networkCalls: false`
- `userOps: false`
- `transactions: false`
- `paymasterStatus: NOT_CLAIMED`
- `gaslessStatus: NOT_CLAIMED`

Boundary confirmation:

- private key was never printed
- no signing occurred
- no network call occurred
- no userOp was submitted
- no transaction was sent

Status unchanged:

- paymasterStatus=`NOT_CLAIMED`
- gaslessStatus=`NOT_CLAIMED`

## Master Prompt #26 — Live sponsored-transfer attempt failure checkpoint

- Date: 2026-05-19
- Script: `scripts/circle-paymaster-sponsored-transfer.ts`
- Attempt mode: live (`CIRCLE_PAYMASTER_DRY_RUN=false`)
- Outcome: failed in Circle SDK/API path before proof capture

Failure checkpoint fields:

- `paymasterProofCaptured=false`
- `userOpHashPresent=false`
- `txHashPresent=false`
- `paymasterStatus=NOT_CLAIMED`
- `gaslessStatus=NOT_CLAIMED`

Not captured in this failed attempt:

- `userOpHash`
- sponsored `txHash`
- transaction id suitable for sponsored-proof finality
- sponsored transaction finality evidence

Boundary decision:

- No claim upgrade permitted from this attempt.
- Circle Wallets gasless remains `NOT_CLAIMED`.
- Paymaster remains `NOT_CLAIMED`.

Next path recommendation:

- Investigate App Kit Paymaster path only if deterministic paymaster/userOp proof fields are capturable.
- Otherwise prioritize raw ERC-4337 (`viem` bundler + paymaster + userOperation proof pipeline).

## Master Prompt #30E — Circle Paymaster v0.8 quickstart data-path revision

- Date: 2026-05-19
- Scope: docs-only revision from official Circle quickstart findings (no mutation)
- Reviewed sources:
  - `https://developers.circle.com/paymaster/pay-gas-fees-usdc#3-1-connect-to-the-bundler`
  - `https://developers.circle.com/paymaster/pay-gas-fees-usdc#paymaster-v0-8`
  - `https://developers.circle.com/wallets/modular/android-sdk#class-getpaymasterdataresult`

Recorded findings:

1. Circle Paymaster v0.8 quickstart account path uses viem `toSimple7702SmartAccount`.
2. `getPaymasterData()` can be built locally by:
   - signing EIP-2612 permit
   - packing: `encodePacked(["uint8","address","uint256","bytes"], [0, usdcAddress, permitAmount, permitSignature])`
   - returning: `paymaster`, `paymasterData`, `paymasterVerificationGasLimit`, `paymasterPostOpGasLimit`, `isFinal`
3. Bundler remains required via `createBundlerClient`.
4. Example quickstart bundler pattern appears as:
   - `https://public.pimlico.io/v2/${client.chain.id}/rpc`
5. UserOp proof artifacts can be captured from:
   - `sendUserOperation`
   - `waitForUserOperationReceipt`
   - receipt transaction hash
   - `userOpHash`
   - paymaster field/logs
6. Android Modular Wallets SDK receipt model includes proof-relevant fields:
   - `userOpHash`
   - `paymaster`
   - `entryPoint`
   - `logs`
   - `receipt`
   - `success`

Classification adjustment:

- Replaced `BLOCKED_NO_PAYMASTER_DATA_PATH` with `FEASIBLE_PAYMASTER_DATA_LOCAL_PERMIT_PATH` for documented quickstart viability.
- Blockers still active:
  - `BLOCKED_NO_BUNDLER`
  - `BLOCKED_CIRCLE_SCA_RAW_COMPATIBILITY`
  - `FEASIBLE_BUT_NEEDS_PROVIDER_ACCOUNT`
  - `DO_NOT_CLAIM`

Claim boundary unchanged:

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

## Master Prompt #36 — v0.8 7702 bundler health (read-only)

- Date: 2026-05-19
- Script: `scripts/circle-paymaster-v08-7702-bundler-health.ts`
- Command: `npm run circle:paymaster:v08-7702:bundler-health`
- Scope: read-only bundler RPC health probe

Allowed JSON-RPC calls only:

- `eth_chainId`
- `eth_supportedEntryPoints`
- `web3_clientVersion` (optional)

Forbidden in this checkpoint:

- `eth_sendUserOperation`
- `pimlico_sendUserOperation`
- any mutation/send method

Boundary unchanged:

- signing: `false`
- userOps: `false`
- transactions: `false`
- paymasterStatus: `NOT_CLAIMED`
- gaslessStatus: `NOT_CLAIMED`

## Master Prompt #37 — v0.8 7702 UserOp object dry-run (construction-only)

- Date: 2026-05-19
- Script: `scripts/circle-paymaster-v08-7702-userop-dry-run.ts`
- Command: `npm run circle:paymaster:v08-7702:userop-dry-run`
- Doc: `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_7702_USEROP_DRY_RUN.md`

Scope boundary:

- env validation + local owner derivation + object construction only
- no permit signing
- no `sendUserOperation`
- no tx send/write

Output boundary markers:

- `signing=false`
- `userOps=false`
- `transactions=false`
- `paymasterDataBuilderStatus=stub_no_signature`
- `permitSigningRequired=true`
- `permitSigningExecuted=false`

Claim boundary unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

## Master Prompt #42B — Circle Paymaster v0.8 controlled live proof attempt (single-run, failed)

- Date: 2026-05-19
- Command: `npm run circle:paymaster:v08:live-proof`
- Attempt policy: `exactly_one`
- Auto retry: `false`
- Proof artifact: `docs/grant/agentpay/proofs/CIRCLE_PAYMASTER_V08_LIVE_PROOF_2026-05-19T21-43-31-730Z.md`

Prechecks executed and passed before live run:

1. `npm run circle:paymaster:v08-7702:owner-readiness`
2. `npm run circle:paymaster:v08-7702:bundler-health`
3. `npm run circle:paymaster:v08:permit-input-readiness`
4. `npm run circle:paymaster:v08:userop-assembly-dry-run`

Live attempt output summary:

- `proofStatus=FAILED_BEFORE_USEROPHASH`
- `userOpHash=N/A`
- `txHash=N/A`
- `receipt/finality=unavailable`
- `logsCount=0`
- `paymasterAddress=0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- `entryPointAddress=0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108`
- `network=ARC-TESTNET`

Sanitized blocker classification:

- Stage: `before userOpHash`
- Error class: `UserOperationExecutionError`
- Revert reason: `AA30 paymaster not deployed`

Boundary decision after single attempt:

- No retry executed.
- Claim boundary unchanged.
- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

## PATCH #42A — Live proof env-mode conflict resolved (gating model update)

- Date: 2026-05-20
- Scope: safety gating patch only (no live submission)
- Updated script: `scripts/circle-paymaster-v08-live-proof.ts`
- Updated env template: `.env.example`

Gating model update:

- Removed live-proof dependency on `RAW_ERC4337_DRY_RUN=false`.
- Dry-run/readiness scripts keep `RAW_ERC4337_DRY_RUN=true`.
- Live-proof script now requires exact gates:
  - `CIRCLE_PAYMASTER_LIVE_PROOF_APPROVED=true`
  - `CIRCLE_PAYMASTER_LIVE_PROOF_EXECUTE=true`
  - `CIRCLE_PAYMASTER_LIVE_PROOF_MAX_ATTEMPTS=1`

Blocked markers (no submission when triggered):

- `LIVE_PROOF_BLOCKED_EXECUTE_FLAG_MISSING`
- `LIVE_PROOF_BLOCKED_APPROVAL_FLAG_MISSING`
- `LIVE_PROOF_BLOCKED_MAX_ATTEMPTS_NOT_ONE`

Boundary unchanged:

- no claim upgrade from this patch
- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

## Master Prompt #41 — Circle Paymaster v0.8 live proof final readiness docs

- Date: 2026-05-19
- Scope: documentation + final readiness only (no live userOp submission)
- New docs:
  - `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_LIVE_PROOF_FINAL_CHECKLIST.md`
  - `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_LIVE_PROOF_RUNBOOK.md`

Hard non-actions in this checkpoint:

- no `sendUserOperation`
- no userOp submission
- no broadcast transaction
- no token approval
- no wallet creation

Claim boundary unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

## Master Prompt #38 — Circle Paymaster v0.8 permit input readiness (read-only)

- Date: 2026-05-19
- Script: `scripts/circle-paymaster-v08-permit-input-readiness.ts`
- Command: `npm run circle:paymaster:v08:permit-input-readiness`
- Doc: `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_PERMIT_INPUT_READINESS.md`

Scope boundary:

- local owner derivation + read-only ERC-20 permit input probes only
- no permit signing
- no `sendUserOperation`
- no userOp submission
- no transaction submission
- no token approvals

Read-only calls allowed in this checkpoint:

- `name()`
- `decimals()`
- `nonces(owner)`
- `balanceOf(owner)`
- `allowance(owner, paymaster)`
- optional `version()` with fallback `version=unavailable`

Output boundary markers:

- `permitSigningRequired=true`
- `permitSigningExecuted=false`
- `userOps=false`
- `transactions=false`

Claim boundary unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

## Master Prompt #39 — Circle Paymaster v0.8 permit signature dry-run (local/offline signing only)

- Date: 2026-05-19
- Script: `scripts/circle-paymaster-v08-permit-signature-dry-run.ts`
- Command: `npm run circle:paymaster:v08:permit-signature-dry-run`
- Doc: `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_PERMIT_SIGNATURE_DRY_RUN.md`

Scope boundary:

- local EIP-2612 typed-data signature generation only
- local paymasterData packing only
- read-only ERC-20 permit input probes

Explicit non-actions:

- no `sendUserOperation`
- no userOp submission
- no tx send/write
- no token approval/write

Output boundary markers:

- `permitSigningExecuted=true`
- `userOps=false`
- `transactions=false`
- `approvals=false`
- `paymasterDataEncoded=yes`

Claim boundary unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
