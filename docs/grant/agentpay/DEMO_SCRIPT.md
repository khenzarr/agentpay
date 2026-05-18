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

1. `src/config/contracts.ts` or env-configured addresses — USDC + ERC-8183 reference contract  
2. `src/abi/erc8183AgenticCommerce.ts` — ERC-8183 tutorial ABI subset  
3. `src/app/jobs/[id]/page.tsx` + `src/components/agentpay/JobDetailPanel.tsx` — lifecycle UI  

**Do not overclaim:** Only state verified statuses shown in docs/evidence.

---

## Minute 1:15–1:45 — Circle product usage + verified evidence

**Screen:** Split: app + ArcScan

**Say:**

> “This demo uses **Circle USDC** on Arc Testnet and smart-contract settlement. Beyond the core escrow flow, we have separate verified evidence for App Kit Send, Bridge/CCTP, Gateway/Unified Balance deposit+estimate path, and Circle Wallets wallet creation + metadata read. We do not claim Wallet signing/send/gasless or Paymaster.”

**Show:**

- USDC balance in wallet  
- Contract address on ArcScan (escrow)  
- USDC token contract `0x3600…0000`  
- Briefly show evidence docs for:
  - App Kit Send tx `0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb`
  - Bridge/CCTP approve/burn/mint tx set
  - Gateway UB deposit tx `0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a` + spend estimate
  - Circle Wallets ARC-TESTNET wallet creation + metadata read proof

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

> “AgentPay is the settlement layer for agents on Arc—built by the team behind **ArcNS**. Today we demonstrate verified Arc Testnet escrow lifecycle plus verified Circle integration evidence with strict claim boundaries. Architecture is mainnet-ready, waiting for Arc mainnet availability.”

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
| Is this fully ERC-8183 compliant? | No claim of full compliance. We implement and verify the ERC-8183 tutorial ABI lifecycle subset on Arc Testnet. |
| What is Circle Wallets status? | Circle Developer-Controlled Wallet creation + metadata read is verified on ARC-TESTNET; signing/send/gasless are not claimed. |
| Is Paymaster integrated? | No. Paymaster is feasible in principle but remains NOT_CLAIMED until real sponsored/gasless tx proof exists. |
| Relation to ArcNS? | ArcNS = identity; AgentPay = settlement. Complementary. |
