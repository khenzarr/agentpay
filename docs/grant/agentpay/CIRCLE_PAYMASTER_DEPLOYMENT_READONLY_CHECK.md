# Circle Paymaster Deployment Read-Only Check (Arc Testnet)

## 1. Purpose

Capture a strict read-only onchain deployment/code-presence verification for Circle Paymaster and EntryPoint addresses on Arc Testnet, after a failed v0.8 live proof attempt.

This checkpoint is diagnostics-only.

## 2. Previous live blocker

- proofStatus: `FAILED_BEFORE_USEROPHASH`
- error: `AA30 paymaster not deployed`
- userOpHash: `N/A`
- txHash: `N/A`
- receipt: `N/A`

## 3. Addresses checked

- Arc Testnet RPC: `https://rpc.testnet.arc.network`
- EntryPoint v0.8: `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108`
- EntryPoint v0.7: `0x0000000071727De22E5E9d8BAf0edAc6f37da032`
- Circle Paymaster v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- Circle Paymaster v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`

## 4. Read-only method

Command:

`npm run circle:paymaster:deployment-check`

Script:

- `scripts/circle-paymaster-deployment-readonly-check.ts`

Read-only calls only:

- `eth_chainId`
- `eth_blockNumber`
- `eth_getCode` (per address)

No private key, no signing, no permit creation, no userOp submission, no transaction mutation.

## 5. Results

Results are produced directly by the script and include:

- `chainId`
- `blockNumber`
- per-address `codePresent` + `codeLength`
- explicit markers:
  - `paymasterV08CodePresent`
  - `paymasterV07CodePresent`
  - `entryPointV08CodePresent`
  - `entryPointV07CodePresent`

## 6. Diagnosis

Derived diagnostics emitted by script:

- `DIAGNOSTIC_PAYMASTER_V08_NOT_DEPLOYED` when v0.8 paymaster code is missing
- `FALLBACK_V07_POSSIBLE` when v0.7 paymaster code is present
- `ENTRYPOINT_OK_PAYMASTER_MISSING` when EntryPoint v0.8 is present but paymaster v0.8 is missing

## 7. v0.8 path implication

If `paymasterV08CodePresent=no`, Circle Paymaster v0.8 path is blocked for live sponsored userOp proof on Arc Testnet until deployment/address alignment is resolved.

## 8. v0.7 fallback implication

If `paymasterV07CodePresent=yes`, a v0.7 fallback path may be technically possible, but still requires a separately approved sprint and full deterministic artifact capture.

## 9. Claim boundary

Unchanged:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

## 10. Recommended next action

1. Use read-only output to confirm deployment reality for v0.8/v0.7.
2. If v0.8 paymaster is not deployed at target address, open infra/provider clarification path before any new live attempt.
3. Keep claim boundary unchanged until deterministic userOpHash + txHash + receipt/log fee evidence is captured in an explicitly approved live sprint.

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

