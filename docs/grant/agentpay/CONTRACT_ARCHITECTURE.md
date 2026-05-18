# Contract Architecture

**Status:** Planning only — no contracts in `agentpay` repo yet.

---

## Architecture decision (recommended for MVP)

| Option | Description | Grant risk | Security surface |
|--------|-------------|------------|------------------|
| **A — ERC-8183 reference (recommended)** | Integrate Arc-deployed Agentic Commerce at `0x0747EEf0706327138c69792bF28Cd525089e4583` | Lowest; aligns with Arc agentic tutorials | Inherits reference impl security |
| **B — Custom `AgentPayEscrow.sol`** | Simplified state machine per prompt | Must not imply official ERC-8183 compliance | New audit surface |
| **C — Hybrid** | Wrapper UI + reference contract | Medium narrative complexity | Wrapper + reference |

**Recommendation:** **Option A** for fastest, safest demo; **Option B** only if founder requires branded escrow logic not in reference (e.g. explicit Cancel/Refund).

---

## Proposed contracts (full product vision)

### 1. `AgentPayEscrow.sol` (Option B — custom MVP)

Only deploy if not using Option A.

**Responsibilities:**

- Job CRUD lifecycle with USDC escrow  
- Role-based access: `client`, `agent` (provider), `evaluator` (may equal client)  
- Deliverable submission as `bytes32` hash  
- Single release path; optional cancel/refund  

**Suggested state enum:**

```solidity
enum JobStatus {
    Created,    // job record exists, not funded
    Funded,     // USDC in escrow
    Submitted,  // deliverable hash set
    Approved,   // evaluator approved (optional if merge with Paid)
    Paid,       // USDC transferred to agent
    Cancelled,  // cancelled before fund
    Refunded    // funded but returned to client
}
```

**Mapping to ERC-8183 reference (Option A):**

| AgentPay (custom) | ERC-8183 ref |
|-------------------|--------------|
| Created | Open |
| Funded | Funded |
| Submitted | Submitted |
| Paid | Completed |
| Approved | *(merged into complete)* |

### 2. `AgentRegistry.sol` (optional — post-MVP)

- Register agent metadata URI, payout address, active flag  
- **MVP substitute:** `demo-agents.json` off-chain  
- **Evolution:** read ERC-8004 `IdentityRegistry` at `0x8004A818…` per Arc docs — **UNVERIFIED ABI in local repo**

### 3. `MockUSDC.sol` (discouraged on Arc Testnet)

- Arc Testnet provides USDC at `0x3600000000000000000000000000000000000000`  
- Use Circle faucet; **no mock** unless faucet blocked  

---

## ERC-8183 reference lifecycle (Option A — from Arc docs)

```
createJob(provider, evaluator, expiredAt, description, hook)
    → status: Open

setBudget(jobId, amount, optParams)   [provider]

approve(USDC, escrow, amount)         [client]
fund(jobId, optParams)                [client]
    → status: Funded

submit(jobId, deliverableHash, optParams)  [provider]
    → status: Submitted

complete(jobId, reasonHash, optParams)     [evaluator]
    → status: Completed (USDC released)
```

**Parameters verified from Arc tutorial (2026-05-17 fetch):**

- USDC: `0x3600000000000000000000000000000000000000`  
- Escrow: `0x0747EEf0706327138c69792bF28Cd525089e4583`  
- Budget uses **6 decimals** (`formatUnits(job.budget, 6)` in tutorial)  
- `hook` = `address(0)` for default path  

---

## Storage model (custom escrow — Option B)

```solidity
struct Job {
    address client;
    address agent;
    address evaluator;
    uint256 amount;          // USDC base units (6 decimals)
    uint256 createdAt;
    uint256 expiresAt;
    bytes32 deliverableHash;
    JobStatus status;
    string description;      // or emit in event only to save gas
}

mapping(uint256 => Job) public jobs;
uint256 public nextJobId;
IERC20 public immutable usdc;
```

**Events (every transition):**

```solidity
event JobCreated(uint256 indexed jobId, address indexed client, address indexed agent, uint256 amount);
event JobFunded(uint256 indexed jobId, uint256 amount);
event DeliverableSubmitted(uint256 indexed jobId, bytes32 deliverableHash);
event JobApproved(uint256 indexed jobId);
event JobPaid(uint256 indexed jobId, address indexed agent, uint256 amount);
event JobCancelled(uint256 indexed jobId);
event JobRefunded(uint256 indexed jobId, uint256 amount);
```

For Option A, index official contract events—**exact event names UNVERIFIED until ABI import**.

---

## Access control

| Action | Authorized party |
|--------|------------------|
| Create job | Client (or factory) |
| Fund | Client |
| Submit deliverable | Agent address on job |
| Approve / complete | Evaluator address |
| Cancel (unfunded) | Client |
| Refund (funded, not submitted) | Client + time rule (custom only) |

**Checks:**

- `nonReentrant` on USDC transfer paths  
- `require(amount > 0)`  
- `require(addr != address(0))`  
- Prevent double `complete` / `Paid`  
- `submit` only when Funded  
- `complete` only when Submitted  

---

## USDC integration

| Topic | Guidance |
|-------|----------|
| Token address | `0x3600000000000000000000000000000000000000` (ArcNS deployment + Arc tutorial) |
| Decimals | **6** for ERC-20 escrow amounts (ERC-8183 tutorial) |
| Pattern | `safeTransferFrom` / OpenZeppelin `SafeERC20` |
| Approval | Client approves escrow contract before `fund` |
| Native USDC gas | Separate from escrow; wallet needs USDC for gas on Arc |

**FlowPay note:** Native `value` transfers use 18 decimals—**do not mix** with ERC-20 escrow math.

---

## Security notes (MVP)

| Threat | Mitigation |
|--------|------------|
| Reentrancy | `ReentrancyGuard` on external calls before state updates |
| Double payout | Status checks; single terminal `Paid`/`Completed` |
| Unauthorized submit | `msg.sender == job.agent` |
| Unauthorized complete | `msg.sender == job.evaluator` |
| Zero address | Validate client, agent, evaluator, USDC |
| Integer overflow | Solidity 0.8+; use OZ |
| Expired jobs | `expiresAt` check on fund/complete (custom); verify ref behavior |
| USDC fee-on-transfer | Standard USDC—assume no fee; document assumption |

**Disputed:** Out of MVP scope.

---

## ArcNS resolver helper (off-chain, not a contract)

- HTTP: `GET /api/v1/resolve/name/{name}`  
- Used at job creation to resolve agent address  
- On-chain fallback: user pastes `0x` address  

---

## Deployment plan (testnet)

| Step | Action |
|------|--------|
| 1 | If Option A: no escrow deploy; record reference + USDC addresses |
| 2 | If Option B: Hardhat deploy to `arc_testnet`; verify on ArcScan |
| 3 | Write `deployments/arc_testnet.json` |
| 4 | Generate frontend `generated-contracts.ts` (ArcNS pattern) |

---

## Testing plan (contracts)

| Test | Option A | Option B |
|------|----------|----------|
| Fork Arc Testnet | Integration read calls | + deploy escrow |
| Unit tests | ABI encode/decode helpers | Full state machine |
| Happy path script | viem script mirroring Arc tutorial | hardhat test |
| Adversarial | Wrong signer reverts | Same |

---

## Open contract unknowns

- Full ERC-8183 ABI and event list — **import from ArcScan before coding**  
- Cancel/refund support on reference contract — **UNVERIFIED**  
- `setBudget` ordering vs `createJob` — follow tutorial order  
