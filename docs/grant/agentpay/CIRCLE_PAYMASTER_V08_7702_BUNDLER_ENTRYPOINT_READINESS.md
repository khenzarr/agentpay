# Circle Paymaster v0.8 7702 Bundler + EntryPoint Readiness (Arc Testnet)

## 1. Purpose

Prepare a strict non-mutating readiness checkpoint for bundler + EntryPoint runtime configuration for the future Circle Paymaster v0.8 / 7702 proof path.

Safety boundary in this checkpoint:

- no signing
- no wallet creation
- no `sendUserOperation`
- no transactions
- no token transfers

Claim boundary remains:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Why bundler is required

ERC-4337 userOperation orchestration requires bundler RPC for submission/receipt flows.

Without `ARC_BUNDLER_RPC_URL`, runtime proof flow is blocked.

Readiness blocker tag:

- `BLOCKED_NO_BUNDLER`

---

## 3. EntryPoint v0.8 selection

Installed `viem/account-abstraction` constants:

- `entryPoint08Address = 0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108`
- `entryPoint07Address = 0x0000000071727De22E5E9d8BAf0edAc6f37da032`

Default selection for Circle Paymaster v0.8 path:

- `RAW_ERC4337_ENTRYPOINT_VERSION=v0.8`
- maps to `entryPoint08Address`

---

## 4. EntryPoint fallback v0.7

Fallback remains supported for runtime compatibility contingencies:

- `RAW_ERC4337_ENTRYPOINT_VERSION=v0.7`
- maps to `entryPoint07Address`

---

## 5. Env vars

Readiness script reads only:

- `ARC_BUNDLER_RPC_URL`
- `RAW_ERC4337_ENTRYPOINT_VERSION` (default `v0.8`)
- `RAW_ERC4337_ENTRYPOINT_ADDRESS` (optional override)
- `RAW_ERC4337_DRY_RUN` (default `true`)
- `CIRCLE_PAYMASTER_ADDRESS` (default `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`)

No Circle secrets are read.

---

## 6. Readiness script behavior

Script:

- `scripts/circle-paymaster-v08-7702-bundler-readiness.ts`

Command:

- `npm run circle:paymaster:v08-7702:bundler-readiness`

Behavior:

1. prints Arc Testnet chain info (`chainId=5042002`, rpc, explorer, native currency)
2. prints selected EntryPoint version
3. prints selected EntryPoint address
4. prints address source (`env` or `viem_constant`)
5. prints whether bundler URL is present
6. prints `BLOCKED_NO_BUNDLER` when missing
7. performs no userOp submission and no transaction
8. keeps network call posture as `networkCalls=false`
9. prints `signing=false`, `userOps=false`, `transactions=false`
10. prints `paymasterStatus=NOT_CLAIMED`, `gaslessStatus=NOT_CLAIMED`

---

## 7. Current blockers

1. `ARC_BUNDLER_RPC_URL` not yet configured/verified for runtime
2. live proof artifacts still missing (`userOpHash`, receipt correlation, `txHash`)
3. Circle SCA raw-AA compatibility still requires runtime confirmation

---

## 8. What this does not prove

- no sponsored userOperation execution
- no paymaster fee sponsorship proof
- no onchain finality proof artifacts
- no claim upgrade evidence

---

## 9. Claim boundary

Unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 10. Next sprint

1. configure and verify `ARC_BUNDLER_RPC_URL`
2. wire runtime 7702 account + EntryPoint + paymaster data path
3. execute exactly one explicitly approved tiny sponsored flow
4. capture deterministic artifacts (`userOpHash`, receipt, `txHash`, paymaster correlation)
5. re-evaluate claim posture only after complete evidence
