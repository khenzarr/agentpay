# Circle Paymaster v0.8 Full UserOp Assembly Dry-Run (Arc Testnet)

## 1. Purpose

Assemble the full Circle Paymaster v0.8 / viem 7702 UserOperation **inputs and local payloads** in dry-run mode only, without submitting any userOperation.

Status boundary:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Safety boundary

Script:

- `scripts/circle-paymaster-v08-userop-assembly-dry-run.ts`

Command:

- `npm run circle:paymaster:v08:userop-assembly-dry-run`

Hard non-actions in this checkpoint:

- no `sendUserOperation`
- no `waitForUserOperationReceipt`
- no bundler mutation methods
- no `writeContract`
- no `sendTransaction`
- no token approvals
- no wallet creation
- no private key printing
- no secret env printing

---

## 3. Inputs used

Required env:

- `PAYMASTER_7702_OWNER_PRIVATE_KEY`
- `PAYMASTER_7702_OWNER_EXPECTED_ADDRESS`
- `ARC_BUNDLER_RPC_URL`
- `RAW_ERC4337_DRY_RUN=true`
- `CIRCLE_PAYMASTER_ADDRESS`
- `CIRCLE_PAYMASTER_USDC_ADDRESS`

Optional env:

- `CIRCLE_PAYMASTER_TEST_TRANSFER_TO` (defaults to owner for self-transfer)
- `CIRCLE_PAYMASTER_TEST_TRANSFER_AMOUNT` (default `0.001`)

Fixed/known runtime constants in this checkpoint:

- `chainId=5042002`
- `entryPointVersion=v0.8`
- `entryPointAddress=0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108`

---

## 4. Client/account construction

The script constructs:

1. Arc Testnet chain object (`defineChain`)
2. `publicClient` (Arc RPC)
3. `bundlerClient` (bundler URL present check and client construction)
4. owner account (`privateKeyToAccount`)
5. smart account (`toSimple7702SmartAccount`)

Guardrails:

- owner/expected address mismatch throws
- invalid address/private key throws
- `RAW_ERC4337_DRY_RUN` must be strict `true`

---

## 5. Transfer calldata assembly

USDC transfer calldata is assembled locally with:

- `encodeFunctionData` for `transfer(address,uint256)`

Transfer target:

- env `CIRCLE_PAYMASTER_TEST_TRANSFER_TO`
- fallback to owner address (self-transfer)

Transfer amount:

- env `CIRCLE_PAYMASTER_TEST_TRANSFER_AMOUNT`
- default `0.001`
- converted using USDC decimals (`6` expected on Arc Testnet address)

---

## 6. Permit signature + paymasterData assembly

Read-only permit inputs:

- `name()`
- `decimals()`
- `nonces(owner)`
- optional `version()` fallback to `2`

Local EIP-2612 signature:

- `Permit(owner, spender, value, nonce, deadline)` typed data
- `spender = CIRCLE_PAYMASTER_ADDRESS`
- `value = permitAmountRaw` (`0.01` USDC => `10000` raw at 6 decimals)
- local signing only; no broadcast

Paymaster data encoding:

- `encodePacked(["uint8","address","uint256","bytes"], [0, usdcAddress, permitAmountRaw, permitSignature])`

---

## 7. What was assembled

Output markers include:

- `ownerAddress`
- `expectedAddressMatched=yes`
- `smartAccountConstruction=success`
- `transferTo`
- `transferAmount`
- `transferAmountRaw`
- `transferCalldataPresent=yes`
- `permitSignaturePresent=yes`
- `permitSignatureLength`
- `paymasterDataEncoded=yes`
- `paymasterDataLength`
- `paymasterAddress`
- `entryPointVersion=v0.8`
- `entryPointAddress`
- `bundlerUrlPresent=yes`
- `userOpAssemblyStatus=DRY_RUN_READY_NO_SUBMISSION`
- `signingExecuted=permit_only_local`
- `sendUserOperationCalled=false`

UserOperation request object handling:

- `userOperationRequestObject=not_constructed_to_avoid_submission`

---

## 8. What was not submitted

Confirmed non-actions:

- no userOp submission
- no `sendUserOperation`
- no receipt waiting
- no transaction send/write
- no token approval

Boundary markers:

- `transactions=false`
- `approvals=false`

---

## 9. Remaining proof artifacts

Still missing for claim-eligible verification:

1. `userOpHash`
2. sponsored `txHash`
3. userOp receipt/finality evidence
4. paymaster event/log correlation
5. sponsored fee evidence

---

## 10. Claim boundary

Unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

Classification:

- `DO_NOT_CLAIM`

---

## 11. Next sprint

Recommended next approved sprint:

1. Controlled single tiny sponsored submission with explicit approval.
2. Capture deterministic artifacts (`userOpHash`, `txHash`, final receipt/logs).
3. Correlate paymaster + EntryPoint + fee evidence in proof docs.
4. Re-evaluate claim boundary only after full artifact capture.