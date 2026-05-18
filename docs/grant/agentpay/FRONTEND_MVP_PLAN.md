# Frontend MVP Plan

**Stack (recommended):** Match FlowPay — Next.js 16 App Router, React 19, wagmi v3, viem, Tailwind v4, TanStack Query.

**Bootstrap:** Copy/adapt from `NODE\flowpay\flowpay` — not from scratch.

---

## Pages

| Route | Purpose | Key components |
|-------|---------|----------------|
| `/` | Landing: thesis, how it works, Connect CTA | `Hero`, `HowItWorks`, `ConnectButton` |
| `/agents` | Demo agent grid | `AgentCard`, link to create job |
| `/create-job` | Job form + fund flow | `JobForm`, `ArcNSRecipientField`, `FundPanel` |
| `/jobs` | Dashboard list + aggregate stats | `StatsBar`, `JobTable` |
| `/jobs/[id]` | Job detail + actions | `JobStatusStepper`, `DeliverablePanel`, `ActionButtons`, `TxLink` |
| `/payments` | Settlement history | `PaymentEventList` |

---

## Components (shared)

| Component | Responsibility |
|-----------|----------------|
| `ConnectButton` | wagmi connect/disconnect; show chain |
| `NetworkGuard` | Block actions if `chainId !== 5042002` |
| `UsdcBalance` | Read USDC balance (ERC-20) |
| `TxButton` | Write contract + pending + success hash |
| `ArcScanLink` | `https://testnet.arcscan.app/tx/{hash}` |
| `JobStatusBadge` | Color-coded status |
| `JobStatusStepper` | Open → Funded → Submitted → Completed |
| `ArcNSRecipientField` | Port from FlowPay `arcnsResolver` + `ArcNSResolutionStatus` |
| `StatsBar` | Total jobs, escrowed, completed, paid out |
| `DeliverableHashInput` | Text → `keccak256` client-side |
| `RoleHint` | Shows which wallet should act (client vs agent) |

---

## Wallet integration

| Item | Source |
|------|--------|
| Chain definition | FlowPay `lib/chains.ts` (arc only for MVP) |
| wagmi config | FlowPay `lib/wagmi.ts` (trim to Arc-only chains) |
| Provider | FlowPay `providers/WagmiProvider.tsx` |
| Connectors | MetaMask + injected |

**Env:**

```env
NEXT_PUBLIC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_CHAIN_ID=5042002
NEXT_PUBLIC_USDC_ADDRESS=0x3600000000000000000000000000000000000000
NEXT_PUBLIC_ESCROW_ADDRESS=0x0747EEf0706327138c69792bF28Cd525089e4583
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=   # optional
```

---

## Contract interaction plan

### Reads (`useReadContract` / publicClient)

| Call | Use |
|------|-----|
| `getJob(jobId)` | Detail page |
| `USDC.balanceOf(user)` | Header |
| `USDC.allowance(user, escrow)` | Pre-fund |
| Event logs `getLogs` | Dashboard + payments (optional) |

### Writes (`useWriteContract` + wait)

| Step | Function | Wallet role |
|------|----------|-------------|
| 1 | `createJob(...)` | Client |
| 2 | `setBudget(jobId, amount, 0x)` | Agent |
| 3 | `approve(escrow, amount)` | Client |
| 4 | `fund(jobId, 0x)` | Client |
| 5 | `submit(jobId, hash, 0x)` | Agent |
| 6 | `complete(jobId, reasonHash, 0x)` | Evaluator (client in demo) |

**ABI source:** Arc tutorial full script or ArcScan verified ABI — **must be vendored in `frontend/src/lib/abis/` before build**.

### Transaction UX pattern (from FlowPay)

1. Show route preview / action label  
2. User confirms in wallet  
3. Show pending spinner  
4. On success: ArcScan link + refresh job state  

---

## UI states

### Global

| State | UI |
|-------|-----|
| Wallet disconnected | CTA to connect |
| Wrong network | Banner + “Switch to Arc Testnet” |
| RPC error | Retry toast |

### Create job

| State | UI |
|-------|-----|
| Idle | Form enabled |
| Invalid agent address | Inline error |
| ArcNS resolving | Spinner on name field |
| ArcNS resolved | Show checksum address |
| Tx pending | Disable form |
| Success | Redirect to `/jobs/[id]` |

### Job detail

| State | Actions visible |
|-------|-----------------|
| Open | Fund (client), Set budget (agent) if needed |
| Funded | Submit deliverable (agent) |
| Submitted | Complete (evaluator) |
| Completed | Read-only + payout tx link |

### Dashboard stats

| Stat | Source (MVP) |
|------|--------------|
| Total jobs | Counter from indexed events or manual `jobId` max |
| Total escrowed | Sum Funded jobs’ budget minus Completed |
| Completed jobs | Count status = Completed |
| Total paid out | Sum budgets of Completed jobs |

**MVP shortcut:** Read from contract + localStorage cache; subgraph later.

---

## ArcScan links

| Entity | URL pattern |
|--------|-------------|
| Transaction | `https://testnet.arcscan.app/tx/{hash}` |
| Address | `https://testnet.arcscan.app/address/{address}` |
| Contract | `https://testnet.arcscan.app/address/{escrow}` |

---

## Demo agents config

`frontend/src/config/demo-agents.json`:

```json
[
  {
    "id": "research-bot",
    "name": "Research Bot",
    "description": "Summarizes documents and returns IPFS hash",
    "address": "0x...",
    "arcnsName": "research.agent.arc"
  }
]
```

Pre-register ArcNS names **optional** — **UNVERIFIED** unless founder controls names.

---

## Styling

- Reuse FlowPay Tailwind tokens / dark-friendly layout  
- Distinct brand from ArcNS (escrow/jobs, not domains)  
- Status colors: gray (open), blue (funded), amber (submitted), green (completed)  

---

## Testing (frontend)

| Type | Target |
|------|--------|
| Unit | `deliverableHash` util, ArcNS resolver (copy FlowPay tests) |
| Component | `JobStatusBadge`, `NetworkGuard` |
| Manual | Full demo script on testnet |

---

## Out of scope (frontend MVP)

- App Kit modal send/bridge  
- Circle Wallets embedded UI  
- IPFS upload widget (hash paste only)  
- i18n  
