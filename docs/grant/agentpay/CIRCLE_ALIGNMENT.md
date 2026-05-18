# Circle Product Alignment — Final Claim Boundary (AgentPay)

**Last updated:** 2026-05-19  
**Purpose:** Single-source claim boundary for grant/demo narration.

---

## 1) Current verified status (claimable)

| Integration | Status | Claim-safe wording |
|---|---|---|
| Arc Testnet execution | **CURRENT_VERIFIED** | Live on Arc Testnet |
| USDC escrow lifecycle | **CURRENT_VERIFIED** | USDC-native escrow create → fund → submit → complete |
| Contracts / smart contract interaction | **CURRENT_VERIFIED** | Contract interactions verified on Arc Testnet |
| ERC-8183 lifecycle scope | **CURRENT_VERIFIED (tutorial subset)** | ERC-8183 tutorial ABI lifecycle subset implemented and verified |
| Real AgentPay job lifecycle | **CURRENT_VERIFIED** | Real job lifecycle proof captured |
| ArcNS identity support | **CURRENT_VERIFIED (optional)** | Optional ArcNS display/resolution support |
| App Kit Send | **CURRENT_VERIFIED** | Live send verified (tx proof available) |
| Bridge / CCTP | **CURRENT_VERIFIED** | Ethereum Sepolia → Arc Testnet bridge flow verified (approve/burn/mint proofs) |
| Circle Wallets (Developer-Controlled) | **CURRENT_VERIFIED (limited scope)** | Wallet creation + metadata read verified on ARC-TESTNET |
| Gateway / Unified Balance | **CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED** | Supported-chain check + live deposit + confirmed balance + spend estimate verified; live spend not executed due high fee |

---

## 2) Not claimed / blocked

| Item | Status | Reason |
|---|---|---|
| Circle Wallets signing/send/gasless | **NOT_CLAIMED** | ARC-TESTNET USDC Wallet token ID unresolved from SDK lookup path (`candidateCount=0`); no sign/send proof |
| Paymaster | **NOT_CLAIMED** | Feasible in principle, but no sponsored/gasless tx proof |
| Full ERC-8183 compliance | **NOT_CLAIMED** | Only tutorial ABI lifecycle subset is verified |
| Full ERC-8004 compliance | **NOT_CLAIMED** | Not fully implemented/verified in this MVP |

---

## 3) Security claim guardrails

- `.env.circle.local` is git-ignored.
- `.circle-recovery` is git-ignored.
- No Circle API key or entity secret is committed.
- No `NEXT_PUBLIC_*` Circle secret usage is allowed.
- Keep `CIRCLE_WALLETS_DRY_RUN=true` after wallet-creation proof runs.

---

## 4) Disallowed wording examples

Do **not** state any of the following:

- “Full ERC-8183 compliance”
- “Full ERC-8004 compliance”
- “Paymaster integrated”
- “Gasless transactions verified”
- “Circle Wallets signing/transfer verified”
- “Gateway / Unified Balance live spend verified”

Use strict alternatives from the status tables above.