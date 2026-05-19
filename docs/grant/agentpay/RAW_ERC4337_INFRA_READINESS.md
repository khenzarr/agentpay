# RAW ERC-4337 Infra Readiness — AgentPay (ARC-TESTNET)

## 1. Purpose

Prepare deterministic, non-mutating infrastructure readiness for a future Circle Paymaster proof sprint on ARC-TESTNET.

Scope of this document:

- discovery only
- no live userOperation submission
- no sponsored transaction execution
- no token transfer

Status boundary in this sprint:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Current verified foundation

- Circle Developer-Controlled SCA wallet exists on ARC-TESTNET:
  - `walletId`: `494ad75a-4d03-5021-9ddb-0c70cf566954`
  - `walletAddress`: `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
  - `accountType`: `SCA`
  - `state`: `LIVE`
- Circle Paymaster Arc Testnet addresses are documented:
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`
- Installed `viem` AA primitives are present:
  - `createBundlerClient`
  - `createPaymasterClient`
  - `sendUserOperation`
  - `waitForUserOperationReceipt`
  - `getUserOperation`
  - `getUserOperationReceipt`
  - `getUserOperationHash`

---

## 3. Why raw ERC-4337 is now required

Current checkpoint conclusion is unchanged:

- `WALLETS_SDK_BLOCKED_NO_DETERMINISTIC_PAYMASTER_PROOF`
- `APP_KIT_BLOCKED_NO_LOCAL_DETERMINISTIC_PAYMASTER_SURFACE`
- `RAW_ERC4337_REQUIRED`

Wallets SDK and App Kit paths in this repo do not currently guarantee deterministic local capture of `userOpHash + sponsored txHash + paymaster correlation`.

---

## 4. Bundler requirement

Findings:

1. ARC-TESTNET bundler endpoint is **not documented** in current repo docs.
2. Circle-provided ARC-TESTNET bundler URL is **not documented** in current repo docs.
3. `viem` `createBundlerClient(...)` requires a transport URL (bundler RPC endpoint).

Required env:

- `ARC_BUNDLER_RPC_URL`

Without this endpoint, raw ERC-4337 send path cannot be executed.

---

## 5. Paymaster service/data requirement

Findings:

1. Circle Paymaster includes known onchain contract addresses, but deterministic ERC-4337 flow also needs paymaster data generation path.
2. In `viem`, paymaster fields are typically produced via paymaster RPC/service (`createPaymasterClient`, `getPaymasterData`, `getPaymasterStubData`) or equivalent deterministic local path.
3. A Circle ARC-TESTNET paymaster service URL is **not documented in repo evidence**.

Required env:

- `CIRCLE_PAYMASTER_SERVICE_URL`
- `CIRCLE_PAYMASTER_ADDRESS`
- `CIRCLE_PAYMASTER_VERSION`

Note: `CIRCLE_PAYMASTER_SERVICE_URL` is a readiness placeholder in this sprint, not a verified-in-repo endpoint.

---

## 6. EntryPoint requirement

Default and fallback:

- default: `v0.8`
- fallback: `v0.7`

Installed viem constants available:

- `entryPoint08Address`: `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108`
- `entryPoint07Address`: `0x0000000071727De22E5E9d8BAf0edAc6f37da032`

Required env:

- `RAW_ERC4337_ENTRYPOINT_VERSION`
- `RAW_ERC4337_ENTRYPOINT_ADDRESS`

---

## 7. Circle SCA metadata/signing requirement

Circle SCA address alone is insufficient for deterministic raw userOperation integration.

Missing metadata/signing confirmations include:

1. smart account implementation details (factory/init/deployment model)
2. owner/signer model mapping for this Circle-created SCA
3. deterministic `signUserOperation` compatibility path
4. exact raw-AA construction compatibility (`encodeCalls`, `getFactoryArgs`, stub signature semantics)

Current blocker tags:

- `FEASIBLE_BUT_NEEDS_CIRCLE_SCA_METADATA`
- `FEASIBLE_BUT_NEEDS_USEROP_SIGNING_PATH`

---

## 8. Minimal sponsored operation design

Eventual proof operation (future approved sprint only):

1. tiny USDC transfer from verified SCA wallet on ARC-TESTNET

Fallback:

2. benign contract call if transfer route is policy-blocked

Not accepted for proof claim:

- no-op path without full onchain proof artifacts

---

## 9. Required env vars

For readiness layer:

- `ARC_BUNDLER_RPC_URL`
- `CIRCLE_PAYMASTER_SERVICE_URL`
- `RAW_ERC4337_ENTRYPOINT_VERSION` (default `v0.8`)
- `RAW_ERC4337_ENTRYPOINT_ADDRESS`
- `RAW_ERC4337_DRY_RUN` (default `true`)
- `CIRCLE_SCA_WALLET_ID`
- `CIRCLE_SCA_WALLET_ADDRESS`
- `CIRCLE_PAYMASTER_ADDRESS`

Security boundary:

- do not print `CIRCLE_API_KEY`
- do not print `CIRCLE_ENTITY_SECRET`
- do not expose secrets in `NEXT_PUBLIC_*`

---

## 10. Required proof artifacts

Minimum deterministic artifact set before any claim upgrade:

1. `userOpHash`
2. submission correlation (`sendUserOperation` output)
3. `getUserOperation(...)` result
4. `getUserOperationReceipt(...)` result
5. final `txHash` + status/finality
6. paymaster address used
7. EntryPoint version + EntryPoint address used
8. log/event evidence (EntryPoint/paymaster correlation)
9. network marker `ARC-TESTNET`
10. sponsored fee evidence

---

## 11. Current missing items

1. ARC-TESTNET bundler RPC endpoint
2. paymaster service/data path endpoint (or deterministic equivalent)
3. confirmed EntryPoint address/version runtime config for chosen infra
4. Circle SCA smart-account metadata needed for raw AA integration
5. Circle-compatible deterministic userOp signing path

---

## 12. Go/no-go checklist

### GO only if

- [ ] Bundler RPC is available and validated for ARC-TESTNET
- [ ] Paymaster data path is available and deterministic
- [ ] EntryPoint version/address are confirmed in runtime path
- [ ] Circle SCA metadata supports raw userOp construction
- [ ] UserOp signing path is confirmed and deterministic
- [ ] Proof artifact capture pipeline is ready end-to-end

### NO-GO if

- [ ] userOp artifacts are opaque/unavailable
- [ ] paymaster correlation cannot be captured
- [ ] any required infra endpoint remains unknown/unverified

---

## 13. Claim boundary

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
- classification: `DO_NOT_CLAIM`

No claim upgrade is allowed from this readiness-only sprint.

---

## 14. Recommended next sprint

1. Resolve infra prerequisites only:
   - bundler RPC URL
   - paymaster service/data path URL
   - EntryPoint runtime confirmation
   - Circle SCA metadata/signing compatibility
2. Run exactly one tiny sponsored operation only after explicit approval.
3. Capture complete proof artifact set.
4. Reassess claim boundary.

---

## Final classification

- `FEASIBLE_BUT_NEEDS_BUNDLER_RPC`
- `FEASIBLE_BUT_NEEDS_PAYMASTER_SERVICE_OR_DATA_PATH`
- `FEASIBLE_BUT_NEEDS_CIRCLE_SCA_METADATA`
- `FEASIBLE_BUT_NEEDS_USEROP_SIGNING_PATH`
- `DO_NOT_CLAIM`
