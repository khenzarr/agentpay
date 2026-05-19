# SCA / ERC-4337 Paymaster Proof Path Plan — AgentPay (Arc Testnet)

## 1) Purpose

Define the exact, conservative implementation path for producing a **future** Circle Paymaster sponsored-transaction proof on `ARC-TESTNET`, without running any mutation in this sprint.

This document is discovery + planning only.

---

## 2) Current verified foundation

- Arc Testnet execution: `CURRENT_VERIFIED`
- USDC escrow lifecycle: `CURRENT_VERIFIED`
- App Kit Send: `CURRENT_VERIFIED`
- Bridge/CCTP: `CURRENT_VERIFIED`
- Circle Wallets wallet creation/read: `CURRENT_VERIFIED`
- Circle Wallets SCA wallet creation: `CURRENT_VERIFIED` (Developer-Controlled SCA wallet created on ARC-TESTNET)
- Circle Wallets message signing: `CURRENT_VERIFIED`
- Circle Wallets live tiny transfer/send: `CURRENT_VERIFIED`
- Gateway/Unified Balance: `CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED`

SCA creation proof (wallet creation only; no sponsorship flow):

- Command: `npm run circle:wallets:create-sca:arc`
- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: 494ad75a-4d03-5021-9ddb-0c70cf566954`
- `walletAddress: 0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- `blockchain: ARC-TESTNET`
- `accountType: SCA`
- `state: LIVE`
- `responseStatus: success`
- No sponsored transaction executed, no Paymaster userOp executed, no token transfer executed, no secrets printed.

Unchanged boundaries:

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

---

## 3) Why existing EOA wallet is insufficient

Existing wallet is:

- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `accountType: EOA`
- `blockchain: ARC-TESTNET`

Circle Paymaster docs are userOperation/smart-account centric. ERC-4337 sponsorship proof requires SCA/userOp-level evidence, not plain EOA transfer evidence.

Therefore current EOA proof does **not** satisfy Paymaster proof requirements.

---

## 4) SCA wallet requirement

### SDK/doc evidence

- Installed SDK (`@circle-fin/developer-controlled-wallets`) exposes `AccountType` enum values:
  - `"SCA"`
  - `"EOA"`
- Account creation docs in SDK types explicitly describe EOA vs SCA and default to EOA if not specified.
- Error surface includes SCA/policy-specific messages (including paymaster-policy eligibility language), reinforcing that SCA/policy path is a real gate.

### Conclusion

For claimable paymaster proof, treat **SCA as required** path.

---

## 5) SCA creation options

### A) Circle Wallets SCA path

- Use `createWallets` with `accountType: "SCA"` on `ARC-TESTNET`.
- Most direct continuation from existing Circle Wallets integration.
- Likely depends on Console paymaster/gas station policy eligibility.

Status now: `CURRENT_VERIFIED` for SCA wallet creation only.

Important boundary:

- This does **not** verify Paymaster.
- This does **not** verify gasless transaction flow.
- This does **not** verify sponsored userOperation execution.
- This does **not** verify full ERC-4337 integration.

### B) App Kit path

- Installed `@circle-fin/app-kit` surface confirms Arc chain support and send/spend flows.
- No explicit Paymaster-specific method/config found in inspected type surface.
- App Kit “gasless” references are permit-style token approval (EIP-2612/EIP-3009 semantics), not explicit ERC-4337 paymaster orchestration.

Status now: `FEASIBLE_BUT_NEEDS_APP_KIT_PAYMASTER_PATH`

### C) Raw ERC-4337 path

- Installed `viem` includes account-abstraction clients/actions for:
  - bundler client
  - paymaster client
  - userOperation hash/receipt utilities
  - EntryPoint versioned types (`0.6`/`0.7`/`0.8`/`0.9`)
- `wagmi` surface did not expose dedicated ERC-4337/paymaster helpers in this repo’s installed types.

Status now: `FEASIBLE_BUT_NEEDS_RAW_ERC4337_PATH`

---

## 6) Paymaster version decision

Arc Testnet official paymaster addresses:

- v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`
- v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`

### v0.7 vs v0.8 recommendation

Recommend **v0.8** as default target for next sprint:

1. Newer 4337 version alignment for fresh implementation.
2. Installed `viem` supports both cleanly, so fallback to v0.7 remains available.
3. Existing readiness placeholder already points to v0.8 in sprint guidance.

Conservative fallback: if runtime/provider compatibility blocks v0.8 on Arc Testnet, retry on v0.7 and document reason.

---

## 7) Minimal sponsored transaction options

Goal is smallest-risk proof transaction that still yields strong sponsorship evidence.

1. **Tiny USDC transfer** from SCA to controlled recipient (preferred)
   - operationally familiar in repo
   - easiest to reason about proof trail
2. Benign contract call (e.g., no-op style method) if transfer path unavailable
3. Self-transfer/tiny transfer variant if policy allows

Recommended first proof candidate: **tiny USDC transfer** with smallest allowed amount.

---

## 8) Required config/env vars (server-only)

Baseline existing:

- `CIRCLE_API_KEY`
- `CIRCLE_ENTITY_SECRET`
- `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`

Future placeholders for proof sprint:

