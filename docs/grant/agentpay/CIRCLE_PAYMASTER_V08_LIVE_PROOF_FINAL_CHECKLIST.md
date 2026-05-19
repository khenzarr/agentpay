# Circle Paymaster v0.8 Live Proof â€” Final Safety Checklist

## 1. Purpose

Define the final pre-flight safety and readiness checklist required **before** any live Circle Paymaster v0.8 sponsored UserOperation proof attempt on Arc Testnet.

This document is readiness-only and does not execute any live action.

Current status boundary:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Current verified readiness foundation

Verified/known readiness baseline:

- owner readiness verified
- ownerAddress: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- expectedAddressMatched: `yes`
- Arc Testnet chainId: `5042002`
- bundler health: `healthy`
- EntryPoint v0.8 supported: `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108`
- Circle Paymaster v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- USDC token: `0x3600000000000000000000000000000000000000`
- tokenName: `USDC`
- tokenVersion: `2`
- tokenDecimals: `6`
- ownerBalance previously verified: `38.949047 USDC`
- permit amount target: `0.01 USDC`
- test transfer amount target: `0.001 USDC`
- smartAccountConstruction: `success`
- transferCalldataPresent: `yes`
- permitSignaturePresent: `yes` (local dry-run signature path only)
- paymasterDataEncoded: `yes`
- userOpAssemblyStatus: `DRY_RUN_READY_NO_SUBMISSION`

Known missing live-proof artifacts:

- `userOpHash`
- `txHash`
- UserOperation receipt/finality evidence
- paymaster event/log correlation
- sponsored fee evidence

---

## 3. Live proof scope

If explicitly approved, live proof scope is strictly:

1. Exactly one tiny sponsored UserOperation on Arc Testnet.
2. Deterministic artifact capture (`userOpHash`, `txHash`, finality, logs, sponsored fee evidence).
3. Documentation-only claim boundary re-evaluation after full artifact capture.

---

## 4. Live proof non-goals

Out of scope for live proof:

- feature expansion or refactor
- frontend/ABI/escrow changes
- integration downgrades/upgrades not backed by full artifacts
- additional wallet lifecycle operations
- broad transaction testing beyond one minimal operation

---

## 5. Wallet/key safety checklist

- [ ] Private key is loaded only from local server env and never printed.
- [ ] No secret env values are echoed to terminal/logs.
- [ ] No full signature is printed (only short prefix if needed).
- [ ] No new wallet creation commands are executed.
- [ ] No token approval transaction is executed.
- [ ] No permit signing outside approved execution path.

---

## 6. Network and bundler checklist

- [ ] Confirm chain is Arc Testnet (`chainId=5042002`).
- [ ] Confirm bundler endpoint is reachable and healthy.
- [ ] Confirm supported EntryPoint list includes v0.8 address.
- [ ] Confirm public RPC is available for finality/log capture.

---

## 7. EntryPoint and Paymaster checklist

- [ ] Run read-only deployment check: `npm run circle:paymaster:deployment-check`.
- [ ] If `DIAGNOSTIC_PAYMASTER_V08_NOT_DEPLOYED` appears, mark v0.8 path as blocked (`NO-GO`) until deployment/address alignment is resolved.
- [ ] EntryPoint version fixed to `v0.8`.
- [ ] EntryPoint address fixed to `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108`.
- [ ] Paymaster address fixed to `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`.
- [ ] Paymaster data path uses validated local encoding format.
- [ ] Sponsorship evidence can be extracted from receipt/log path.

---

## 8. USDC / permit checklist

- [ ] USDC token address is `0x3600000000000000000000000000000000000000`.
- [ ] Token metadata expectation unchanged (`USDC`, version `2`, decimals `6`).
- [ ] Permit value is bounded to tiny test amount (`0.01` USDC baseline).
- [ ] Transfer amount is tiny (`0.001` USDC baseline).
- [ ] Permit deadline logic is defined and bounded.
- [ ] Permit signature handling remains masked in logs.

---

