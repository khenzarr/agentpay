# Circle Paymaster v0.8 + viem 7702 Dry-Run Architecture — Arc Testnet

## 1. Purpose

Define a **non-mutating** architecture path for adapting Circle Paymaster v0.8 with viem 7702 smart-account flow on Arc Testnet.

Scope in this sprint:

- architecture and readiness only
- no live transaction
- no sponsored userOperation
- no permit signing
- no token transfer

Status boundary:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Why v0.8 7702 path is now preferred over Wallets SDK path

Observed evidence in repo history shows prior Wallets SDK sponsored-transfer attempts did not produce deterministic proof artifacts required for paymaster claims (notably missing reliable `userOpHash`/paymaster-correlation outputs).

Circle v0.8 quickstart findings now indicate:

- account path uses `toSimple7702SmartAccount`
- bundler path uses `createBundlerClient`
- paymaster data can be built locally via permit-based packing in `getPaymasterData()`

Therefore, the preferred architecture direction for deterministic proof readiness is the documented viem account-abstraction route.

---

## 3. Current verified foundation

- Network baseline known:
  - `chainId=5042002`
  - `rpc=https://rpc.testnet.arc.network`
  - explorer: `https://testnet.arcscan.app`
- Circle Paymaster Arc Testnet addresses known:
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`
- Installed local viem support confirmed:
  - `toSimple7702SmartAccount`
  - `createBundlerClient`
  - `createPaymasterClient`
  - `sendUserOperation`
  - `waitForUserOperationReceipt`
  - `encodePacked`

---

## 4. Required components

1. **Arc Testnet chain config**
   - fixed dry-run defaults for chain id, rpc, and symbol context
2. **viem account/client baseline**
   - wallet/public clients for future deterministic AA flow
3. **7702 smart account path**
   - `toSimple7702SmartAccount` expected path
4. **bundler client**
   - `createBundlerClient`
   - requires `ARC_BUNDLER_RPC_URL`
5. **local paymasterData builder**
   - permit-signature + packed data strategy per v0.8 docs
6. **Circle Paymaster v0.8 address**
   - `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`

---

## 5. Paymaster data local permit flow

Documented v0.8 shape (architecture level):

1. Build EIP-2612 permit typed data for USDC
2. Sign permit (future approved sprint only)
3. Pack paymaster payload:
   - `encodePacked(["uint8","address","uint256","bytes"], [0, usdcAddress, permitAmount, permitSignature])`
4. Return paymaster fields:
   - `paymaster`
   - `paymasterData`
   - `paymasterVerificationGasLimit`
   - `paymasterPostOpGasLimit`
   - `isFinal`

This sprint does **not** perform signing or packing against a live account.

---

## 6. Bundler requirement

Bundler is still mandatory for ERC-4337 flow orchestration.

- Required env: `ARC_BUNDLER_RPC_URL`
- Without bundler RPC, deterministic userOperation execution/proof path cannot start.

---

## 7. Proof artifact plan

Future proof sprint should capture, at minimum:

1. `sendUserOperation` submission output
2. `userOpHash`
3. `waitForUserOperationReceipt` output
4. final receipt `transactionHash`
5. paymaster address and paymaster-relevant fields/log correlation
6. EntryPoint version/address context
7. network marker (`ARC-TESTNET`)

---

## 8. Why no claim yet

No runtime sponsored userOperation is executed in this sprint.

Missing required proof artifacts means claim boundary cannot change.

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 9. Current blockers

1. Bundler RPC still required at runtime (`ARC_BUNDLER_RPC_URL`)
2. 7702 account path must be wired in implementation sprint
3. Permit signing path for paymasterData still dry-run only
4. Existing Circle-created SCA compatibility with quickstart 7702 model still requires runtime confirmation

---

## 10. Go/no-go checklist

### GO only if

- [ ] `ARC_BUNDLER_RPC_URL` is configured and validated
- [ ] EntryPoint version/address config is complete (`v0.8` target)
- [ ] 7702 account construction path is implemented and testable
- [ ] permit-signing path is approved and safely isolated
- [ ] proof artifact capture pipeline is in place

### NO-GO if

- [ ] bundler is missing
- [ ] EntryPoint configuration is missing
- [ ] signing path remains undefined
- [ ] proof artifacts cannot be captured deterministically

---

## 11. Next implementation sprint

1. Keep dry-run guardrails but implement full 7702 account wiring
2. Implement isolated permit-signing adapter (server-only)
3. Integrate bundler client with explicit no-broadcast safety toggles until approval
4. Execute one approved tiny sponsored operation only after explicit go-ahead
5. Capture and archive deterministic proof artifacts
6. Re-evaluate claim boundary

---

## Classification

- `FEASIBLE_PAYMASTER_DATA_LOCAL_PERMIT_PATH`
- `FEASIBLE_BUT_NEEDS_7702_ACCOUNT_PATH`
- `FEASIBLE_BUT_NEEDS_BUNDLER_RPC`
- `FEASIBLE_BUT_NEEDS_PERMIT_SIGNING_DRY_RUN`
- `DO_NOT_CLAIM`

---

## 12. Account construction dry-run checkpoint (Master Prompt #32)

- Added script: `scripts/circle-paymaster-v08-7702-account-dry-run.ts`
- Added command: `npm run circle:paymaster:v08-7702:account-dry-run`
- Added report: `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_7702_ACCOUNT_DRY_RUN.md`

Local installed-type findings recorded:

- `toSimple7702SmartAccount` import path: `viem/account-abstraction`
- `entryPoint07Address`/`entryPoint08Address` import path: `viem/account-abstraction`
- `defineChain` import path: `viem`
- `toSimple7702SmartAccount` requires `owner: PrivateKeyAccount`

Safety result in this checkpoint:

- No account construction invocation (signer required)
- No signing
- No userOperation submission
- No network/bundler call

Claim boundary unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
