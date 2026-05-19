# Circle Paymaster v0.8 Permit Signature Dry-Run (Arc Testnet)

## 1. Purpose

Produce a controlled, server-only **EIP-2612 permit signature dry-run** for the Circle Paymaster v0.8 local `paymasterData` generation path on Arc Testnet.

This checkpoint allows local typed-data signing for the permit message only, without any onchain mutation.

Status boundary:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Safety boundary

Script:

- `scripts/circle-paymaster-v08-permit-signature-dry-run.ts`

Command:

- `npm run circle:paymaster:v08:permit-signature-dry-run`

Hard rules enforced:

- no `sendUserOperation`
- no userOp submission
- no transaction send/write
- no token approval/write
- no wallet creation
- no private key printing
- no secret env printing

Allowed in this sprint:

- local owner derivation from configured private key
- read-only ERC-20 calls for permit inputs
- local EIP-2612 typed-data signing
- local packed `paymasterData` encoding

---

## 3. EIP-2612 typed data structure

Domain:

- `name`: token `name()`
- `version`: token `version()` (fallback `2` in current script)
- `chainId`: `5042002`
- `verifyingContract`: Arc Testnet USDC (`0x3600000000000000000000000000000000000000`)

Types:

- `Permit(owner,address spender,uint256 value,uint256 nonce,uint256 deadline)`

Message:

- `owner`: derived owner address
- `spender`: Circle Paymaster v0.8 address (`0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`)
- `value`: `permitAmountRaw`
- `nonce`: `nonces(owner)`
- `deadline`: current time + `CIRCLE_PAYMASTER_PERMIT_DEADLINE_SECONDS`

---

## 4. Signature dry-run result fields

Script output includes these core fields:

- `ownerAddress`
- `expectedAddressMatched=yes`
- `tokenName`
- `tokenVersion`
- `tokenDecimals`
- `nonce`
- `valueRaw`
- `deadline`
- `spender`
- `verifyingContract`
- `signaturePresent=yes`
- `signatureLength`
- `signaturePrefix` (first 10 chars only)
- `permitSigningExecuted=true`
- `userOps=false`
- `transactions=false`
- `approvals=false`
- `paymasterStatus=NOT_CLAIMED`
- `gaslessStatus=NOT_CLAIMED`

The full signature is intentionally not printed in this checkpoint.

---

## 5. `paymasterData` encode structure

Local encoding path:

- `encodePacked(["uint8","address","uint256","bytes"], [0, usdcAddress, permitAmountRaw, permitSignature])`

Output fields:

- `paymasterDataEncoded=yes`
- `paymasterDataLength`
- `paymasterDataPrefix` (first 18 chars only)
- `paymasterAddress`
- `paymasterVerificationGasLimitCandidate=unresolved`
- `paymasterPostOpGasLimitCandidate=unresolved`
- `isFinalCandidate=true`

---

## 6. What this proves

1. Owner key/address guardrail can pass for the configured signer.
2. Required ERC-20 permit inputs can be read on Arc Testnet.
3. EIP-2612 typed-data payload can be built deterministically for Circle Paymaster v0.8 spender path.
4. Permit signature can be generated locally (offline/local, not submitted).
5. Local packed `paymasterData` shape can be produced for the documented v0.8 path.

---

## 7. What this does not prove

1. No userOp was sent (`sendUserOperation` not called).
2. No paymaster sponsorship was executed onchain.
3. No `userOpHash` or sponsored `txHash` was produced.
4. No receipt/log finality evidence was captured.
5. No claim upgrade evidence exists from this checkpoint alone.

---

## 8. Remaining blockers

1. Missing deterministic runtime artifacts (`userOpHash`, `txHash`, final receipt/log correlation).
2. Paymaster gas-limit return values remain unresolved in-repo for this local-only checkpoint.
3. A separately approved, tightly scoped submission sprint is still required for claim-eligible proof capture.

---

## 9. Claim boundary

Unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

Sprint classification:

- `DO_NOT_CLAIM`

---

## 10. Next sprint

Recommended approved next sprint:

1. Use the local permit payload/signature path inside a controlled `getPaymasterData` function.
2. Execute one tiny audited sponsored userOp with explicit approval.
3. Capture and store deterministic artifacts:
   - `userOpHash`
   - `txHash`
   - receipt success/finality
   - paymaster + EntryPoint correlation
4. Re-evaluate claim boundary only if full artifact set is captured.

---

## 11. Final live-proof readiness docs

Before any live submission attempt, use:

1. `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_LIVE_PROOF_FINAL_CHECKLIST.md`
2. `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_LIVE_PROOF_RUNBOOK.md`

Hard boundary reminder:

- live proof requires explicit founder approval
- current status remains:
  - Paymaster: `NOT_CLAIMED`
  - Gasless: `NOT_CLAIMED`
