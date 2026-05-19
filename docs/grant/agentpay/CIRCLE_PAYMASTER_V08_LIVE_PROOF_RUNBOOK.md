# Circle Paymaster v0.8 Live Proof — Final Runbook

## 1. Purpose

Provide a controlled execution runbook for a future Circle Paymaster v0.8 sponsored UserOperation live proof attempt.

This runbook is documentation-only in this sprint. No live proof is executed here.

Current status boundary:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

---

## 2. Preconditions

All of the following must be true before any live attempt:

1. Founder explicit approval is granted for one tiny live proof attempt.
2. Safety checklist is completed:
   - `docs/grant/agentpay/CIRCLE_PAYMASTER_V08_LIVE_PROOF_FINAL_CHECKLIST.md`
3. Verified readiness baseline remains valid:
   - owner address matched
   - Arc Testnet chainId `5042002`
   - bundler healthy
   - EntryPoint v0.8 and paymaster addresses unchanged
4. Claim boundary remains pre-run:
   - Paymaster `NOT_CLAIMED`
   - Gasless `NOT_CLAIMED`

---

## 3. Local env requirements

Server-only local env must be present and valid.

Required categories:

1. Owner signing inputs (never printed)
2. Arc bundler/public RPC inputs
3. Circle paymaster + USDC address inputs
4. Explicit live-proof guard flags for the approved script path

Required live-proof guards (all must match exactly):

- `CIRCLE_PAYMASTER_LIVE_PROOF_APPROVED=true`
- `CIRCLE_PAYMASTER_LIVE_PROOF_EXECUTE=true`
- `CIRCLE_PAYMASTER_LIVE_PROOF_MAX_ATTEMPTS=1`

Important env-mode rule:

- Keep `RAW_ERC4337_DRY_RUN=true` for dry-run/readiness commands.
- Live-proof gating is controlled by the three `CIRCLE_PAYMASTER_LIVE_PROOF_*` flags above.

Security requirements:

- never print private keys
- never print secret values
- never print full signatures
- do not expose `.env.circle.local` secret content in logs/docs

Only public addresses may appear in documentation.

---

## 4. Pre-run validation commands

Run non-mutating readiness checks before any live attempt window:

1. `npm run circle:paymaster:v08-7702:owner-readiness`
2. `npm run circle:paymaster:v08-7702:bundler-health`
3. `npm run circle:paymaster:v08:permit-input-readiness`
4. `npm run circle:paymaster:v08:userop-assembly-dry-run`

Interpretation:

- any mismatch, missing marker, or unhealthy endpoint => `NO-GO`
- proceed only if all required markers pass and safety boundaries hold

---

## 5. Live run command placeholder

Placeholder only (not created/executed in this sprint):

`npm run circle:paymaster:v08:live-proof`

This command is reserved for a separate explicitly approved execution sprint.

---

## 6. What success must output

A successful live proof must capture and persist all required deterministic artifacts:

1. `userOpHash`
2. sponsored `txHash`
3. final receipt/finality evidence
4. paymaster address used
5. EntryPoint version/address used
6. userOp receipt correlation data
7. paymaster event/log correlation
8. sponsored fee evidence
9. network marker (`ARC-TESTNET`)

If any artifact is missing, success is not claim-eligible.

---

## 7. What failure means

Failure includes any of:

1. submission failure
2. finality failure
3. missing/ambiguous artifact correlation
4. safety boundary breach

On failure:

- classify run as non-claimable
- preserve status:
  - Paymaster `NOT_CLAIMED`
  - Gasless `NOT_CLAIMED`
- document errors without exposing secrets

---

## 8. Artifact capture format

Recommended structured capture template:

```md
## Circle Paymaster v0.8 live proof artifact record
- date/time (UTC):
- network: ARC-TESTNET
- entryPointVersion: v0.8
- entryPointAddress: 0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108
- paymasterAddress: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966
- userOpHash:
- txHash:
- receiptStatus/finality:
- paymaster-log-correlation:
- sponsored-fee-evidence:
- notes:
```

Redaction rules:

- never include private key
- never include secret env values
- never include full raw signature if avoidable

---

## 9. Post-run documentation update plan

After a future approved live run:

1. Update proof artifact docs with deterministic output.
2. Update `PROOF_REGISTRY.md` with exact artifact references.
3. Re-evaluate claim boundary only after complete evidence review.
4. Keep `NOT_CLAIMED` if any artifact requirement is unmet.

---

## 10. Rollback / safety notes

- Do not run repeated live attempts by default.
- If first attempt fails, pause and review logs/artifacts before any retry decision.
- Any retry requires explicit founder re-approval.
- No unrelated code or infra changes during proof window.

---

## 11. Claim boundary

This runbook does not upgrade claims.

Current boundary remains:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
- Classification: `DO_NOT_CLAIM` until full artifact set is captured in an approved live run.

---

## 12. Read-only deployment verification prerequisite

Before any future live retry, execute:

- `npm run circle:paymaster:deployment-check`

Reference:

- `docs/grant/agentpay/CIRCLE_PAYMASTER_DEPLOYMENT_READONLY_CHECK.md`

If output includes `DIAGNOSTIC_PAYMASTER_V08_NOT_DEPLOYED`, treat v0.8 live proof path as blocked until deployment/address alignment is resolved.
