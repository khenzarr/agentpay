# Raw ERC-4337 / Circle Paymaster Proof Path — AgentPay (ARC-TESTNET)

## 1. Purpose

Define the deterministic proof architecture for Circle Paymaster/Gasless evidence on `ARC-TESTNET` after the Wallets SDK sponsored-transfer path failed before proof capture.

Scope is discovery + architecture planning only.

Status boundary in this sprint:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Why Wallets SDK path is blocked

Known blocker from the live attempt record:

- no `userOpHash`
- no sponsored `txHash`
- no deterministic paymaster event/finality evidence

Current Wallets SDK continuity script (`scripts/circle-paymaster-sponsored-transfer.ts`) is useful operationally, but deterministic paymaster-proof artifacts are not guaranteed in the observed failure path.

Classification:

- `DO_NOT_CLAIM`

---

## 3. App Kit option

Installed `@circle-fin/app-kit` surface in this repo shows gasless permit/authorization semantics (EIP-2612 / EIP-3009 style approvals), but no clear installed type-level surface for deterministic ERC-4337 paymaster orchestration artifacts:

- no explicit `userOpHash` return path
- no explicit bundler/paymaster client path
- no explicit EntryPoint/paymaster configuration path

Conclusion (conservative):

- App Kit is not currently proven in-repo as a deterministic Circle Paymaster proof path.

Classification:

- `BLOCKED_DOCS_OR_SDK_INSUFFICIENT`

---

## 4. Raw ERC-4337 option

Installed `viem` account-abstraction surface supports required primitives:

- `createBundlerClient`
- `createPaymasterClient`
- `sendUserOperation`
- `waitForUserOperationReceipt`
- `getUserOperation`
- `getUserOperationReceipt`
- `getUserOperationHash`
- EntryPoint versions/constants (`0.7` / `0.8` available)

Raw path is feasible for deterministic proofs, but requires external infra + account compatibility details.

Additional Circle v0.8 quickstart finding:

- The documented path builds paymaster fields locally in `getPaymasterData()` by signing an EIP-2612 permit and packing:
  - `encodePacked(["uint8","address","uint256","bytes"], [0, usdcAddress, permitAmount, permitSignature])`
- This supports a local paymaster data path for the quickstart route.
- A separate Circle paymaster service URL is not yet proven necessary for that specific documented quickstart path.

Classification:

- `FEASIBLE_VIA_RAW_ERC4337`
- `FEASIBLE_BUT_NEEDS_BUNDLER`

---

## 5. Circle Wallets SCA compatibility question

Current verified SCA wallet:

- `walletId`: `494ad75a-4d03-5021-9ddb-0c70cf566954`
- `walletAddress`: `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- `blockchain`: `ARC-TESTNET`
- `accountType`: `SCA`

What is known:

- Circle Wallets SDK supports SCA account type and signing endpoints (`signMessage`, `signTypedData`, `signTransaction`).

What is not yet proven for raw ERC-4337:

- deterministic userOp signing path for this Circle-created SCA
- smart-account implementation metadata needed by raw AA tooling (factory/init/deployment/signature scheme details)
- compatibility between existing Circle-created SCA wallet path and Circle v0.8 quickstart account model (`toSimple7702SmartAccount`)

Conclusion:

- SCA address alone is not enough for deterministic raw userOp integration.

Classification:

- `FEASIBLE_BUT_NEEDS_SMART_ACCOUNT_METADATA`
- `FEASIBLE_BUT_NEEDS_CIRCLE_WALLETS_USEROP_SIGNING_PATH`
- if unresolved: `BLOCKED_WALLETS_SCA_NOT_ENOUGH_FOR_RAW_USEROP`

---

## 6. EntryPoint v0.8 vs v0.7 decision

Circle Paymaster ARC-TESTNET addresses:

- v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`

Decision:

1. Default target: **v0.8**
2. Fallback: **v0.7** if bundler/runtime compatibility requires

Rationale:

- docs support both
- installed viem supports both
- repo readiness already aligns to v0.8-first

---

## 7. Required external endpoints/services

Raw ERC-4337 deterministic proof path requires:

1. Bundler RPC endpoint for ARC-TESTNET
2. Deterministic paymaster data generation path (local permit path and/or service endpoint)
3. Public RPC for finality/log correlation
4. Reliable log/indexing path for proof capture (tx + userOp + paymaster events)

Without these, deterministic proof capture remains blocked.

---

## 8. Required env/config

Existing server-only env baseline:

- `CIRCLE_API_KEY`
- `CIRCLE_ENTITY_SECRET`
- `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`

Additional config needed for raw deterministic path (future approved sprint):

