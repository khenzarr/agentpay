# AgentPay Final Grant Assets Checklist

Use this as the final operational checklist before submission.

## Required links

- Live demo: `https://agentpay-dusky.vercel.app`
- GitHub repo: `https://github.com/khenzarr/agentpay`
- Docs page: `https://agentpay-dusky.vercel.app/docs`
- Read-only API health: `https://agentpay-dusky.vercel.app/api/health`
- Jobs API sample: `https://agentpay-dusky.vercel.app/api/jobs?limit=1`
- Payments API sample: `https://agentpay-dusky.vercel.app/api/payments?limit=1`
- Identity sample: `https://agentpay-dusky.vercel.app/api/identity/resolve?name=agentpayagent.circle`

## Demo video checklist

- [ ] Final video length is under 5 minutes.
- [ ] Live product is shown on Vercel deployment.
- [ ] Codebase walkthrough is shown.
- [ ] Circle/Arc integrations are discussed accurately.
- [ ] API v0 is shown as read-only.
- [ ] ArcNS identity is shown.
- [ ] No secrets are visible.
- [ ] No overclaims are made.

## Grant form answer snippets

### Project one-line description (max 200 chars)

`USDC-native escrow and job settlement infrastructure for autonomous agents and marketplaces on Arc Testnet.`

### Problem (2–4 sentences)

Autonomous agent work needs reliable payment coordination across clients, agents, and marketplaces. Without escrow-backed lifecycle state, teams struggle with trust, role clarity, and settlement visibility. Existing flows are often fragmented between on-chain actions and off-chain tracking, which increases execution risk. Builders need a claim-safe MVP surface that can be integrated and reviewed today.

### Solution (2–4 sentences)

AgentPay provides a USDC-native escrow and job lifecycle flow for Arc Testnet. It coordinates create, fund, submit, and complete stages with wallet-confirmed actions and role-aware controls. ArcNS adds identity readability for participants, while API v0 exposes read-only integration surfaces for health, jobs, payments, and identity resolution. The current implementation is explicitly scoped as an Arc Testnet MVP with clear NOT_CLAIMED boundaries.

### Traction / current status

- Live Arc Testnet MVP deployment is public.
- Public GitHub repo is available for code review.
- Read-only Developer API v0 is live.
- Product UI has been redesigned and QA-passed across core routes.
- Lifecycle and read-only endpoints are verified in current MVP scope.
- Claim-safe boundaries are documented and enforced in demo materials.

### Circle product usage / integration

- USDC is used for escrow/job lifecycle context on Arc Testnet.
- Circle Wallets/AppKit/Gateway references should be described only within currently verified/documented scope.
- Circle Paymaster/Gasless on Arc Testnet is **NOT_CLAIMED** until Circle support/deployment is available.

### Technical roadmap

- Production-grade agent registry.
- SDK and transaction-intent API surfaces (currently NOT_CLAIMED in MVP).
- Expanded settlement-event surfaces if/when implemented.
- Supported-chain Circle Paymaster/Gasless expansion path.
- Mainnet readiness path after Arc mainnet/support conditions are met.

### Grant funding use

- Security review and hardening.
- Production-grade indexing and API reliability improvements.
- SDK and documentation expansion.
- UX polish across operator and integrator flows.
- Agent marketplace integrations.
- Supported Circle integration expansion where available.

## Final pre-submit checklist

- [ ] Video uploaded and accessible.
- [ ] Repo is public and clean.
- [ ] Live deployment is accessible.
- [ ] README is updated.
- [ ] Docs page is accessible.
- [ ] No secrets in public repo.
- [ ] Claim boundaries are consistent across video, repo, and form answers.
- [ ] Deck/demo links are ready if needed.

## Claim-safe reminders (quick scan before submit)

- Say “Arc Testnet MVP,” not “production-ready.”
- Say “read-only Developer API v0,” not “production API.”
- Say “Mainnet readiness is NOT_CLAIMED.”
- Say “Full ERC-8183 compliance is NOT_CLAIMED.”
- Say “Full ERC-8004 compliance is NOT_CLAIMED.”
- Say “Circle Paymaster/Gasless on Arc Testnet is NOT_CLAIMED.”