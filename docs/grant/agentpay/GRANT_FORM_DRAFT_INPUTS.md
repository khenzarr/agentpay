# Circle Grant Form — Final Draft Inputs (Claim-Safe)

**Last updated:** 2026-05-19  
**Rule:** Only claim what is runtime-verified in this repository.

Related public docs:

- `docs/AGENT_INTEGRATION_GUIDE.md`
- `docs/FULL_CIRCLE_ARC_INTEGRATION_ROADMAP.md`

---

## Project name

**AgentPay for Arc**

## One-liner (<200 chars)

USDC-native escrow and settlement for AI agents on Arc Testnet with verifiable on-chain job lifecycle and strict integration claim boundaries.

---

## Current Circle product usage (claimable now)

| Product | Status | Claim-safe wording |
|---|---|---|
| USDC | CURRENT_VERIFIED | USDC escrow lifecycle verified on Arc Testnet |
| Contracts | CURRENT_VERIFIED | Smart-contract interaction and lifecycle actions verified |
| App Kit Send | CURRENT_VERIFIED | Live send proof captured on Arc Testnet |
| Bridge / CCTP | CURRENT_VERIFIED | Ethereum Sepolia → Arc Testnet bridge path verified |
| Gateway / Unified Balance | CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED | Supported-chain check + live deposit + confirmed balance + spend estimate verified; live spend not executed due high fee |
| Circle Wallets (Developer-Controlled) | CURRENT_VERIFIED (limited) | Wallet creation + metadata read verified on ARC-TESTNET |

### Explicit NOT_CLAIMED items

- Circle Wallets signing/send/gasless
- Paymaster
- Full ERC-8183 compliance
- Full ERC-8004 compliance

---

## Grant-safe narrative blocks

### Problem

AI agents can produce work, but settlement is still fragmented and hard to verify. AgentPay provides a transparent USDC escrow lifecycle on Arc Testnet, aligned with Arc’s agentic commerce direction.

### Solution

AgentPay enables create → fund → submit → complete job lifecycle with verifiable on-chain transactions, optional ArcNS identity display, and evidence-backed integration documentation for Circle/Arc tooling.

### Current maturity statement

AgentPay is **live on Arc Testnet** with a **mainnet-ready architecture, waiting for Arc mainnet availability**.

---

## Required wording constraints for submission

Use this phrasing for future-facing items:

- “Mainnet-ready; waiting for Arc mainnet availability.”
- “Not claimed until runtime proof exists.”

Avoid vague phrasing like “planned integrations” for items presented as already integrated.

---

## Security disclosure language

- Circle secrets are server-only.
- `.env.circle.local` and `.circle-recovery` are git-ignored.
- No Circle API key or entity secret is committed.
- No `NEXT_PUBLIC` Circle secret exposure is permitted.

---

## Demo claim anchor

Submission claims must remain consistent with:

- `docs/grant/agentpay/INTEGRATION_COMPLETION_MATRIX.md`
- `docs/grant/agentpay/CIRCLE_ARC_INTEGRATION_AUDIT.md`
- `docs/grant/agentpay/FINAL_GRANT_READINESS_AUDIT.md`