# Repo Hygiene Policy

**Last updated:** 2026-05-17

## 1) What is safe to commit

- Application source code (`src/**`)
- Public-safe docs and architecture notes
- Build/config files without secrets
- `.env.example` with placeholder values only

## 2) What must never be committed

- Private keys, mnemonics, keystores, API secrets
- `.env`, `.env.local`, secret exports
- Personal applicant identity documents or private grant strategy notes
- Wallet operational dumps and raw sensitive logs

## 3) Public docs policy

- Keep implementation and architecture docs public-safe by default
- If a document includes sensitive strategy/personal notes, classify as internal/private first

## 4) Grant docs policy

- Do **not** ignore all `docs/grant/agentpay`
- Use targeted internal/private patterns in `.gitignore`:
  - `docs/grant/private/`
  - `docs/grant/internal/`
  - `docs/grant/**/private/`
  - `docs/grant/**/internal/`
  - `docs/grant/**/*PRIVATE*`
  - `docs/grant/**/*DRAFT_PRIVATE*`
  - `docs/grant/**/*PERSONAL*`
  - `docs/grant/**/*APPLICATION_PRIVATE*`

## 5) Environment variable policy

- Commit only `.env.example`
- Keep runtime values in local non-committed env files
- Rotate any leaked key immediately if accidental exposure occurs

## 6) Demo media policy

- Keep raw recordings/screenshots in ignored folders
- Only publish explicitly approved media artifacts

## 7) Pre-push checklist

- [ ] `git status --short` reviewed
- [ ] No secret files in staged diff
- [ ] `.env*` files excluded except `.env.example`
- [ ] Internal/private grant docs excluded
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes

## 8) AgentPay grant docs classification

### PUBLIC_OK
- `PRODUCT_SPEC.md`
- `MVP_SCOPE.md`
- `CONTRACT_ARCHITECTURE.md`
- `FRONTEND_MVP_PLAN.md`
- `IMPLEMENTATION_PLAN.md` (if no private strategy)
- `DEMO_SCRIPT.md` (if public-safe)
- `IMPLEMENTATION_STATUS.md`
- `DEMO_READINESS.md`

### INTERNAL_REVIEW
- `GRANT_POSITIONING.md`
- `CIRCLE_ALIGNMENT.md`
- `GRANT_FORM_DRAFT_INPUTS.md`
- `OPEN_QUESTIONS.md`
- `AGENTPAY_DISCOVERY_REPORT.md`
- `REFERENCE_SOURCE_MAP.md`

### PRIVATE_DO_NOT_PUSH
- any file with personal applicant details
- any file with private grant strategy
- any file with wallet/private operational data
- any file with funding/application notes

If unsure, classify as **INTERNAL_REVIEW**.
