# Open Questions

**Last updated:** 2026-05-17  
Items marked **UNVERIFIED** must be confirmed before grant claims or implementation.

---

## Founder decisions required

| ID | Question | Options | Recommendation |
|----|----------|---------|----------------|
| D1 | Escrow implementation? | A) Arc ERC-8183 reference `0x0747…4583` · B) Custom `AgentPayEscrow.sol` · C) Both (wrapper later) | **A** for MVP |
| D2 | Separate grant from ArcNS? | Same cohort application vs complementary mention | Clarify with Circle to avoid overlap rejection |
| D3 | Demo agent wallets | Use founder-controlled keys vs Circle Dev Wallets | EOAs for reviewer simplicity |
| D4 | Evaluator role in demo | Client = evaluator (tutorial default) vs separate wallet | Client = evaluator |
| D5 | ArcNS in MVP? | Required vs optional nice-to-have | Optional for week-1; week-2 if time |
| D6 | Public repo timing | Open source at application vs post-acceptance | Open before demo video |
| D7 | Brand relationship | “AgentPay by ArcNS team” vs standalone | Complementary branding |

---

## Technical unknowns

| ID | Topic | Status | Action |
|----|-------|--------|--------|
| T1 | Full ERC-8183 ABI + events | **Partial** — tutorial ABI in `src/abi/erc8183AgenticCommerce.ts` | Export full ABI from ArcScan implementation behind proxy |
| T2 | Cancel/refund on reference contract | **UNVERIFIED** | Read contract source on ArcScan |
| T3 | `setBudget` who calls when | Documented: provider | Enforce in UI copy |
| T4 | Job ID discovery for dashboard | **UNVERIFIED** | Event indexing vs sequential scan |
| T5 | USDC ERC-20 vs native gas decimals | Documented: 6 (ERC-20), 18 (native gas) | Never use FlowPay native transfer for escrow |
| T6 | ERC-8183 `getJob` return struct | **UNVERIFIED** | Decode from ABI |
| T7 | Hook parameter non-zero flows | Out of MVP | Stay `address(0)` |
| T8 | Reference contract upgradeability | **UNVERIFIED** | Check ArcScan proxy pattern |

---

## Missing credentials / config

| Item | Needed for | Owner |
|------|------------|-------|
| `PRIVATE_KEY` (deployer, demo) | Deploy/custom tests | Founder |
| `NEXT_PUBLIC_RPC_URL` | Frontend | Default public RPC ok for MVP |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Mobile wallets | Optional |
| `CIRCLE_API_KEY` + `CIRCLE_ENTITY_SECRET` | Only if using Dev Wallets path | Founder |
| `NEXT_PUBLIC_KIT_KEY` | App Kit phase | Founder |
| Vercel project | Hosted demo | Founder |

**Security:** Never commit `.env` or keys to `agentpay` repo.

---

## External dependencies

| Dependency | Risk |
|------------|------|
| Arc Testnet RPC availability | Have backup RPC from connect-to-arc docs |
| Circle faucet rate limits | Pre-fund wallets 24h early |
| ArcNS API `arcns-app.vercel.app` | Graceful fallback to hex addresses |
| ERC-8183 contract not upgraded/deprecated | Monitor Arc docs changelog |

---

## Grant / legal

| Question | Notes |
|----------|-------|
| Prior Circle grant on ArcNS? | Disclose if same cohort |
| IP license for AgentPay | MIT suggested to match ArcNS contracts |
| Conflicting milestone promises | Align ArcNS vs AgentPay roadmaps |

---

## Implementation gate

**Scaffold phase (Master Prompt #2) — complete:**

- [x] Planning docs complete  
- [x] **D1** escrow path — ERC-8183 reference  
- [x] **T1** partial ABI from Arc tutorial  
- [x] Frontend boots; typecheck + build pass  

**Full demo gate — still required:**

- [ ] Two wallets funded on Arc Testnet (client + agent)  
- [ ] `NEXT_PUBLIC_DEMO_AGENT_ADDRESS` set to real agent wallet  
- [ ] One successful end-to-end lifecycle on testnet  
- [ ] JobCreated → auto job ID UX  
- [ ] Founder accepts honest Circle checkbox policy (`CIRCLE_ALIGNMENT.md`)  

---

## Post-Implementation Setup Questions

| ID | Question | Owner |
|----|----------|-------|
| P1 | What is the **agent wallet address** for demo? | Founder — set in `.env.local` |
| P2 | What is the **client wallet** used for demo video? | Founder |
| P3 | Confirm **setBudget before fund** order works on live contract | Founder — test `/jobs/1` flow |
| P4 | Export **full ArcScan ABI** for implementation proxy? | Engineering — optional hardening |
| P5 | Register demo **`.arc` name** for agent? | Founder — optional ArcNS |
| P6 | Deploy frontend to **Vercel** URL for grant form? | Founder |
| P7 | Run first **testnet smoke** and record tx hashes as backup? | Founder |
| P8 | Approve **Master Prompt #3** scope (events, job list, demo polish)? | Founder |

---

## Resolved in discovery (for reference)

| Item | Resolution |
|------|------------|
| agentpay repo empty? | Yes — greenfield |
| ArcNS local path? | `NODE\ArcNameServices\arcns` |
| FlowPay local path? | `NODE\flowpay\flowpay` |
| Arc Testnet USDC address? | `0x3600000000000000000000000000000000000000` (ArcNS + Arc docs) |
| ERC-8183 reference address? | `0x0747EEf0706327138c69792bF28Cd525089e4583` (Arc docs) |

---

## Post-MVP Demo Questions

- Which client wallet will be used?
- Which agent wallet will be used?
- Should evaluator remain client wallet for demo?
- What from-block should be used for indexing?
- Will ArcNS name resolution be shown in the recorded demo?
- Which docs should be public vs internal before GitHub push?
- What URL will be used for deployed demo?
- What X handle/project website will be used in grant form?
