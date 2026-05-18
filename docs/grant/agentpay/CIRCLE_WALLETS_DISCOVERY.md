# Circle Wallets Discovery — AgentPay (Master Prompt #10)

**Date:** 2026-05-18  
**Scope:** Discovery-to-verification documentation for Circle Developer-Controlled Wallets on Arc Testnet.

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

**Yes.** Arc Testnet appears in official Circle Wallets supported-blockchains documentation, and founder-run wallet creation was verified on `ARC-TESTNET` in this repo.

## 7) Is USDC on Arc Testnet supported?

**Likely yes, but not runtime-verified in this repo for Circle Wallets.** Existing repo proofs for USDC on Arc Testnet are from App Kit / Bridge / Gateway flows, not Circle Wallets wallet-runtime proofs.

## 8) Is wallet creation possible now?

**Yes (verified).** Founder-run server-only flow completed wallet creation on `ARC-TESTNET` with captured artifacts.

## 9) Is transaction signing/sending possible now?

**Not yet verified in this repo.** Wallet creation is verified, but Circle Wallets signing/sending runtime proof has not been captured yet for claim purposes.

## 10) Is minimal verification possible now?

**Yes (for wallet creation only).** Minimal Circle Wallets verification has been completed for developer-controlled wallet creation using real Circle credentials in a server-only flow.

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

- Operational continuation gate: **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY_AND_ENTITY_SECRET**
- Product/public status: **CURRENT_VERIFIED (wallet creation only)**

### Status guidance for grant claims now

- Keep Circle Wallets claim at **CURRENT_VERIFIED (wallet creation only)**.
- Do not upgrade to broader `CURRENT_VERIFIED` for signing/send/gasless/paymaster until separate runtime proofs exist.

## 15) Server-only setup/readiness scaffold update (Master Prompt #10B)

Implemented in this sprint:

- `.gitignore` explicitly includes `.env.circle.local`, `.env*.circle.local`, `.env.*.circle.local`
- `.env.example` now includes Circle Wallets server-only placeholders:
  - `CIRCLE_API_KEY`
  - `CIRCLE_ENTITY_SECRET`
  - `CIRCLE_WALLET_SET_ID`
  - `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`
  - `CIRCLE_WALLETS_DRY_RUN=true`
  - `CIRCLE_WALLET_SET_NAME=AgentPay Arc Testnet Wallet Set`
  - `CIRCLE_WALLET_ACCOUNT_TYPE=EOA`
- New server-only setup doc:
  - `docs/grant/agentpay/CIRCLE_WALLETS_SERVER_SETUP.md`
- New local readiness script (no live mutation calls):
  - `scripts/circle-wallets-readiness.ts`
- New package command:
  - `npm run circle:wallets:readiness`
- New local entity-secret and wallet scripts:
  - `npm run circle:wallets:generate-entity-secret`
  - `npm run circle:wallets:register-entity-secret`
  - `npm run circle:wallets:create:arc`

Dependency/API decision for this sprint:

- Official Circle SDK is used: `@circle-fin/developer-controlled-wallets`.
- Readiness + secure setup scripts were implemented server-side only.
- Live wallet create/sign/send remains deferred until explicit founder-run command with `CIRCLE_WALLETS_DRY_RUN=false`.

Current classification update:

- Feasibility gate: **FEASIBLE_BUT_NEEDS_CIRCLE_CONSOLE_API_KEY_AND_ENTITY_SECRET**
- Internal implementation/readiness: **CURRENT_VERIFIED** (wallet creation on ARC-TESTNET)
- Product/public claim status: **CURRENT_VERIFIED (wallet creation only)**

## 16) Verification update — live founder-run proof captured

Verified in founder-run server-only flow:

- Entity Secret registered successfully (`npm run circle:wallets:register-entity-secret`)
- Recovery directory: `./.circle-recovery`
- Readiness passed (`npm run circle:wallets:readiness`) with redacted secret output and no wallet mutation calls
- Wallet set created/reused successfully
- ARC-TESTNET wallet created successfully (`npm run circle:wallets:create:arc`)
- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `walletAddress: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- `.env.circle.local` remains git-ignored
- `.circle-recovery` remains git-ignored
- No secrets committed

Claim boundary (strict):

- ✅ Allowed claim: **Circle Developer-Controlled Wallet creation verified on ARC-TESTNET**
- ❌ Not yet verified/claimable: Circle Wallets signing, token transfer, gasless transaction, paymaster

Safety reminder after live proof:

- Set/restore `CIRCLE_WALLETS_DRY_RUN=true` to prevent accidental duplicate wallet creation.

## Founder approval gate (continuation safety)

Before any next Circle Wallets live mutation beyond wallet creation:

1. Founder confirms Circle Developer Console/project readiness remains valid.
2. Founder keeps API credentials and entity-secret materials server-only.
3. Founder approves each additional live step explicitly (sign/send/gasless).
4. Founder restores `CIRCLE_WALLETS_DRY_RUN=true` after any live wallet-creation run to prevent accidental duplicates.
