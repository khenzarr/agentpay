# Circle Wallets Discovery — AgentPay (Master Prompt #10)

**Date:** 2026-05-18  
**Scope:** Discovery-first feasibility only. No Circle Wallets product code was implemented in this sprint.

## 1) Official docs used

- Circle grant page: https://www.circle.com/grant
- Arc docs: https://docs.arc.io
- Arc App Kit docs: https://docs.arc.io/app-kit
- Arc App Kit SDK reference: https://docs.arc.io/app-kit/references/sdk-reference
- Circle Wallets supported blockchains: https://developers.circle.com/wallets/supported-blockchains
- Circle Wallets gasless tx guide (chain support language): https://developers.circle.com/wallets/gas-station/send-a-gasless-transaction
- Circle Developer docs root: https://developers.circle.com/

> Note: several legacy/guessed Wallets doc paths returned 404 during discovery. Only official resolvable pages were used for claims.

## 2) Product variants evaluated

1. Developer-Controlled Wallets
2. User-Controlled Wallets
3. Wallet signing/transaction APIs
4. Smart-contract account + gasless policy flow (Wallets/Gas Station scope)

## 3) Required credentials / API keys

From official Circle Wallets docs and API model, real Wallets usage requires Circle Developer Console setup and secret material, including:

- Circle API key / bearer authorization
- Entity Secret registration and use
- Per-request encrypted `entitySecretCiphertext` for relevant developer-controlled wallet actions

These are sensitive and **server-only**.

## 4) Backend/server requirement

Wallets credentials and entity-secret flows are backend concerns. Safe integration requires:

- server-only execution context (API route, backend worker, or local server script)
- no exposure of Circle secrets to browser/client bundle
- strict env-based secret loading

## 5) Supported chains/testnets (relevant finding)

Official supported-blockchains docs list **Arc Testnet (`ARC-TESTNET`)** for Circle Wallets capability tables.

## 6) Is Arc Testnet supported?

**Yes (documentation-level support).** Arc Testnet appears in official Circle Wallets supported-blockchains documentation.

## 7) Is USDC on Arc Testnet supported?

**Likely yes, but not runtime-verified in this repo for Circle Wallets.** Existing repo proofs for USDC on Arc Testnet are from App Kit / Bridge / Gateway flows, not Circle Wallets wallet-runtime proofs.

## 8) Is wallet creation possible now?

**Not in this repo right now** without founder-provided Circle Console credentials and secret setup.

## 9) Is transaction signing/sending possible now?

**Not in this repo right now** for Circle Wallets due to missing Circle credentials/secret configuration and absent dedicated backend/server integration path.

## 10) Is minimal verification possible now?

**No (hard-stop).** Minimal Circle Wallets verification requires real Circle credentials and server-side execution.

## 11) Security model

- Circle API keys and entity secret materials are sensitive credentials.
- Credentials must never be embedded in client code or `NEXT_PUBLIC_*` vars.
- Operations should run server-side with principle of least privilege, secret redaction, and audited logs.

## 12) Secrets handling requirements

- Keep Circle secrets in server-only env vars (not committed).
- Never print secrets in logs/CLI output.
- Keep local credential files git-ignored.
- Prefer dry-run/check routes before any value-bearing transaction.

## 13) Recommended architecture (if founder approves next step)

Minimal safe path:

1. Add backend/server-only entrypoint (e.g., `src/app/api/circle-wallets/*` or `scripts/circle-wallets-*.ts`).
2. Inject Circle credentials via non-public env vars.
3. Implement read-only preflight endpoint/script first (auth + supported-chain sanity check).
4. Implement wallet creation/transaction in gated steps with explicit dry-run mode where available.
5. Capture verifiable artifacts (wallet ID/address, tx hash, timestamp, chain, amount) without exposing secrets.

## 14) Claim recommendation

### Final classification

**FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY**

Additional blockers in current repo state:

- **FEASIBLE_BUT_NEEDS_BACKEND** (server-only secret handling path not yet scoped/approved)
- Potential account/setup prerequisites in Circle Console before live wallet operations

### Status guidance for grant claims now

- Keep Circle Wallets as **NOT_CLAIMED** in product/demo status docs.
- Do not upgrade to `CURRENT_VERIFIED` until real Circle Wallet creation/sign/send proof exists.

## 15) Server-only setup/readiness scaffold update (Master Prompt #10A)

Implemented in this sprint:

- `.gitignore` explicitly includes `.env.circle.local`, `.env*.circle.local`, `.env.*.circle.local`
- `.env.example` now includes Circle Wallets server-only placeholders:
  - `CIRCLE_API_KEY`
  - `CIRCLE_ENTITY_SECRET`
  - `CIRCLE_ENTITY_SECRET_CIPHERTEXT`
  - `CIRCLE_WALLET_SET_ID`
  - `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`
  - `CIRCLE_WALLETS_DRY_RUN=true`
- New server-only setup doc:
  - `docs/grant/agentpay/CIRCLE_WALLETS_SERVER_SETUP.md`
- New local readiness script (no live mutation calls):
  - `scripts/circle-wallets-readiness.ts`
- New package command:
  - `npm run circle:wallets:readiness`

Dependency/API decision for this sprint:

- No new Circle Wallets SDK dependency was added.
- Readiness was implemented as a local env-validation scaffold only.
- Live wallet create/sign/send API calls remain deferred until explicit founder approval and runtime verification scope.

Current classification update:

- Feasibility gate: **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY_AND_ENTITY_SECRET**
- Internal implementation/readiness: **CURRENT_CODE_IMPLEMENTED_PENDING_WALLET_PROOF**
- Product/public claim status: **NOT_CLAIMED**

No live wallet creation or signing/sending was executed in this sprint.

## Founder approval gate (stop condition)

Before any Circle Wallets implementation:

1. Founder confirms Circle Developer Console access and account readiness.
2. Founder provisions required API credentials and entity-secret setup.
3. Founder approves backend/server-only scope for secrets.
4. Founder approves verification runbook (no live value transfer unless explicitly approved).
