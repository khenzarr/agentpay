# Circle Paymaster v0.8 7702 Owner Signer Readiness (Server-Only)

## 1. Purpose

Prepare a safe, server-only readiness checkpoint for the future Circle Paymaster v0.8 7702 smart account flow.

This checkpoint is intentionally:

- non-mutating
- non-signing
- no network calls
- no userOperation submission

Claim boundary remains:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Why owner signer is required

From local installed `viem` findings, `toSimple7702SmartAccount` requires:

- `client`
- `owner: PrivateKeyAccount`

So future real 7702 account construction cannot proceed without an owner signer model.

---

## 3. Recommended owner wallet model

- Use a **dedicated test-only EOA private key** for server-side account wiring.
- Construct the owner with `privateKeyToAccount` from `viem/accounts`.
- Keep owner key isolated from frontend/public env and from unrelated app flows.

Recommended helper:

- `privateKeyToAccount(privateKey).address` for offline address derivation readiness

---

## 4. Env vars

Server-only vars used by this readiness script:

- `PAYMASTER_7702_OWNER_PRIVATE_KEY`
- `PAYMASTER_7702_OWNER_EXPECTED_ADDRESS`
- `PAYMASTER_7702_OWNER_DRY_RUN` (default true)

No other env values are read by this script.

---

## 5. Safety guardrails

Implemented guardrails:

1. hard reject when `PAYMASTER_7702_OWNER_DRY_RUN=false`
2. hard reject malformed private key format
3. hard reject obvious placeholder keys (including all-zero key)
4. optional hard reject on expected-address mismatch
5. never print private key
6. never print unrelated env values
7. no network/client/bundler/paymaster calls
8. no signing, no transaction, no userOp

---

## 6. What the readiness script does

Script: `scripts/circle-paymaster-v08-7702-owner-readiness.ts`

Command:

`npm run circle:paymaster:v08-7702:owner-readiness`

Behavior:

- if private key missing:
  - prints missing readiness state and setup instructions
  - does not fail hard
- if private key present:
  - derives owner address with `privateKeyToAccount`
  - prints only owner address
  - validates expected address if provided

Standard summary output includes:

- `ownerAddressPresent=yes/no`
- `expectedAddressMatched=yes/no/unknown`
- `signing=false`
- `networkCalls=false`
- `userOps=false`
- `paymasterStatus=NOT_CLAIMED`
- `gaslessStatus=NOT_CLAIMED`

---

## 7. What it does not do

- does not call RPC/bundler/paymaster
- does not create wallet(s)
- does not construct or submit userOp
- does not sign permit/message/transaction/userOp
- does not move tokens
- does not claim Paymaster/Gasless proof

---

## 8. Funding considerations

For this readiness sprint:

- no funding is required (offline only)

For future approved runtime sprint:

- paymaster token-fee path may require correct USDC-side funding/allowance context depending on final design
- native gas may be reduced/abstracted in sponsored path, but must be proven with real artifacts before assumptions are promoted

---

## 9. Current blockers

1. missing bundler endpoint/runtime wiring
2. owner signer only readiness-complete (not integrated into live path)
3. permit/userOp signing path remains unexecuted in this sprint
4. no deterministic live proof artifacts yet (`userOpHash`, receipt correlation, tx hash)

---

## 10. Claim boundary

Unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 11. Next sprint

1. integrate owner signer into controlled 7702 account construction path
2. wire bundler + EntryPoint runtime configuration
3. execute one explicitly approved tiny sponsored flow
4. capture deterministic proof artifacts (`userOpHash`, receipt, `txHash`, paymaster evidence)
5. re-evaluate claim boundary only after evidence completeness

---

## 12. Verified owner readiness proof checkpoint (Master Prompt #34)

- Date: 2026-05-19
- Command: `npm run circle:paymaster:v08-7702:owner-readiness`
- Checkpoint type: `verified / readiness-only`

Recorded output:

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
- Paymaster/Gasless remain `NOT_CLAIMED`
