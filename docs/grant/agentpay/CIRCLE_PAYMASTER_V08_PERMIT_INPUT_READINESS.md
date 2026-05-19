# Circle Paymaster v0.8 Permit Input Readiness (Arc Testnet)

## 1. Purpose

Prepare the **EIP-2612 permit input readiness layer** for Circle Paymaster v0.8 local `paymasterData` generation on Arc Testnet.

This checkpoint is **readiness/dry-run only**.

Status boundary:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Safety boundary

Script:

- `scripts/circle-paymaster-v08-permit-input-readiness.ts`

Command:

- `npm run circle:paymaster:v08:permit-input-readiness`

Hard guardrails:

- no permit signing
- no `sendUserOperation`
- no userOp submission
- no transaction send/write
- no token approval/write
- no wallet creation
- no private key printing
- no secret env printing

Allowed actions in this sprint:

- local owner address derivation for readiness checks
- read-only ERC-20 contract calls on Arc Testnet

---

## 3. EIP-2612 permit fields

Required permit payload fields for the Circle Paymaster v0.8 local path:

1. `owner` — owner/signer address (derived locally from configured owner key)
2. `spender` — **Circle Paymaster v0.8 contract address**
3. `value` — permit amount (token spend allowance for paymaster flow)
4. `nonce` — token permit nonce from `nonces(owner)`
5. `deadline` — unix timestamp in seconds
6. `domain` — EIP-712 domain (`name`, `version`, `chainId`, `verifyingContract`)
7. `signature` — EIP-2612 typed-data signature (**not generated in this sprint**)

Circle v0.8 local paymasterData pattern (for future signed sprint):

- `encodePacked(["uint8","address","uint256","bytes"], [0, usdcAddress, permitAmount, permitSignature])`

---

## 4. Arc Testnet USDC contract reads

Arc Testnet USDC used in this path:

- `0x3600000000000000000000000000000000000000`

Read-only methods used for permit readiness:

- `name()`
- `decimals()`
- `nonces(owner)`
- `balanceOf(owner)`
- `allowance(owner, paymaster)`
- optional `version()`

`verifyingContract` for EIP-2612 domain should be the **token contract address** (USDC), not token-id strings from Circle Wallets API.

If `version()` is unavailable/reverts, fallback is:

- `version=unavailable`

Readiness script is designed to continue without failing on missing `version()`.

---

## 5. Readiness script output

Script prints (non-secret readiness markers):

- `ownerAddress`
- `expectedAddressMatched`
- `usdcAddress`
- `paymasterAddress`
- `chainId`
- `tokenName`
- `tokenDecimals`
- `version` (or `unavailable`)
- `permitNonce`
- `ownerBalance`
- `currentAllowanceToPaymaster`
- `suggestedPermitAmount`
- `suggestedDeadline`
- `permitSigningRequired=true`
- `permitSigningExecuted=false`
- `userOps=false`
- `transactions=false`
- `paymasterStatus=NOT_CLAIMED`
- `gaslessStatus=NOT_CLAIMED`

---

## 6. What remains unsigned

Not performed in this sprint:

- EIP-2612 typed-data creation/signing
- permit signature generation
- final packed `paymasterData` with signature bytes

---

## 7. What remains unclaimed

Still unclaimed after this checkpoint:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

No claim upgrade is allowed from permit-input readiness evidence alone.

---

## 8. Current blockers

1. Permit signature is intentionally not executed in this sprint.
2. No userOp submission (`sendUserOperation`) in this sprint.
3. No receipt/finality artifacts (`userOpHash` / `txHash`) captured in this sprint.

---

## 9. Next sprint

Recommended next approved sprint:

1. Build EIP-712 permit domain/message deterministically from readiness outputs.
2. Execute a tightly scoped permit signing step (single controlled signer path).
3. Build final local paymasterData with `encodePacked` using real permit signature.
4. Submit one tiny audited sponsored userOp and capture full artifacts (`userOpHash`, `txHash`, receipt/log correlation).
5. Re-evaluate claim boundary only if all deterministic proof artifacts are captured.

---

## 10. Follow-up checkpoint completed

Subsequent sprint artifact:

- `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_PERMIT_SIGNATURE_DRY_RUN.md`

That checkpoint performs local EIP-2612 permit typed-data signing and local `paymasterData` packing only, while keeping:

- `userOps=false`
- `transactions=false`
- `approvals=false`
- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`