## 9. UserOperation checklist

- [ ] UserOperation request is assembled with v0.8 compatible fields.
- [ ] `callData` corresponds only to minimal test transfer scope.
- [ ] `paymasterData` is present and encoded.
- [ ] Submission path is explicitly controlled and auditable.
- [ ] Receipt wait and retrieval strategy is defined.

---

## 10. Proof artifact checklist

Required for any future claim reconsideration:

- [ ] `userOpHash`
- [ ] sponsored `txHash`
- [ ] final receipt/finality result
- [ ] paymaster address used in execution context
- [ ] EntryPoint version and address used
- [ ] userOp receipt correlation data
- [ ] paymaster event/log correlation evidence
- [ ] sponsored fee evidence (token/native fields as available)
- [ ] network marker: `ARC-TESTNET`

If any artifact is missing, remain `NOT_CLAIMED`.

---

## 11. Failure handling checklist

- [ ] If submission fails or artifacts are incomplete, classify as failed proof attempt.
- [ ] Capture error payloads and structured logs (without secrets).
- [ ] Do not broaden scope with additional live retries in same window unless explicitly re-approved.
- [ ] Preserve claim boundary as `NOT_CLAIMED`.

---

## 12. Claim boundary before proof

Mandatory pre-proof status:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
- Classification: `DO_NOT_CLAIM`

---

## 13. Claim boundary after possible proof

Only reconsider claim status if and only if full deterministic artifact set is captured and documented.

Otherwise unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 14. Exact go/no-go criteria

### GO only if all are true

1. Founder explicitly approves a single tiny live proof run.
2. All pre-flight checks in this document pass.
3. Submission + finality + artifact capture path is confirmed end-to-end.
4. Safety boundaries (no secret exposure, no uncontrolled extra actions) are enforceable.

### NO-GO if any are true

1. Founder approval is missing.
2. Bundler/RPC/EntryPoint readiness is degraded.
3. Artifact capture plan is incomplete.
4. Any safety rule would be violated.

---

## 15. Founder approval requirement

Live proof is blocked until explicit founder approval is provided for:

1. one controlled tiny sponsored UserOperation,
2. artifact capture and documentation update,
3. post-run claim-boundary review.

Without explicit approval, no live run is allowed.

Live-proof script gates must all match exactly before any submission path is allowed:

1. `CIRCLE_PAYMASTER_LIVE_PROOF_APPROVED=true`
2. `CIRCLE_PAYMASTER_LIVE_PROOF_EXECUTE=true`
3. `CIRCLE_PAYMASTER_LIVE_PROOF_MAX_ATTEMPTS=1`

If any gate is not exact, run is blocked and no userOp submission is allowed.

Dry-run/readiness note:

- keep `RAW_ERC4337_DRY_RUN=true` for readiness and dry-run commands
- live-proof allow/deny is controlled by the explicit live-proof flags above

---

## 16. Recommended live proof command placeholder

Placeholder only (not executed in this sprint):

`npm run circle:paymaster:v08:live-proof`

This sprint remains docs/readiness only.

---

## Arc Testnet Circle Paymaster Support Boundary (Correction)

- Circle Paymaster official supported chains do not currently include Arc Testnet.
- The Arc Testnet Paymaster path is blocked by unsupported/missing Circle Paymaster deployment, not by AgentPay client-side readiness.
- EntryPoint and bundler readiness on Arc Testnet are verified/readiness-only, but Circle Paymaster/Gasless remains NOT_CLAIMED.
- No claim should state that Circle Paymaster is live or supported on Arc Testnet.

Final status:

- Paymaster: NOT_CLAIMED
- Gasless: NOT_CLAIMED

Classification:

- BLOCKED_CIRCLE_PAYMASTER_ARC_NOT_SUPPORTED
- BLOCKED_PAYMASTER_CONTRACT_NOT_DEPLOYED_ON_ARC_TESTNET
- READINESS_COMPLETE_CLIENT_SIDE
- DO_NOT_CLAIM

