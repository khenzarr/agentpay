# PAYMASTER Wallets SDK + App Kit Final Attempt — AgentPay (ARC-TESTNET)

## 1. Purpose

Final conservative discovery attempt to find a deterministic Circle Paymaster/Gasless proof path via:

- A) Circle Developer-Controlled Wallets SDK
- B) Circle App Kit

without running live sponsored transactions in this sprint.

## 2. Current verified foundation

- Circle Wallets EOA create/read/sign/send: `CURRENT_VERIFIED`
- Circle Wallets SCA wallet creation: `CURRENT_VERIFIED`
- Verified SCA wallet:
  - `walletId`: `494ad75a-4d03-5021-9ddb-0c70cf566954`
  - `walletAddress`: `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
  - `blockchain`: `ARC-TESTNET`
  - `accountType`: `SCA`
  - `state`: `LIVE`
- Paymaster/Gasless claim boundary: `NOT_CLAIMED`

## 3. Prior Wallets SDK live failure summary

- Prior live sponsored-transfer attempt failed before proof capture.
- Not captured: `userOpHash`, sponsored `txHash`, deterministic finality evidence.

## 4. Wallets SDK final inspection

Inspected installed SDK types/source (`@circle-fin/developer-controlled-wallets@^10.3.1`).

Findings:

1. `CreateTransferTransactionInput` exposes transfer + fee fields but no explicit paymaster/sponsorship selector.
2. `CreateTransferTransactionForDeveloperRequest` exposes `accountType` and fee/gas knobs, but no explicit paymaster module field in local surface.
3. `Transaction` / `getTransaction` response shape includes `id`, `state`, `txHash`, fees, operation metadata.
4. No deterministic `userOpHash`/paymaster proof field is guaranteed in inspected Wallets SDK transaction response types.
5. SDK error surface includes paymaster-policy-related errors, indicating policy gating exists, but deterministic proof artifacts remain non-guaranteed from local transfer response surface.

Direct answers (Task A1):

1) Explicit sponsorship request field in transfer request?
- **No deterministic explicit field confirmed** in installed transfer input surface.

2) accountType / fee / gasless / gasStation / paymaster fields?
- `accountType` and fee/gas fields are present.
- explicit gasStation/paymaster request field is **not deterministically exposed** in inspected transfer input surface.

3) Response includes `userOpHash` or paymaster evidence?
- Not guaranteed by inspected local types.

4) `getTransaction` enough to prove sponsorship after finality?
- Provides tx lifecycle/finality primitives (`state`, `txHash`) but **insufficient alone** for deterministic sponsorship proof.

5) Prior failure likely root cause?
- Most likely policy/config/runtime path gating or opaque SDK limitation in proof-field exposure; cannot deterministically attribute to one missing explicit request field from local types alone.

6) Safe patch path?
- No deterministic new required transfer parameter was discovered in local SDK surface for guaranteed sponsorship proof.

## 5. Wallets SDK viability verdict

- `WALLETS_SDK_BLOCKED_NO_DETERMINISTIC_PAYMASTER_PROOF`

## 6. App Kit final inspection

Inspected installed `@circle-fin/app-kit@^1.5.1` and local export-inspection script.

Findings:

- Arc Testnet and bridge/send/unified balance surfaces are present.
- Local surface includes gasless permit-style semantics in some flows, but no deterministic local paymaster module with explicit userOp proof artifacts found.
- No deterministic local App Kit output contract guaranteeing `userOpHash + paymaster evidence + finality tuple` discovered.

Task B1 direct answers:

1) App Kit Paymaster module?
- **Not deterministically exposed** in inspected local surface.

2) Smart-account/userOperation primitives?
- No deterministic userOperation primitive surfaced as a direct App Kit paymaster-proof path.

3) Send supports “pay gas in USDC” / sponsored mode?
- No deterministic claimable sponsored-tx proof surface confirmed from local inspection.

4) Proof artifacts exposed (`userOpHash`, `txHash`, paymaster address, finality)?
- Not deterministically guaranteed by inspected local App Kit surface.

5) Arc Testnet Paymaster-specific support?
- Arc Testnet chain support exists; Arc-specific paymaster-proof surface not deterministically confirmed.

6) Easier than raw ERC-4337 for deterministic proof?
- **No** (from local deterministic-proof perspective).

7) Exact supporting exports/internal APIs?
- Chain/bridge/send/unified balance surfaces; no deterministic explicit paymaster/userOp proof API identified in local inspected surface.

## 7. App Kit viability verdict

- `APP_KIT_BLOCKED_NO_LOCAL_DETERMINISTIC_PAYMASTER_SURFACE`

## 8. If Wallets SDK is still feasible, exact next safe patch/run path

Feasible only as conservative readiness path (not proof claim):

1. Keep dry-run default.
2. Continue capturing sanitized transaction lifecycle fields if returned.
3. Require explicit founder approval before any future live attempt.
4. Do not upgrade claim unless deterministic artifacts include at least: `userOpHash`, `txHash`, paymaster evidence, finality correlation.

## 9. If App Kit is feasible, exact next safe implementation path

Current verdict is blocked for deterministic local proof surface. If future App Kit release exposes explicit paymaster/userOp artifacts, re-run surface audit and update classification.

## 10. If neither is deterministic, raw ERC-4337 fallback decision

- `RAW_ERC4337_REQUIRED`
- Prefer raw `viem` AA path for deterministic artifact capture once external infra and approval gates are ready.

## 11. Required proof artifacts before claim upgrade

Minimum required artifacts:

1. `userOpHash`
2. `txHash`
3. final status/finality
4. paymaster address used
5. EntryPoint version/address used
6. userOp receipt correlation
7. paymaster event/log correlation
8. sponsored fee evidence
9. network marker `ARC-TESTNET`

## 12. Claim boundary

- `DO_NOT_CLAIM`
- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

## Classification summary

- `WALLETS_SDK_BLOCKED_NO_DETERMINISTIC_PAYMASTER_PROOF`
- `APP_KIT_BLOCKED_NO_LOCAL_DETERMINISTIC_PAYMASTER_SURFACE`
- `RAW_ERC4337_REQUIRED`
- `DO_NOT_CLAIM`