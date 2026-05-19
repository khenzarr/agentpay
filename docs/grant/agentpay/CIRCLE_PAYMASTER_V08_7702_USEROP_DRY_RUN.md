# Circle Paymaster v0.8 / 7702 UserOp Object Dry-Run

## 1. Purpose

Establish a controlled **object-construction-only** dry-run for the future Circle Paymaster v0.8 / 7702 UserOperation path on Arc Testnet.

This sprint validates env + client/account construction boundaries without attempting a live ERC-4337 operation.

Status boundary:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Safety boundary

Script: `scripts/circle-paymaster-v08-7702-userop-dry-run.ts`

Command:

- `npm run circle:paymaster:v08-7702:userop-dry-run`

Hard rules enforced in this checkpoint:

- no private key printing
- no secret env value printing
- no permit signing
- no `sendUserOperation`
- no `waitForUserOperationReceipt`
- no transaction send/write
- no wallet creation

Additionally, transport is configured with a blocking `fetchFn` so any accidental network path during construction is surfaced as a blocker in dry-run mode.

---

## 3. Client/account construction path

The script performs:

1. Env validation from `.env.circle.local`:
   - `PAYMASTER_7702_OWNER_PRIVATE_KEY`
   - `PAYMASTER_7702_OWNER_EXPECTED_ADDRESS`
   - `ARC_BUNDLER_RPC_URL`
   - `RAW_ERC4337_DRY_RUN=true`
   - `RAW_ERC4337_ENTRYPOINT_VERSION=v0.8`
   - `CIRCLE_PAYMASTER_ADDRESS`
2. Local owner derivation via `privateKeyToAccount`
3. Owner/expected address equality check
4. Arc Testnet chain object construction (`chainId=5042002`)
5. `publicClient` construction
6. `bundlerClient` construction
7. Attempted `toSimple7702SmartAccount` construction

If smart-account construction requires network/signing during this dry-run, the script marks:

- `smartAccountConstruction=blocked`
- `smartAccountConstructionBlocker=<error>`

---

## 4. Paymaster data builder skeleton

The script includes a local stub output only (no signature generation and no paymaster mutation call):

- `paymasterDataBuilderStatus=stub_no_signature`
- `permitSigningRequired=true`
- `permitSigningExecuted=false`
- `usdcTokenAddressArcTestnet=REQUIRED_NOT_RESOLVED_IN_DRY_RUN`
- `permitAmount=REQUIRED`
- `permitNonce=REQUIRED`
- `permitDeadline=REQUIRED`
- `permitDomain=REQUIRED`
- `permitSignature=REQUIRED_NOT_GENERATED`

This is intentionally non-claimable and non-cryptographic for this sprint.

---

## 5. What was successfully constructed

Dry-run checkpoint constructs and reports:

- owner account object (local derivation only)
- Arc chain config
- public client object
- bundler client object
- static EntryPoint/paymaster metadata markers

Reported invariants:

- `signing=false`
- `userOps=false`
- `transactions=false`

---

## 6. What remains blocked

This sprint does **not** perform:

- actual `UserOperation` building/submission
- paymaster permit signing
- paymaster data final encoding as proof artifact
- receipt/finality capture (`userOpHash`/`txHash`)

If account construction path internally requires online calls/signing, that remains an explicit blocker to resolve in a later approved sprint.

---

## 7. Required next artifacts

For claim-eligible paymaster/gasless verification in a future sprint, deterministic artifacts are still required:

1. `userOpHash`
2. `txHash`
3. receipt finality + success
4. paymaster address in operation path
5. EntryPoint address/version correlation
6. sponsor fee evidence/log correlation

---

## 8. Claim boundary

Unchanged in this dry-run checkpoint:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

No claim upgrade is permitted from object-construction-only evidence.

---

## 9. Next sprint

Recommended next approved sprint:

1. Resolve smart-account construction behavior deterministically (no accidental online/signing side effects).
2. Introduce controlled permit-shape assembly inputs.
3. Add explicit proof-capture scaffolding for `userOpHash`/`txHash` without broadening scope.
4. Run a single tiny, fully-audited sponsored operation only after separate approval.

---

## 10. Follow-up permit signature dry-run checkpoint

Subsequent artifact:

- `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_PERMIT_SIGNATURE_DRY_RUN.md`

That checkpoint verifies the local EIP-2612 signature + packed paymasterData path while preserving this boundary:

- no `sendUserOperation`
- no userOp submission
- no tx send/write
- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
