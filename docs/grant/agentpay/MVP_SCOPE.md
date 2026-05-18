# MVP Scope

---

## Exact MVP features

| ID | Feature | Implementation target |
|----|---------|----------------------|
| F1 | Connect wallet on Arc Testnet | wagmi + MetaMask (pattern from FlowPay) |
| F2 | Demo AI agent list | Static JSON + cards on `/agents` |
| F3 | Create job | `createJob` on ERC-8183 reference (or custom escrow) |
| F4 | Set job budget | `setBudget` (provider/agent wallet) |
| F5 | Fund escrow with USDC | `approve` + `fund` |
| F6 | Job status display | Map contract status → UI labels |
| F7 | Submit deliverable | `submit(jobId, bytes32 hash, bytes)` |
| F8 | Approve / complete job | `complete(jobId, reasonHash, bytes)` — releases USDC |
| F9 | ArcScan links | All major txs linked via `testnet.arcscan.app` |
| F10 | Dashboard stats | Total jobs, escrowed USDC, completed, paid out |
| F11 | Landing page | Product thesis + CTA |
| F12 | Payment history view | Event log or tx list on `/payments` |

---

## Must-have vs nice-to-have

| Must-have | Nice-to-have |
|-----------|--------------|
| F1–F10 | F11 polished marketing copy |
| Single escrow path (ERC-8183 ref recommended) | F12 full indexer |
| Two-wallet demo (client + agent) | ArcNS name for agent address |
| Error states for wrong network | IPFS deliverable preview |
| Basic loading/empty states | ERC-8004 agent card metadata |
| | Cancel/refund flow |
| | Custom `AgentPayEscrow.sol` branding |

---

## UI state mapping (ERC-8183 reference)

Arc docs define contract states:

| Contract status | UI label | User-visible actions |
|-----------------|----------|----------------------|
| Open | Created / Open | Set budget (provider), fund (client) |
| Funded | Funded | Submit deliverable (provider) |
| Submitted | Submitted | Complete / approve (evaluator) |
| Completed | Paid / Completed | View payout tx |

**Note:** User prompt listed separate “Approved” and “Paid”—for ERC-8183 reference, **`complete` combines approval and release**. Custom escrow may split later.

---

## Demo acceptance criteria

| # | Criterion | Pass condition |
|---|-----------|----------------|
| D1 | Wallet connect | Shows Arc Testnet address |
| D2 | Create job | Tx on ArcScan; job ID retrievable |
| D3 | Fund escrow | USDC leaves client; job = Funded |
| D4 | Submit | Deliverable hash on-chain; job = Submitted |
| D5 | Complete | USDC received by provider; job = Completed |
| D6 | Dashboard | Counts update after refresh or event |
| D7 | Video length | ≤ 5 minutes |
| D8 | Honesty | Narrator does not claim unchecked Circle products |
| D9 | ArcScan | ≥ 4 distinct tx links shown |
| D10 | Recovery | Wrong-network message if not on 5042002 |

---

## Non-goals (MVP)

- Mainnet  
- Disputed jobs  
- Multi-milestone escrow  
- On-chain agent registry (ERC-8004)  
- Circle Developer Controlled Wallets requirement for users  
- App Kit Bridge / CCTP / Gateway  
- Paymaster / account abstraction  
- EURC  
- Mobile-native app  
- Production-grade subgraph (optional)  
- External security audit of new contracts  
- MockUSDC if testnet USDC available (prefer faucet USDC)

---

## Technical constraints

| Constraint | Value |
|------------|-------|
| Chain | Arc Testnet (5042002) |
| Token | USDC ERC-20 at `0x3600000000000000000000000000000000000000` |
| Escrow | ERC-8183 ref `0x0747EEf0706327138c69792bF28Cd525089e4583` (recommended) |
| Wallets | User-controlled EOAs (MetaMask) |
| Agent identities | Off-chain demo config |

---

## Optional ArcNS (nice-to-have)

- Input: `agent.arc` on create-job  
- Resolve via `https://arcns-app.vercel.app/api/v1/resolve/name/{name}` (FlowPay module)  
- Block send on `zero_address`, `not_found`, `adapter_unavailable`  

---

## Definition of done (engineering)

- [ ] Repo initialized with contracts + frontend  
- [ ] README with env setup and faucet link  
- [ ] Testnet deploy config OR reference contract addresses wired  
- [ ] Happy-path script or manual test doc executed once  
- [ ] Demo script rehearsed end-to-end  
- [ ] Grant docs in `docs/grant/agentpay/` match shipped behavior  
