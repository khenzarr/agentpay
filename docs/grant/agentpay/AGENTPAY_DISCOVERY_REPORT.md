# AgentPay Discovery Report

**Date:** 2026-05-17  
**Phase:** Grant discovery & architecture (no implementation)  
**Workspace:** `c:\Users\mertb\Desktop\NODE\agentpay`

---

## Executive summary

The **agentpay** workspace is **empty** (greenfield). No contracts, frontend, or configuration exist in-repo yet. Planning should treat AgentPay as a **new monorepo** that **reuses patterns and sibling code** from locally available **ArcNS** and **FlowPay** projects, while aligning escrow semantics with Arc’s **ERC-8183 reference** and agent identity with **ERC-8004** (roadmap only until implemented).

**Recommended starting point:** Bootstrap a Next.js + Hardhat project inside `agentpay`, copy Arc Testnet chain/USDC constants from ArcNS `deployments/arc_testnet-v3.json`, reuse FlowPay’s `wagmi` + ArcNS HTTP resolver modules, and integrate the **deployed ERC-8183 Agentic Commerce contract** on Arc Testnet for the MVP escrow lifecycle (MetaMask/wagmi), with an optional thin UI wrapper—not a second escrow protocol unless a founder decision requires custom logic.

---

## Workspace inspected

| Location | Status | Notes |
|----------|--------|-------|
| `c:\Users\mertb\Desktop\NODE\agentpay` | **Empty** | No subfolders or files (tree confirmed 2026-05-17) |
| `docs/grant/agentpay/` | **Created in this phase** | Planning documents only |

---

## ArcNS repository availability

| Question | Answer |
|----------|--------|
| GitHub `https://github.com/khenzarr/arcns` cloned at expected path? | **No** — not found as `NODE\arcns` |
| Equivalent local copy? | **Yes** — `c:\Users\mertb\Desktop\NODE\ArcNameServices\arcns` |
| Same project as GitHub repo? | **Assumed yes** (README references `github.com/khenzarr/arcns`, v3 layout, grant docs) — **UNVERIFIED** without `git remote -v` check in this pass |

### Relevant ArcNS paths

| Path | Relevance to AgentPay |
|------|------------------------|
| `contracts/v3/` | Reference for USDC payments, OpenZeppelin patterns, UUPS (not for escrow copy-paste) |
| `deployments/arc_testnet-v3.json` | **Canonical** Arc Testnet addresses (USDC, resolver, registry) |
| `frontend/src/lib/generated-contracts.ts` | Address + ABI source-of-truth pattern |
| `frontend/src/hooks/` | wagmi hooks pattern (v3) |
| `docs/grants/CIRCLE_GRANT_README.md` | Grant narrative, honest Circle product claims |
| `docs/integration/resolution-adapter-design.md` | Public resolution API design |
| `docs/final/DEPLOYED_ADDRESSES.md` | Explorer links, USDC address |
| `hardhat.config.js` | Arc Testnet network config |
| `indexer/` | Subgraph pattern (optional for AgentPay job indexing later) |

### ArcNS facts verified locally

- **Chain ID:** 5042002  
- **RPC:** `https://rpc.testnet.arc.network`  
- **Explorer:** `https://testnet.arcscan.app`  
- **USDC (ERC-20):** `0x3600000000000000000000000000000000000000` (6 decimals for registration payments)  
- **Production app:** https://arcns-app.vercel.app  
- **Public resolver API:** `GET https://arcns-app.vercel.app/api/v1/resolve/name/{name}` (documented in `docs/final/FINAL_STATUS.md`)

### What can be reused from ArcNS

| Asset | Reuse type | Effort |
|-------|------------|--------|
| `deployments/arc_testnet-v3.json` | Copy or symlink addresses into AgentPay config | Low |
| Arc Testnet network block in `hardhat.config.js` | Copy network definition | Low |
| USDC approve + transfer patterns (Controller) | Reference for escrow `approve`/`fund` UX | Medium |
| Public HTTP resolver (`/api/v1/resolve/name/`) | **Direct reuse** for `.arc` / `.circle` agent payout addresses | Low |
| Frontend wagmi provider + chain config | Adapt structure | Medium |
| Grant/demo documentation style | Copy tone and honesty standards | Low |
| Subgraph indexing pattern | Phase 2 for job dashboard stats | High |

### What should NOT be reused blindly

- ArcNS registration commit-reveal flow (irrelevant to escrow)  
- NFT/registrar contracts as AgentPay core (wrong domain)  
- Claiming ArcNS is “AgentPay identity layer” without ERC-8004 integration  

---

## FlowPay repository availability

| Question | Answer |
|----------|--------|
| GitHub `https://github.com/khenzarr/flowpay` cloned at expected path? | **Partial** — `NODE\flowpay\flowpay` (nested app root) |
| Usable for reuse? | **Yes** |