- `CIRCLE_SCA_WALLET_ID`
- `CIRCLE_SCA_WALLET_ADDRESS`
- `CIRCLE_PAYMASTER_VERSION=v0.8`
- `CIRCLE_PAYMASTER_ADDRESS=0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- `CIRCLE_GASLESS_DRY_RUN=true`
- optional: `CIRCLE_GAS_STATION_POLICY_ID` / `CIRCLE_PAYMASTER_POLICY_ID`

Never expose secrets in public env; never print secrets.

---

## 9) Required proof artifacts

Minimum required evidence for claim upgrade:

1. `userOpHash`
2. onchain `transactionHash`
3. `paymaster` address actually used
4. relevant event logs (EntryPoint + paymaster events where available)
5. final status/finality
6. sponsored fee/token amount evidence (e.g., paymaster/event fields)
7. chain/network marker (`ARC-TESTNET`)
8. statement that no secrets were exposed

Until all are captured: remain `NOT_CLAIMED`.

---

## 10) Recommended implementation sequence

1. Keep status unchanged (`NOT_CLAIMED`).
2. Add/execute non-mutating readiness checks only.
3. Confirm Console policy prerequisites and non-secret IDs.
4. Create SCA wallet in dedicated approved sprint.
5. Choose path order:
   - first: Circle Wallets SCA path (fastest continuity)
   - fallback: raw viem ERC-4337 path (maximum protocol control/evidence)
   - App Kit path only if explicit paymaster surface is confirmed
6. Run one tiny sponsored tx in approved proof sprint.
7. Capture artifacts + update proof registry.
8. Only then upgrade claims.

---

## 11) Risk matrix

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| EOA used instead of SCA | invalid proof claim | high | hard-gate on `accountType === SCA` |
| Policy eligibility mismatch | tx rejection | medium | confirm Console policy + IDs before proof run |
| v0.8 runtime incompatibility | delay | low-medium | fallback to v0.7 with documented rationale |
| Missing artifact capture | non-auditable claim | medium | predefine artifact checklist before execution |
| Secret leakage | security incident | low | server-only scripts, redaction, no public env |

---

## 12) Claim boundary

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`
- Classification for this sprint: `DO_NOT_CLAIM`

---

## 13) Go / no-go criteria

### GO only if

- SCA wallet exists and is confirmed on `ARC-TESTNET`
- paymaster version/address selected and documented
- policy prerequisites confirmed
- full artifact capture pipeline ready

### NO-GO if

- only EOA path available
- sponsorship/policy runtime remains unclear
- proof artifacts cannot be captured deterministically

---

## Discovery answers to Task A (explicit)

1. **SCA on ARC-TESTNET support (SDK surface):** likely supported; SDK supports `ARC-TESTNET` blockchain and `SCA` accountType with SCA-specific errors/paths.
2. **Required accountType value:** `"SCA"`.
3. **Wallets SDK gasless/sponsored behavior exposure:** no simple explicit “sponsored tx” helper confirmed from current repo script usage; policy/SCA-dependent behavior is implied by errors/docs.
4. **App Kit Paymaster-specific methods/config:** not found in inspected types.
5. **App Kit direct Arc Paymaster support:** not explicitly exposed in inspected App Kit surface.
6. **Paymaster intent:** yes, docs indicate raw ERC-4337 userOperation flow.
7. **Repo viem/wagmi readiness for userOp proof:** viem is sufficient (bundler/paymaster/userOp utilities); wagmi not primary for this proof path.
8. **EntryPoint target:** recommend v0.8 first, fallback v0.7.
9. **Proof evidence needed:** userOpHash, tx hash, paymaster address, logs/events, final status, sponsored fee amount evidence.
10. **Safest minimal sponsored tx:** tiny USDC transfer from SCA wallet.

---

## Final classification (this sprint)

- `FEASIBLE_BUT_NEEDS_SCA_WALLET_CREATION`
- `FEASIBLE_BUT_NEEDS_RAW_ERC4337_PATH`
- `FEASIBLE_BUT_NEEDS_APP_KIT_PAYMASTER_PATH`
- `DO_NOT_CLAIM`

---

## Master Prompt #25 update (dry-run readiness implemented)

- New script: `scripts/circle-paymaster-sponsored-transfer.ts`
- Command: `npm run circle:paymaster:sponsored-transfer`
- Mode executed: dry-run only (`CIRCLE_PAYMASTER_DRY_RUN=true`)
- Mutation performed: none
- Secrets printed: none

Dry-run output checkpoint:

- `scaWalletId: 494ad75a-4d03-5021-9ddb-0c70cf566954`
- `scaWalletAddress: 0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- `blockchain: ARC-TESTNET`
- `paymasterVersion: v0.8`
- `paymasterAddress: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- `tokenId: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `destinationAddress: 0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
- `amount: 0.001`
- `gasStationPolicyIdPresent: no`

Safety boundary remains unchanged:

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

Reason:

- No live sponsored transaction/userOperation proof captured yet.
- Wallets SDK `createTransaction` response surface does not explicitly guarantee paymaster/userOp evidence fields.
- Final proof still requires userOp/paymaster correlation (tx hash + userOpHash if present + onchain/console evidence).
