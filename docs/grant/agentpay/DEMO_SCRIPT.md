# Grant Demo Script (≤ 5 minutes)

**Title:** AgentPay for Arc — USDC escrow for AI agents  
**Target length:** 4:30–5:00  
**Wallets:** Browser A = Client/Evaluator · Browser B = Agent/Provider

---

## Pre-demo checklist (5 min before record)

- [ ] Both wallets on **Arc Testnet** (5042002)  
- [ ] Client wallet ≥ 5 USDC (testnet)  
- [ ] Agent wallet has small USDC for gas  
- [ ] App deployed locally or Vercel URL ready  
- [ ] ArcScan open in tab  
- [ ] Close unrelated tabs; zoom 125% for readability  

---

## Minute 0:00–0:30 — Hook & problem

**Screen:** Landing `/`

**Say:**

> “AI agents can do work, but getting paid on-chain is still fragmented. **AgentPay** is USDC-native escrow on **Arc**: you fund a job, the agent submits a deliverable hash, and you settle in USDC with full transparency on ArcScan.”

**Show:** Hero, Connect wallet (Client).

---

## Minute 0:30–1:15 — Codebase walkthrough

**Screen:** IDE — repo structure

**Say:**

> “We built on Arc’s **agentic economy** primitives. Our frontend uses **wagmi** on Arc Testnet. Escrow integrates the **ERC-8183 reference contract** Circle documents for Arc—not a black-box payment link.”

**Show (30 sec each):**

1. `deployments/arc_testnet.json` or env — USDC + escrow addresses  
2. `frontend/src/lib/abis/` — ERC-8183 ABI  
3. `frontend/src/app/jobs/[id]/` — lifecycle UI  

**Do not say:** “We integrated Bridge Kit / Gateway” unless shown in code.

---

## Minute 1:15–1:45 — Circle product usage

**Screen:** Split: app + ArcScan

**Say:**

> “This demo uses **Circle USDC** on Arc Testnet and **smart contract** settlement. We’re not claiming CCTP or Wallets yet—those are on our roadmap.”

**Show:**

- USDC balance in wallet  
- Contract address on ArcScan (escrow)  
- USDC token contract `0x3600…0000`  

---

## Minute 1:45–3:30 — Product flow (live)

### Step 1 — Agents (Browser A)

**Screen:** `/agents` → select “Research Bot” → Create job

**Say:** “I’m hiring a demo agent. I can pay a raw address or an **ArcNS** `.arc` name.”

**Do:** Create job — description, budget (e.g. 1 USDC), expiry.  
**Show:** ArcScan `createJob` tx.

### Step 2 — Fund (Browser A)

**Do:** Approve USDC → Fund escrow.  
**Show:** Job status **Funded**; ArcScan `fund` tx.

### Step 3 — Submit (Browser B)

**Switch** to Agent wallet.

**Screen:** `/jobs/[id]`

**Say:** “The agent submits a deliverable hash—content can live off-chain; the commitment is on-chain.”

**Do:** Paste string → submit hash.  
**Show:** Status **Submitted**; ArcScan `submit` tx.

### Step 4 — Complete (Browser A)

**Switch** back to Client/Evaluator.

**Do:** Complete / approve job.  
**Show:** Status **Completed**; agent USDC balance increased; ArcScan `complete` tx.

---

## Minute 3:30–4:15 — Dashboard & ArcNS (optional)

**Screen:** `/jobs` + `/payments`

**Say:**

> “Dashboard shows total jobs, escrowed volume, and completed payouts—all verifiable on ArcScan.”

**If ArcNS used:** Show name resolution on create-job.

---

## Minute 4:15–5:00 — Closing narrative

**Screen:** Landing or roadmap slide

**Say:**

> “AgentPay is the settlement layer for agents on Arc—built by the team behind **ArcNS**. Today: USDC escrow on testnet. Next: **ERC-8004** agent identity, **Circle App Kit** for cross-chain funding, and **CCTP** for multichain treasuries. Arc isn’t just where agents run—it’s where they get paid.”

**End card:** GitHub URL · ArcScan contract · arcns-app.vercel.app (sister project)

---

## Backup if live tx fails

1. Switch to pre-recorded ArcScan tx tabs (label dates).  
2. Walk through UI in read-only mode with completed job ID.  
3. Narrate: “Testnet congestion—we validated this flow in rehearsal” + show smoke test log.

---

## Video chapters (for editor)

| Time | Chapter |
|------|---------|
| 0:00 | Problem |
| 0:30 | Code |
| 1:15 | Circle USDC |
| 1:45 | Live demo |
| 3:30 | Dashboard |
| 4:15 | Roadmap |

---

## Grant reviewer FAQ (verbal prep)

| Question | Answer |
|----------|--------|
| Is this ERC-8183 compliant? | We integrate Arc’s reference implementation; full compliance is validated against their ABI and our test suite. |
| Why not Circle Wallets? | MVP uses MetaMask for reviewer accessibility; Wallets on roadmap for autonomous agents. |
| Relation to ArcNS? | ArcNS = identity; AgentPay = settlement. Complementary. |
