# Circle Wallets Server-Only Setup — AgentPay (Master Prompt #10A)

**Date:** 2026-05-18  
**Scope:** Server-only readiness scaffold for Circle Wallets (Developer-Controlled Wallets). No live wallet creation/sign/send in this sprint.

## 1) Why Developer-Controlled Wallets are relevant to AgentPay

AgentPay’s autonomous agent flows require backend-controlled automation points for wallet lifecycle and transaction orchestration. Circle Developer-Controlled Wallets align with this model by keeping sensitive signing/auth flows in trusted backend execution paths.

## 2) Why secrets must be server-only

Circle Wallets credentials are sensitive and must never be exposed in browser bundles.

- Never use `NEXT_PUBLIC_*` for Circle secrets.
- Never place Circle secrets in client components or frontend env files.
- Use server-only execution contexts (local server script/API route/worker) with redacted logs.

## 3) Required Circle Console assets

For readiness and later wallet operations:

1. Circle API Key
2. Entity Secret
3. `entitySecretCiphertext` (for relevant request flows)
4. Wallet Set ID (required for wallet creation flow)

## 4) Required local env file

- `.env.circle.local` (local-only, git-ignored)

Do not place Circle secrets in `.env.local`.

## 5) Exact env variable names

- `CIRCLE_API_KEY`
- `CIRCLE_ENTITY_SECRET`
- `CIRCLE_ENTITY_SECRET_CIPHERTEXT`
- `CIRCLE_WALLET_SET_ID`
- `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`
- `CIRCLE_WALLETS_DRY_RUN=true`

## 6) What is safe to commit vs not safe

Safe to commit:

- Placeholder names in `.env.example`
- Server-only readiness script code without real secrets
- Documentation and status updates

Not safe to commit:

- `.env.circle.local`
- Real API keys, entity secret values, or raw ciphertext values

## 7) Arc testnet target

- Circle Wallets target chain for this integration path: `ARC-TESTNET`

## 8) Readiness checklist

- [ ] `.env.circle.local` created locally
- [ ] Required Circle env vars populated (server-only)
- [ ] `npm run circle:wallets:readiness` passes
- [ ] Secrets are redacted in logs
- [ ] No client-side secret usage

## 9) What counts as proof in later sprint

Circle Wallets can be upgraded only after runtime artifacts are captured:

1. Wallet set created or identified
2. Wallet created on `ARC-TESTNET`
3. Wallet address recorded as artifact
4. Optional: test transaction/signing artifact (if explicitly approved)

## 10) Current status policy

- Current implementation in this sprint: server-only readiness scaffold
- Circle Wallets claim status: **NOT_CLAIMED**
- Classification: **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY_AND_ENTITY_SECRET**
- Internal scaffold status: **CURRENT_CODE_IMPLEMENTED_PENDING_WALLET_PROOF**

No live wallet creation/sign/send was run in this sprint.