- `AA_BUNDLER_RPC_URL`
- `AA_PUBLIC_RPC_URL`
- `AA_ENTRYPOINT_VERSION=v0.8` (fallback `v0.7`)
- `AA_ENTRYPOINT_ADDRESS`
- `CIRCLE_SCA_WALLET_ID`
- `CIRCLE_SCA_WALLET_ADDRESS`
- `CIRCLE_PAYMASTER_ADDRESS`

Security rules remain:

- do not expose secrets in frontend/public env
- do not print Circle secrets in logs

---

## 9. Minimal proof transaction design

Preferred minimal sponsored operation:

1. tiny USDC transfer from verified SCA wallet to controlled recipient

Fallback candidates:

2. benign contract call with clear auditability
3. self-transfer only if policy allows and still yields strong evidence

Not acceptable:

- no-op flows that do not produce onchain proof artifacts

---

## 10. Required proof artifacts

Minimum deterministic artifact set required for claim upgrade:

1. `userOpHash`
2. `txHash`
3. final status/finality
4. paymaster address used
5. EntryPoint version + EntryPoint address used
6. userOp receipt correlation (bundler/userOp receipt)
7. paymaster event evidence (or tightly correlated log evidence)
8. sponsored fee evidence (token/native fee fields)
9. network marker (`ARC-TESTNET`)

Without all required artifacts, keep claim boundary unchanged.

---

## 11. Recommended implementation path

1. Keep Paymaster/Gasless as `NOT_CLAIMED`.
2. Prioritize raw ERC-4337 design readiness over App Kit paymaster assumptions.
3. Resolve blockers first:
   - bundler endpoint
   - paymaster data path validation (local permit path and/or service endpoint)
   - Circle SCA metadata
   - Circle-compatible userOp signing path
4. Execute exactly one tiny sponsored operation only in a separate approved sprint.
5. Capture full proof artifacts before any claim upgrade.

---

## 12. Current blockers

1. Wallets SDK sponsored-transfer path failed before proof artifact capture.
2. No deterministic `userOpHash` from current Wallets SDK path.
3. No deterministic sponsored `txHash` from current Wallets SDK path.
4. App Kit installed surface does not prove deterministic paymaster proof outputs.
5. Raw path still needs bundler/paymaster endpoints.
6. Raw path still needs Circle SCA smart-account metadata.
7. Raw path still needs confirmed Circle Wallets userOp signing path.

---

## 13. Claim boundary

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
- Sprint classification: `DO_NOT_CLAIM`

---

## 14. Go/no-go criteria

### GO only if

- deterministic userOp submission path is available
- deterministic `userOpHash` + `txHash` + finality capture is available
- paymaster address and event correlation can be captured
- Circle SCA compatibility/signing path is confirmed

### NO-GO if

- only Wallets SDK opaque path is available with missing userOp artifacts
- Circle SCA cannot be reliably used in raw userOp flow
- bundler/paymaster endpoints are unavailable/unverified

---

## Task A direct answers (concise)

1. **App Kit deterministic proof artifacts?** Not proven from installed surface; currently blocked for deterministic paymaster proof capture.
2. **Raw ERC-4337 requires bundler/EntryPoint/account/paymaster/signer?** Yes.
3. **Is Circle Wallets SCA enough by itself?** No; address alone is insufficient without metadata + userOp signing compatibility.
4. **EntryPoint version?** v0.8 default, v0.7 fallback.
5. **Required claim artifacts?** userOpHash, txHash, finality, paymaster address, EntryPoint info, event/log and sponsored fee evidence.
6. **Minimal sponsored op?** Tiny USDC transfer.
7. **Current blockers?** Missing deterministic artifacts and unresolved raw-path dependencies.

---

## Final classification

- `FEASIBLE_VIA_RAW_ERC4337`
- `FEASIBLE_BUT_NEEDS_BUNDLER`
- `FEASIBLE_BUT_NEEDS_SMART_ACCOUNT_METADATA`
- `FEASIBLE_BUT_NEEDS_CIRCLE_WALLETS_USEROP_SIGNING_PATH`
- `BLOCKED_DOCS_OR_SDK_INSUFFICIENT` (App Kit deterministic paymaster proof path in this repo)
- `DO_NOT_CLAIM`

---

## Master Prompt #29 readiness update

- New non-mutating readiness doc: `docs/grant/agentpay/RAW_ERC4337_INFRA_READINESS.md`
- New script: `npm run raw-erc4337:infra:readiness`
- Scope: env/config readiness only (no network calls, no userOp submission, no sponsorship mutation)

Conservative classification baseline remains:

- `BLOCKED_NO_BUNDLER`
- `FEASIBLE_PAYMASTER_DATA_LOCAL_PERMIT_PATH`
- `BLOCKED_CIRCLE_SCA_RAW_COMPATIBILITY`
- `FEASIBLE_BUT_NEEDS_PROVIDER_ACCOUNT`
- `DO_NOT_CLAIM`
