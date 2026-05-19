# Circle Paymaster v0.8 7702 Bundler Health Check (Read-Only)

## 1. Purpose

Add a strict read-only health check for Arc Testnet bundler compatibility in the Circle Paymaster v0.8 / 7702 path.

This checkpoint is **health-only** and does not execute any user operation lifecycle.

Status boundary in this sprint:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Safety boundary

The script is server-only and enforces a non-mutating posture:

- no private key printing
- no signing
- no wallet creation
- no `sendUserOperation`
- no transaction submission
- no token transfer

Allowed JSON-RPC methods only:

- `eth_chainId`
- `eth_supportedEntryPoints`
- `web3_clientVersion` (optional probe)

Forbidden in this checkpoint:

- `eth_sendUserOperation`
- `pimlico_sendUserOperation`
- any mutation/send method

---

## 3. Script and command

Script:

- `scripts/circle-paymaster-v08-7702-bundler-health.ts`

Command:

- `npm run circle:paymaster:v08-7702:bundler-health`

Env read:

- `ARC_BUNDLER_RPC_URL`

If env is missing:

- prints `bundlerUrlPresent=no`
- prints `BLOCKED_NO_BUNDLER`
- prints `healthVerdict=BLOCKED_NO_BUNDLER`

---

## 4. Fixed runtime targets

- Arc Testnet chain id: `5042002`
- EntryPoint v0.8 expected: `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108`
- Circle Paymaster v0.8 reference: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`

---

## 5. Output fields

Script prints:

- `bundlerUrlPresent=yes/no`
- `chainId=...` (if available)
- `supportedEntryPoints=...` (if available)
- `entryPointV08Present=yes/no`
- `healthVerdict=...`
- `paymasterStatus=NOT_CLAIMED`
- `gaslessStatus=NOT_CLAIMED`

Additional safety markers:

- `signing=false`
- `userOps=false`
- `transactions=false`
- `mutationMethodsCalled=none`

---

## 6. Health verdict semantics

- `BLOCKED_NO_BUNDLER`: no `ARC_BUNDLER_RPC_URL`
- `HEALTHY_ENTRYPOINT_V08_PRESENT`: read calls succeed and v0.8 EntryPoint is present
- `HEALTHY_ENTRYPOINT_V08_PRESENT_CHAIN_MISMATCH`: v0.8 EntryPoint present but chain id differs from `5042002`
- `UNHEALTHY_ENTRYPOINT_V08_MISSING`: read calls succeed but v0.8 EntryPoint is not listed
- `UNHEALTHY_RPC_READ_FAILED`: required read calls failed

---

## 7. Claim boundary

Unchanged after this checkpoint:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

No claim upgrade is permitted from this read-only health check.
