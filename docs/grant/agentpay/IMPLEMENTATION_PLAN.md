# Implementation Plan

**Prerequisite:** Founder decisions in `OPEN_QUESTIONS.md` resolved.  
**Estimate:** 2–3 weeks solo dev with ArcNS/FlowPay reuse; 1 week intensive if ERC-8183 reference only.

---

## Phase 0 — Decisions & setup (Day 0–1)

| Task | Output |
|------|--------|
| Choose escrow path (A: ERC-8183 ref vs B: custom) | Decision recorded |
| Initialize git repo in `agentpay` | README, `.gitignore` |
| Copy Hardhat network config from ArcNS | `hardhat.config.js` |
| Copy Arc addresses | `deployments/arc_testnet.json` |
| Fund 2 demo wallets via faucet | Spreadsheet of addresses |

---

## Phase 1 — Contracts & ABI (Day 1–3)

### Path A (recommended)

| Step | Action |
|------|--------|
| 1.1 | Download verified ABI for `0x0747…4583` from ArcScan |
| 1.2 | Download USDC ABI (standard ERC-20) |
| 1.3 | Write `scripts/testnet-smoke.ts` — full lifecycle via viem |
| 1.4 | Document role wallet mapping in README |

### Path B (custom)

| Step | Action |
|------|--------|
| 1.1 | Implement `AgentPayEscrow.sol` + OZ |
| 1.2 | Hardhat tests: happy path + revert cases |
| 1.3 | Deploy to Arc Testnet; verify on ArcScan |
| 1.4 | `scripts/generate-frontend-config.js` (ArcNS pattern) |

---

## Phase 2 — Frontend scaffold (Day 3–5)

| Step | Action |
|------|--------|
| 2.1 | `npx create-next-app` or copy FlowPay skeleton (strip send/deploy tabs) |
| 2.2 | Port `lib/chains.ts`, `lib/wagmi.ts`, `WagmiProvider` (Arc-only) |
| 2.3 | Add `lib/contracts.ts`, `lib/abis/`, env example |
| 2.4 | Layout + header + `ConnectButton` + `NetworkGuard` |
| 2.5 | Landing page `/` |

---

## Phase 3 — Core job flows (Day 5–10)

| Step | Action |
|------|--------|
| 3.1 | `demo-agents.json` + `/agents` |
| 3.2 | `/create-job` — createJob tx |
| 3.3 | Budget + approve + fund sequence |
| 3.4 | `/jobs/[id]` — read `getJob`, status stepper |
| 3.5 | Submit deliverable (agent wallet) |
| 3.6 | Complete job (evaluator wallet) |
| 3.7 | ArcScan links on all txs |

---

## Phase 4 — Dashboard & polish (Day 10–12)

| Step | Action |
|------|--------|
| 4.1 | `/jobs` list (scan job IDs 1..N or event logs) |
| 4.2 | Stats bar aggregation |
| 4.3 | `/payments` event list |
| 4.4 | Port ArcNS resolver (optional) |
| 4.5 | Error messages, empty states, loading |

---

## Phase 5 — Testing & demo prep (Day 12–14)

| Step | Action |
|------|--------|
| 5.1 | Run `DEMO_SCRIPT.md` dry run 3× |
| 5.2 | Pre-seed agent wallet; record tx hashes for fallback video |
| 5.3 | Record 5-min demo video |
| 5.4 | Update `CIRCLE_ALIGNMENT.md` checkboxes to match reality |
| 5.5 | Grant form draft final review |

---

## Suggested order of operations (summary)

```
Decisions → ABI/smoke test → Frontend shell → Create/fund → Submit/complete → Dashboard → Demo video
```

---

## Testing plan

| Layer | Tests |
|-------|-------|
| Contracts | hardhat/viem smoke on testnet fork or live testnet |
| Frontend unit | vitest: resolver, hash util, status mapper |
| E2E manual | Demo script checklist |
| Regression | Snapshot of `getJob` after each action |

---

## Deployment plan

| Artifact | Target |
|----------|--------|
| Contracts | Arc Testnet (if custom); else address constants only |
| Frontend | Vercel (match ArcNS pattern) |
| Env | Vercel project env vars for RPC + addresses |
| Docs | Keep `docs/grant/agentpay/` in sync |

---

## Demo preparation plan

| Item | Owner |
|------|-------|
| 2 browsers/profiles (client + agent) | Founder |
| USDC on both wallets | Faucet 24h before |
| ArcNS name for agent (optional) | Founder |
| Screen recording tool | Founder |
| Backup pre-recorded ArcScan txs | If live network fails |

---

## Post-MVP phases (not in first build)

| Phase | Work |
|-------|------|
| P2 | ERC-8004 agent registration display |
| P3 | App Kit Send for USDC top-up |
| P4 | Subgraph for jobs |
| P5 | Bridge Kit funding |
| P6 | Custom escrow + audit |

---

## Repository structure (target)

```
agentpay/
├── contracts/           # empty if using reference only
├── scripts/
├── deployments/
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       └── config/
├── docs/grant/agentpay/
└── README.md
```

---

## Implementation can safely begin when

- [ ] Escrow path chosen (A or B)  
- [ ] ERC-8183 ABI obtained  
- [ ] Two funded testnet wallets  
- [ ] RPC + explorer access confirmed  
- [ ] No grant form submitted claiming unbuilt integrations  
