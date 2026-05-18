# Circle Grant Form — Draft Inputs

**Use as starting copy only.** Update after MVP ships. Mark anything unbuilt as planned, not current.

---

## Project name

**AgentPay for Arc**

---

## One-liner (< 200 characters)

USDC-native escrow and settlement for AI agents on Arc—fund jobs, verify deliverables, and release payments on-chain.

*(Character count: ~120)*

---

## Problem

Autonomous AI agents increasingly perform economically valuable work, but settlement remains ad hoc: opaque transfers, no shared job lifecycle, and wallet addresses that are hard to trust at scale. On Arc, Circle has documented agent identity (ERC-8004) and job commerce (ERC-8183), yet developers lack a productized, demo-ready layer that combines USDC escrow with clear UX for fund → deliver → settle flows.

---

## Solution

AgentPay is a web application on Arc Testnet where clients create USDC-funded jobs for agents, agents submit on-chain deliverable hashes, and evaluators complete jobs to release escrow. The MVP integrates Arc’s ERC-8183 reference contract and Circle USDC on testnet, with optional ArcNS (`.arc` / `.circle`) resolution for agent payout addresses. A dashboard surfaces job volume and settlement stats with ArcScan-verifiable transactions.

---

## Barriers

| Barrier | How we address |
|---------|----------------|
| Testnet funding | Circle faucet; pre-funded demo wallets |
| Role complexity (client/provider/evaluator) | UI labels + demo script with two browsers |
| Standard evolution | Honest roadmap to ERC-8004/8183; no overclaim |
| Empty new repo | Sister projects ArcNS (live testnet) and FlowPay (Arc USDC UX) de-risk delivery |

---

## Why this team

We operate **ArcNS**, a USDC-native naming protocol live on Arc Testnet (8 contracts, production frontend, subgraph, ~180 contract tests). We built **FlowPay**, an Arc-first USDC routing demo with ArcNS integration. We understand Arc Testnet operations, USDC decimals, explorer integration, and grant-grade honesty about Circle product scope.

---

## Current Circle products

**Before MVP implementation — use:**

- [ ] I am not currently integrated with any Circle products

**After working testnet demo — use:**

| Product | How |
|---------|-----|
| USDC | Escrow funding and payout on Arc Testnet |
| Contracts | ERC-8183 reference escrow (and/or deployed AgentPay contracts) |

**Do not check until demo-ready:** Bridge Kit, CCTP, Gateway, Paymaster, Wallets, EURC.

---

## Planned Circle products

| Product | Timeline (indicative) |
|---------|----------------------|
| Arc (platform) | MVP — now |
| USDC | MVP — now |
| Contracts | MVP — now |
| App Kit (Send) | M2 — 1–2 months post-grant |
| Bridge Kit / CCTP | M3 — cross-chain escrow funding |
| Gateway / Unified Balance | M4 — agent treasuries |
| Wallets (Developer Controlled) | M4 — autonomous agent signers |
| Paymaster / AA | M5 — gas sponsorship |
| EURC | Post-MVP |

---

## Milestones

| Milestone | Deliverable | Timeframe |
|-----------|-------------|-----------|
| M1 | Testnet MVP: create, fund, submit, complete job + ArcScan | Weeks 1–3 |
| M2 | Dashboard stats + demo video + public repo | Week 4 |
| M3 | ArcNS agent address resolution in production UI | Week 5–6 |
| M4 | ERC-8004 agent identity display (testnet registry) | Weeks 7–9 |
| M5 | App Kit Send integration for USDC top-up | Weeks 10–12 |
| M6 | Bridge Kit / CCTP funding path (POC) | Months 4–6 |

*Tune dates to grant application requirements.*

---

## Traction

| Evidence | Status |
|----------|--------|
| ArcNS live on Arc Testnet | ✅ (sister project) |
| https://arcns-app.vercel.app | ✅ |
| FlowPay Arc + ArcNS resolver code | ✅ (sister project) |
| AgentPay repo | 🚧 Greenfield — MVP planned |
| Users/revenue | Pre-revenue; testnet demos |

**Honest line:** AgentPay is new; our Arc testnet shipping record is demonstrated via ArcNS and FlowPay.

---

## Technical roadmap

1. **Q2 2026:** ERC-8183 + USDC escrow MVP on Arc Testnet; grant demo.  
2. **Q3 2026:** ERC-8004 agent cards; subgraph for jobs; ArcNS deep integration.  
3. **Q4 2026:** App Kit Send; Bridge Kit POC for multichain funding.  
4. **2027:** Gateway treasuries; Circle Wallets for agents; mainnet after audit.

---

## Grant use of funds

| Category | Allocation (example) |
|----------|----------------------|
| Engineering (MVP + integrations) | 60% |
| Testnet ops + infra (RPC, hosting) | 10% |
| Security review (custom contracts if any) | 15% |
| Demo/marketing (video, design) | 10% |
| Buffer | 5% |

*Adjust to application budget fields.*

---

## Demo / deck preparation notes

- **Video:** Follow `DEMO_SCRIPT.md` (≤ 5 min).  
- **Deck slides (8–10):** Problem → Arc agentic economy → AgentPay flow → USDC on Arc → Live screenshot → ArcNS complement → Roadmap → Team → Ask.  
- **Live links:** AgentPay Vercel (when live), ArcScan contract, ArcNS app.  
- **Checkboxes:** Sync with `CIRCLE_ALIGNMENT.md` on submission day.

---

## Conflict of interest

Draft disclosure (founder to verify):

- Same founding team as ArcNS and FlowPay.  
- No current Circle employment stated in local docs.  
- Update if applicant has Circle affiliation or prior grant on overlapping scope.

---

## Product alignment track (suggested)

**Primary:** Agentic economic activity  
**Secondary:** Peer-to-peer payments / Arc ecosystem

---

## Abstract (short paragraph)

AgentPay for Arc enables USDC-native escrow and settlement for autonomous AI agents. Clients fund jobs on Arc Testnet; agents commit deliverables on-chain; evaluators release USDC via smart-contract rules aligned with Arc’s ERC-8183 agentic commerce reference. Built by the ArcNS team, AgentPay complements human-readable agent identity with verifiable payments—today as a grant-ready demo, tomorrow with ERC-8004 identity, Circle App Kit, and cross-chain USDC via CCTP.
