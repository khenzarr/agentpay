# AgentPay Product Specification

**Project:** AgentPay for Arc  
**Version:** MVP planning (grant phase)  
**Status:** Not implemented

---

## Product thesis

AgentPay is a **USDC-native escrow and settlement layer** for autonomous AI agents on **Arc**. Humans or systems create **jobs** for agents, **fund escrow in USDC**, agents **submit deliverables**, clients **approve and settle** on-chain—with transparent status, ArcScan proofs, and a path toward Arc’s **agentic economy** standards (ERC-8004 identity, ERC-8183 jobs).

**Positioning line:** *Pay AI agents in USDC on Arc—with escrow, deliverables, and settlement you can verify on-chain.*

---

## Target users

| Persona | Need |
|---------|------|
| **Builder / integrator** | Programmatic job creation and settlement for agent marketplaces |
| **Agent operator** | Reliable payout address, clear job states, deliverable submission |
| **Grant reviewer / demo viewer** | End-to-end USDC escrow on Arc Testnet in under 5 minutes |
| **Arc ecosystem partner** | Composable escrow that complements ArcNS identity and Arc agent registries |

---

## Core problem

Autonomous agents can produce work, but **value exchange lacks a standard, trust-minimized settlement layer on Arc**:

- Raw addresses are error-prone (mitigated by ArcNS, not solved for jobs).
- Off-chain payments have no verifiable deliverable → payment link.
- Generic ERC-20 transfers have **no escrow, no lifecycle, no dispute hooks**.
- Arc documents **ERC-8183** and **ERC-8004** flows, but developers need a **productized demo** that ties them to USDC and UX.

---

## Core solution

A **demo-ready dApp** on Arc Testnet where users:

1. Connect a wallet (MetaMask).
2. Pick a demo agent (off-chain catalog; optional `.arc` / `.circle` payout resolution via ArcNS).
3. Create and fund a USDC escrow job.
4. Walk through **Open → Funded → Submitted → Completed** (aligned with Arc ERC-8183 reference semantics).
5. View transactions on ArcScan and aggregate stats on a dashboard.

**Standards stance (honest):**  
AgentPay is **inspired by** Arc’s agentic economy architecture and **designed to evolve** toward ERC-8004 / ERC-8183 compatible workflows. **Do not claim full standard compliance** until implementation validates against official contracts and ABIs.

---

## MVP scope

### In scope

| # | Capability |
|---|------------|
| 1 | Wallet connect on Arc Testnet (wagmi + MetaMask) |
| 2 | Demo agent list (static config) |
| 3 | Create job (provider, evaluator, description, expiry) |
| 4 | Set budget / fund escrow in USDC (approve + fund) |
| 5 | Provider submits deliverable hash |
| 6 | Client/evaluator completes job (releases escrow per ERC-8183 `complete`) |
| 7 | Job detail page with status and ArcScan links |
| 8 | Dashboard: total jobs, escrowed USDC, completed jobs, total paid out |
| 9 | Optional: resolve agent payout via ArcNS HTTP API |

### Integration default (recommended)

Use Arc’s **deployed ERC-8183 Agentic Commerce reference** (`0x0747EEf0706327138c69792bF28Cd525089e4583` per Arc docs) with **user-controlled EOA wallets**, not Circle Developer Controlled Wallets—unless founder chooses Wallets for demo.

### Out of scope (MVP)

| Item | Notes |
|------|-------|
| Mainnet deployment | Testnet only |
| Dispute resolution / arbitration | Roadmap |
| ERC-8004 on-chain agent registration in UI | Roadmap; demo agents off-chain |
| Custom `AgentRegistry.sol` on-chain | Optional later |
| Circle App Kit Send/Bridge in production UI | Roadmap |
| CCTP / Gateway / Unified Balance | Roadmap |
| Circle Programmable / Dev-Controlled Wallets | Roadmap (official tutorials use these) |
| EURC, Swap, Paymaster | Roadmap |
| Production subgraph | Optional; contract reads + events sufficient for demo |
| Security audit of new contracts | N/A if using official ERC-8183 ref only |

---

## User journeys (MVP)

### Client (job creator)

1. Connect wallet → ensure Arc Testnet + USDC balance (faucet).
2. `/create-job` → select demo agent → enter description, budget, expiry.
3. Submit → `createJob` → `setBudget` (if required by flow role) → `approve` USDC → `fund`.
4. `/jobs/[id]` → wait for Submitted → `complete` with reason hash.
5. View ArcScan payout and dashboard stats.

### Agent (provider)

1. Switch to agent wallet (second browser/profile for demo).
2. Open job → `submit(deliverableHash)`.
3. After client `complete`, verify USDC balance and ArcScan.

---

## Future roadmap

| Phase | Theme | Circle/Arc touchpoints |
|-------|-------|------------------------|
| **M1** | MVP testnet demo | USDC, Arc, ERC-8183 reference |
| **M2** | ERC-8004 agent identity in UI | IdentityRegistry on testnet |
| **M3** | ArcNS deep link + primary names for agents | ArcNS resolver + `.arc` agents |
| **M4** | App Kit Send + same-chain USDC funding | App Kit |
| **M5** | Bridge Kit / CCTP cross-chain escrow funding | CCTP, Bridge Kit |
| **M6** | Gateway / Unified Balance treasury | Gateway |
| **M7** | Paymaster / AA for gasless agent txs | Paymaster, account abstraction |
| **M8** | Custom escrow extensions (milestones, cancel/refund) | Contracts audit |
| **M9** | Mainnet + audit | USDC mainnet address TBD |

---

## Success metrics (grant demo)

| Metric | Target |
|--------|--------|
| End-to-end demo time | ≤ 5 minutes on video |
| On-chain steps visible | ≥ 4 ArcScan links shown |
| USDC movements | Fund + release clearly shown |
| Honest Circle checkboxes | USDC + Arc only unless more is built |
| Zero false compliance claims | ERC-8183/8004 wording per validation |

---

## Dependencies

- Arc Testnet RPC and USDC faucet access  
- ArcNS public API availability (optional feature)  
- ERC-8183 reference contract availability on testnet  
- Founder wallets funded with testnet USDC  

---

## Non-goals

- Competing with ArcNS on naming  
- Full marketplace for agents  
- Replacing Circle’s official ERC-8183 quickstart scripts—complementing them with product UX  
