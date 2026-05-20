# Repo Hygiene Policy

**Last updated:**2026-05-20

## Public scripts policy

- Public repo keeps app/API/source/docs only.
- Live or mutating operational scripts stay private.
- Private-key, Circle-secret, wallet-creation, transfer, bridge, deposit, spend, and live-proof scripts must not be tracked in the public repo.
- Read-only diagnostics may remain only if they are useful, safe, and non-sensitive.

## Public grant docs policy

- Public repo keeps sanitized product/integration docs only.
- Grant drafts, support tickets, raw proof artifacts, internal open questions, and live proof runbooks stay private.
- Proof history should be summarized in claim-safe public docs, not exposed as raw operational logs.

## What is safe to commit

- Application source code (`src/**`)
- Public-safe docs and architecture notes
- Build/config files without secrets
- `.env.example` with placeholder values only

## What must never be committed

- Private keys, mnemonics, keystores, API secrets
- `.env`, `.env.local`, secret exports
- Personal applicant identity documents or private grant strategy notes
- Wallet operational dumps and raw sensitive logs

## Environment variable policy

- Commit only `.env.example`
- Keep runtime values in local non-committed env files
- Rotate any leaked key immediately if accidental exposure occurs

## Demo media policy

- Keep raw recordings/screenshots in ignored folders
- Only publish explicitly approved media artifacts

## Pre-push checklist

- [ ] `git status --short` reviewed
- [ ] No secret files in staged diff
- [ ] `.env*` files excluded except `.env.example`
- [ ] Internal/private grant docs excluded
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
