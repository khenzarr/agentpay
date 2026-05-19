# Circle Paymaster Official Docs Analysis — AgentPay (Arc Testnet)

## 1. Docs reviewed

- https://developers.circle.com/paymaster
- https://developers.circle.com/paymaster/pay-gas-fees-usdc
- https://developers.circle.com/paymaster/addresses-and-events
- Installed SDK/package surfaces:
  - `@circle-fin/developer-controlled-wallets` (types/error surface)
  - `@circle-fin/app-kit` (installed surface)

## 2. Paymaster architecture

- Circle Paymaster is documented as a **permissionless onchain token paymaster**.
- It is designed for **ERC-4337 account abstraction flows** (v0.7 and v0.8 variants).
- Core model: user operation executes via EntryPoint; paymaster charges USDC and settles gas path.
- Docs explicitly position this as paying gas in USDC rather than native token.

## 3. Arc Testnet support

Official `addresses-and-events` page includes Arc Testnet for both versions:

- **Paymaster v0.7 (ARC-TESTNET):** `0x31BE08D380A21fc740883c0BC434FcFc88740b58`
- **Paymaster v0.8 (ARC-TESTNET):** `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`

Status interpretation for this sprint:

- Documentation support: **confirmed**
- Runtime sponsorship proof in this repo: **NOT_CLAIMED**

## 4. EOA vs SCA/ERC-4337 requirement

- Official quickstart language is smart account / user operation centric.
- Official flow includes bundler + paymaster data for user operations.
- Therefore, treat Circle Paymaster usage as **SCA/ERC-4337 path required**.
- Existing AgentPay verified wallet is EOA; this is not sufficient for paymaster verification.

## 5. Relationship to Circle Wallets / Gas Station

From docs positioning:

- **Circle Paymaster**: permissionless onchain contract for users paying gas in USDC.
- **Circle Wallets Gas Station**: Circle Wallets feature for sponsorship/policy-based gas support.

Conclusion:

- They are related in outcome (gas UX) but **not the same product surface**.
- Paymaster can be integrated directly at ERC-4337 level without requiring Wallets Gas Station API path.

## 6. Required addresses/contracts/events

Contracts/doc entities that matter:

- Paymaster v0.7 + v0.8 contract addresses per chain.
- Arc Testnet addresses listed above.
- `TokenPaymasterV07.sol` and `TokenPaymasterV08.sol` event model:
  - `_validatePaymasterUserOp`
  - `_postOp`
  - event data includes fields such as token, sender address, nativeTokenPrice, actualTokenNeeded, feeTokenAmount.

## 7. Required env/config

Discovery-safe config (no live mutations in this sprint):

- Existing Circle server env (already in repo conventions):
  - `CIRCLE_API_KEY`
  - `CIRCLE_ENTITY_SECRET`
  - `CIRCLE_ENTITY_PUBLIC_KEY`
  - `CIRCLE_ENTITY_SECRET_CIPHER_TEXT`
- Network/context:
  - `ARC-TESTNET`
- Documentation placeholders for future implementation:
  - `CIRCLE_PAYMASTER_VERSION` (`v0.7` or `v0.8`)
  - `CIRCLE_PAYMASTER_ADDRESS_ARC_TESTNET`
  - optional policy identifiers for Wallets Gas Station path

## 8. Minimal proof path

For AgentPay paymaster verification in a later approved sprint:

1. Use SCA/ERC-4337 compatible wallet path (not existing EOA proof wallet).
2. Select paymaster version (`v0.7` or `v0.8`) and corresponding Arc Testnet address.
3. Preflight userOp with paymaster data generation and USDC allowance/permit logic.
4. Submit one tiny user operation on Arc Testnet with paymaster enabled.
5. Capture:
   - userOp hash
   - tx hash/finality
   - paymaster contract address used
   - onchain event evidence from paymaster contract
6. Only then upgrade claim status.

## 9. Implementation options

### App Kit path

- Best UX for app integration if App Kit exposes/aligns with required smart account + bundler + paymaster configuration surface.
- Still must preserve proof artifacts and claim boundary.

### Circle Wallets path

- Use Circle Wallets SCA + Gas Station/policy surface where available.
- Policy readiness is visible in console, but runtime proof remains pending.

### Raw ERC-4337 path

- Direct integration using bundler + userOp + paymaster contract addresses.
- Highest control and clearest protocol-level proof, but more implementation overhead.

## 10. Recommended AgentPay path

Recommended minimal-risk sequence:

1. Keep current statuses:
   - Paymaster: `NOT_CLAIMED`
   - Gasless: `NOT_CLAIMED`
2. Implement discovery-safe readiness checks for SCA/userOp prerequisites.
3. Prefer **App Kit / Wallets-assisted SCA path** first for operational speed, while retaining protocol evidence collection.
4. Execute one tiny sponsored/userOp proof only in next approved sprint.

## 11. Current blockers

- Existing verified wallet is EOA.
- No in-repo sponsored/paymaster runtime proof yet.
- Need explicit chosen path for v0.7 vs v0.8 implementation and toolchain details.
- Need final proof artifact schema for userOp + paymaster event capture.

## 12. Claim boundary

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`
- Arc Testnet paymaster docs support: **documented only**, not runtime-verified in this repo.

## 13. Master Prompt #23 planning checkpoint (discovery-only)

- New planning doc: `docs/grant/agentpay/SCA_PAYMASTER_PROOF_PATH_PLAN.md`
- Optional non-mutating readiness script: `scripts/circle-sca-paymaster-readiness.ts`
- Run command: `npm run circle:sca-paymaster:readiness`

Checkpoint outcome:

- `FEASIBLE_BUT_NEEDS_SCA_WALLET_CREATION`
- `FEASIBLE_BUT_NEEDS_RAW_ERC4337_PATH`
- `FEASIBLE_BUT_NEEDS_APP_KIT_PAYMASTER_PATH`
- `DO_NOT_CLAIM`

Status unchanged:

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

## 14. SCA wallet creation verification update (Master Prompt #24)

Developer-Controlled SCA wallet creation is now runtime-verified on `ARC-TESTNET`:

- Command: `npm run circle:wallets:create-sca:arc`
- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: 494ad75a-4d03-5021-9ddb-0c70cf566954`
- `walletAddress: 0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- `blockchain: ARC-TESTNET`
- `accountType: SCA`
- `state: LIVE`
- `responseStatus: success`

Allowed claim update:

- Circle Developer-Controlled SCA wallet creation verified on ARC-TESTNET.

Boundary remains strict:

- No sponsored transaction was executed.
- No Paymaster userOperation was executed.
- No gasless flow was executed.
- No token transfer was executed in this SCA creation step.
- No secrets were printed.
