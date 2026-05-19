# Circle Paymaster v0.8 7702 Account Construction Dry Run (Arc Testnet)

## 1. Purpose

This checkpoint adds a **non-mutating** local dry-run script to validate the viem 7702 account-construction path shape for Arc Testnet without signing, broadcasting, wallet creation, userOp submission, or secret usage.

Boundary remains:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Import/signature findings

From installed local viem types:

- `toSimple7702SmartAccount` import path: `viem/account-abstraction`
- `entryPoint07Address` import path: `viem/account-abstraction`
- `entryPoint08Address` import path: `viem/account-abstraction`
- `defineChain` import path: `viem`

Observed construction signature requirements for `toSimple7702SmartAccount`:

- required: `client`
- required: `owner: PrivateKeyAccount`
- optional: `entryPoint`
- optional: `implementation`
- optional: `getNonce`

Conclusion:

- A real owner signer (`PrivateKeyAccount`) is required to actually construct the account.
- This sprint intentionally does **not** construct the account object.

---

## 3. Arc Testnet chain object

Dry-run script defines Arc Testnet locally via `defineChain`:

- `chainId: 5042002`
- `rpcUrl: https://rpc.testnet.arc.network`
- `explorer: https://testnet.arcscan.app`
- `nativeCurrency: USDC`

No network call is made.

---

## 4. 7702 smart account construction requirements

Future real construction requires all of:

1. owner account (`PrivateKeyAccount`)
2. public client
3. optional explicit EntryPoint selection/addressing
4. `toSimple7702SmartAccount({ client, owner, ... })`

Related AA runtime path also includes:

- `createBundlerClient`
- local paymaster data builder
- `sendUserOperation`
- `waitForUserOperationReceipt`

---

## 5. Why no signer is used yet

This sprint is compile/typecheck + dry-run only.

Safety constraints prohibit:

- private keys / seed phrases
- signing operations
- live userOp submission
- any transaction/broadcast action

So we only inspect imports/type-shape and print requirements.

---

## 6. Future real construction path

Intended future architecture sequence:

1. owner account
2. public client
3. bundler client
4. paymaster data builder
5. `toSimple7702SmartAccount`
6. `sendUserOperation`
7. `waitForUserOperationReceipt`

---

## 7. Current blockers

1. no owner signer configured
2. no bundler URL
3. no final EntryPoint address/version runtime wiring
4. no live proof artifacts yet

---

## 8. Proof boundary

No runtime proof artifact is produced in this checkpoint.

Status remains unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 9. Next sprint

1. add approved owner-signer path (server-only)
2. wire bundler URL and EntryPoint config
3. construct 7702 account in controlled runtime path
4. execute one approved tiny sponsored userOp
5. capture deterministic artifacts (`userOpHash`, receipt, `txHash`, paymaster evidence)
6. re-evaluate claim boundary

---

## 10. Owner signer readiness checkpoint (Master Prompt #33)

- Added script: `scripts/circle-paymaster-v08-7702-owner-readiness.ts`
- Added command: `npm run circle:paymaster:v08-7702:owner-readiness`
- Added doc: `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_7702_OWNER_READINESS.md`

Safety posture in this checkpoint:

- no network calls
- no signing
- no userOperation submission
- no transactions

Owner-readiness findings recorded:

- owner account helper: `privateKeyToAccount` from `viem/accounts`
- owner address can be derived locally from private key without signing
- script enforces `PAYMASTER_7702_OWNER_DRY_RUN=true`
- script rejects placeholder/private-key mismatch scenarios

Claim boundary unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 11. Verified owner readiness output checkpoint (Master Prompt #34)

Command executed:

- `npm run circle:paymaster:v08-7702:owner-readiness`

Verified readiness output:

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

- private key never printed
- no signing occurred
- no network call occurred
- no userOperation was submitted
- no transaction was sent

Classification for this checkpoint:

- `verified / readiness-only`
- not a runtime sponsored proof