### Relevant FlowPay paths

| Path | Relevance |
|------|-----------|
| `lib/chains.ts` | Arc Testnet chain registry, explorer URLs, USDC/native decimal notes |
| `lib/wagmi.ts` | wagmi v3 config, MetaMask connectors, Arc-first chain ordering |
| `providers/WagmiProvider.tsx` | React provider pattern |
| `lib/arcnsResolver.ts` | **Production-tested** ArcNS HTTP resolver client |
| `hooks/useArcNSResolution.ts` | Debounced name resolution hook |
| `components/ArcNSResolutionStatus.tsx` | Resolution UX states |
| `lib/appkit.ts` | App Kit singleton (**minimal usage elsewhere**) |
| `package.json` | Stack reference: Next 16, wagmi 3, viem, `@circle-fin/app-kit` |
| `__tests__/arcnsResolver.test.ts` | Test patterns for resolver |

### FlowPay facts verified locally

- **Primary chain:** Arc Testnet (5042002)  
- **Stack:** Next.js 16 App Router, wagmi v3, viem, Tailwind v4  
- **ArcNS integration:** HTTP adapter to `arcns-app.vercel.app` — **implemented and tested**  
- **Circle App Kit:** Listed in `package.json`; `lib/appkit.ts` exports `new AppKit()` only — **no evidence of Send/Bridge UI wired in app code** (grep: only `appkit.ts`)

### What can be reused from FlowPay

| Asset | Reuse |
|-------|-------|
| `lib/chains.ts` (Arc section) | Chain + explorer constants |
| `lib/wagmi.ts` | Wallet connection baseline |
| `lib/arcnsResolver.ts` + hook + status component | Agent recipient resolution on create-job |
| Send UX patterns (from README / app structure) | Payment form, fee display, tx hash + explorer link |
| Vitest setup | Frontend unit tests |

### What is missing in FlowPay for AgentPay

- Job/escrow contracts or ABIs  
- Job lifecycle UI  
- Agent registry  
- Dashboard stats for escrow  

---

## Official Arc references (not in local repo)

Verified via fetch during discovery (see `REFERENCE_SOURCE_MAP.md`):

| Resource | Key fact for AgentPay |
|----------|----------------------|
| ERC-8183 tutorial | Reference contract `0x0747EEf0706327138c69792bF28Cd525089e4583`; states: Open → Funded → Submitted → Completed |
| ERC-8004 tutorial | IdentityRegistry `0x8004A818BFB912233c491871b3d84c89A494BD9e` (testnet) — roadmap |
| Connect to Arc | Chain ID 5042002, RPC, faucet |
| Build payments | USDC-native P2P narrative, App Kit pointers |

---

## Gap analysis

| Area | Status |
|------|--------|
| AgentPay repo code | **Missing** (empty) |
| Escrow contract in agentpay | **Missing** — use Arc ERC-8183 ref **or** deploy custom |
| Frontend | **Missing** |
| Demo agents | **Missing** — static JSON config acceptable for MVP |
| CI/tests | **Missing** |
| Circle Wallets / entity secret | **Not in repo** — required only if following official ERC-8183 **script** path |
| Subgraph for jobs | **Missing** — optional; can read contract + events in MVP |

---

## Recommended starting point

1. **Initialize monorepo** in `agentpay/`: `contracts/`, `frontend/`, `docs/`, shared `deployments/arc_testnet.json`.
2. **Escrow MVP decision (founder):**  
   - **Option A (recommended):** Call Arc’s **ERC-8183 reference** at `0x0747EEf0706327138c69792bF28Cd525089e4583` via wagmi — fastest grant alignment, no new escrow audit surface.  
   - **Option B:** Deploy custom `AgentPayEscrow.sol` mirroring simplified states — more narrative control, more security responsibility.
3. **Copy** FlowPay Arc chain config + ArcNS resolver module into frontend.
4. **Copy** USDC + network addresses from ArcNS `deployments/arc_testnet-v3.json`.
5. **Demo agents:** `frontend/src/config/demo-agents.json` (name, address, description, optional `.arc` name).
6. **Do not** mark App Kit, CCTP, Gateway, or Circle Wallets as integrated until wired and demoed.

---

## Related local projects (context only)

| Path | Relation |
|------|----------|
| `NODE\ArcNameServices\arcns` | Sister identity project — payment identifier resolution |
| `NODE\flowpay\flowpay` | Sister payments UX — wallet + USDC send patterns |
| `NODE\agent` | Not inspected in depth — **UNVERIFIED** relevance |

---

## Inspection limits

- No `git` history or remotes verified for agentpay (empty).  
- ArcNS/FlowPay inspected via README, deployments, and targeted grep — not full contract audit.  
- ERC-8183 ABI not vendored locally — must be pulled from Arc docs or explorer before implementation.
