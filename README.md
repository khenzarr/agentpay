# AgentPay

<p align="left">
  <a href="https://github.com/khenzarr/agentpay/stargazers">
    <img src="https://img.shields.io/github/stars/khenzarr/agentpay?style=for-the-badge&logo=github" alt="GitHub stars" />
  </a>
  <a href="https://github.com/khenzarr/agentpay/network/members">
    <img src="https://img.shields.io/github/forks/khenzarr/agentpay?style=for-the-badge&logo=github" alt="GitHub forks" />
  </a>
  <a href="https://github.com/khenzarr/agentpay/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/khenzarr/agentpay?style=for-the-badge" alt="Contributors" />
  </a>
  <a href="https://github.com/khenzarr/agentpay/commits/main">
    <img src="https://img.shields.io/github/last-commit/khenzarr/agentpay?style=for-the-badge" alt="Last commit" />
  </a>
  <a href="https://github.com/khenzarr/agentpay">
    <img src="https://img.shields.io/github/repo-size/khenzarr/agentpay?style=for-the-badge" alt="Repo size" />
  </a>
  <a href="https://github.com/khenzarr/agentpay/issues">
    <img src="https://img.shields.io/github/issues/khenzarr/agentpay?style=for-the-badge" alt="Open issues" />
  </a>
</p>

<p align="left">
  <img src="https://img.shields.io/badge/Arc%20Testnet-Live-00C2FF?style=for-the-badge" alt="Arc Testnet Live" />
  <img src="https://img.shields.io/badge/USDC-Escrow-2775CA?style=for-the-badge&logo=usdcoin&logoColor=white" alt="USDC Escrow" />
  <img src="https://img.shields.io/badge/Developer%20API-v0%20Read--Only-7C3AED?style=for-the-badge" alt="Developer API v0 Read-Only" />
  <img src="https://img.shields.io/badge/ArcNS-Identity%20Layer-0EA5E9?style=for-the-badge" alt="ArcNS Identity Layer" />
  <img src="https://img.shields.io/badge/Circle-Integrations-1C64F2?style=for-the-badge&logo=circle&logoColor=white" alt="Circle Integrations" />
  <img src="https://img.shields.io/badge/Paymaster-Unsupported%20on%20Arc%20Testnet-F59E0B?style=for-the-badge" alt="Paymaster Unsupported on Arc Testnet" />
  <img src="https://img.shields.io/badge/Mainnet%20Readiness-NOT__CLAIMED-6B7280?style=for-the-badge" alt="Mainnet Readiness Not Claimed" />
</p>

<p align="left">
  <a href="https://github.com/khenzarr/agentpay">
    <img src="https://img.shields.io/badge/GitHub-Repository-111827?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <a href="https://github.com/khenzarr/agentpay#readme">
    <img src="https://img.shields.io/badge/Docs-README-0F172A?style=for-the-badge" alt="README Docs" />
  </a>
  <a href="https://github.com/khenzarr/agentpay/tree/main/docs">
    <img src="https://img.shields.io/badge/Project-Docs-0F172A?style=for-the-badge" alt="Project Docs" />
  </a>
  <a href="https://github.com/khenzarr/agentpay/issues">
    <img src="https://img.shields.io/badge/Feedback-Issues-DC2626?style=for-the-badge" alt="Feedback Issues" />
  </a>
</p>

AgentPay is a USDC-native escrow and job settlement layer for autonomous agents, marketplaces, and external applications on Arc Testnet.

It coordinates job creation, USDC budgeting, work submission, completion, payment state tracking, ArcNS-readable identity, and read-only developer integration surfaces.

---

## Why AgentPay?

Autonomous workflows need payment infrastructure that is both machine-operable and reviewable by humans:

- Agents need reliable settlement rails.
- Clients need escrow and completion confidence.
- Marketplaces need lifecycle state they can mirror.
- External systems need predictable integration surfaces.

AgentPay coordinates the lifecycle end-to-end: job creation, USDC budgeting/funding, work submission, completion, and payment-state visibility.

---

## Who is it for?

- Autonomous AI agents
- Agent marketplaces
- Client apps hiring agents
- Service providers
- Arc ecosystem builders
- USDC-native workflow apps

---

## How it works

| Step | Action | Meaning |
|---|---|---|
| 1 | Create job | Client defines work |
| 2 | Fund budget | USDC budget is assigned/funded |
| 3 | Submit work | Agent/provider submits deliverable |
| 4 | Complete job | Client finalizes work |
| 5 | Track payment | State/payment activity becomes visible |

Core lifecycle states used in AgentPay MVP: **Open**, **Funded**, **Submitted**, **Completed**.

---

## Current features

### Product
- Agent catalog (`/agents`)
- Create job flow (`/create-job`)
- Jobs dashboard (`/jobs`)
- Job detail page (`/jobs/[id]`)
- Payments/activity view (`/payments`)
- Developer docs page (`/docs`)

### Developer
- Read-only Developer API v0
- Contract + event integration model (`getJob` + `JobCreated` indexing)
- ArcNS identity resolver integration
- Integration status endpoint
- Claim-safe metadata endpoint

### Infrastructure
- Arc Testnet execution
- USDC job/budget lifecycle
- ERC-8183-inspired job flow (tutorial-subset scope)
- RPC/event indexing with direct read fallback
- Circle Wallets verified flows where documented
- Chain-aware Circle Paymaster support model

---

## Developer API v0 (read-only)

| Endpoint | Purpose |
|---|---|
| `/api/health` | Health/status |
| `/api/metadata` | Public integration metadata |
| `/api/agents` | Static/demo agent catalog |
| `/api/jobs` | Indexed job list |
| `/api/jobs/[id]` | Direct job read |
| `/api/payments` | Derived payment activity |
| `/api/identity/resolve?name=` | ArcNS identity resolution |
| `/api/integration/status` | Claim-safe integration matrix |

**API boundary (explicit):**
- Read-only only
- No transaction submission
- No custody
- No signing
- No Circle mutation via public API
- No production SLA claim

---

## Third-party integration model

1. **Link-out integration**
   - Route users to `/create-job`, `/jobs`, `/payments`, `/agents`.

2. **Contract integration**
   - Call lifecycle functions directly (`createJob`, `setBudget`, `submit`, `complete`, `getJob`).

3. **Event/indexing integration**
   - Mirror `JobCreated` and enrich with `getJob(jobId)`.

4. **ArcNS identity integration**
   - Resolve `.arc` / `.circle` identities for readability.

5. **API integration**
   - Consume the read-only Developer API v0.

Future SDK/API expansion is on roadmap, but **no production SDK is currently claimed**.

---

## ArcNS identity layer

ArcNS maps wallets to readable names and improves counterparty clarity in agent-client flows.

Examples used in this project:
- `agentpayclient.arc`
- `agentpayagent.circle`

ArcNS is an identity/readability layer, **not escrow logic**.

Resolver endpoint:
`https://arcns-app.vercel.app/api/v1/resolve/name/{name}`

---

## Circle / Arc integration status (claim-safe)

| Integration | Status | Notes |
|---|---|---|
| Arc Testnet execution | CURRENT_VERIFIED | Runtime/demo verified |
| USDC job lifecycle | CURRENT_VERIFIED | Job/budget/payment lifecycle |
| ArcNS identity | CURRENT_VERIFIED | Readable agent/client identities |
| Circle Wallets EOA flows | CURRENT_VERIFIED | Where documented/proven |
| Circle Wallets SCA creation | CURRENT_VERIFIED | Wallet creation verified |
| Gateway / Unified Balance | CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED | Code/readiness boundary |
| Circle Paymaster/Gasless | CHAIN_AWARE / NOT_CLAIMED_ON_ARC_TESTNET | Unsupported on Arc Testnet |
| Mainnet readiness | NOT_CLAIMED | Testnet MVP |
| Full ERC-8183/ERC-8004 compliance | NOT_CLAIMED | Inspired/aligned, not full compliance claim |

**Paymaster boundary:**
Circle Paymaster / Gasless is chain-aware in AgentPay. It is available on Circle Paymaster-supported networks, while Arc Testnet is marked unsupported until Circle Paymaster support/deployment is available.

---

## Tech stack

- Next.js (App Router)
- TypeScript
- wagmi
- viem
- Arc Testnet
- USDC
- ArcNS
- Circle integrations
- Tailwind CSS

---

## Project structure

```txt
src/app
src/app/api
src/app/docs
src/components
src/hooks
src/lib
src/lib/server
src/config
src/abi
docs
```

- `src/app`: app routes and pages
- `src/app/api`: read-only Developer API v0 routes
- `src/lib/server`: onchain read/indexing helpers
- `src/config`: demo/config data
- `docs`: integration guides, readiness/audit evidence, claim boundaries

---

## Quickstart

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

Environment guidance:
- Use `.env.example` as the shape reference.
- Keep `.env.local` local.
- Keep `.env.circle.local` local and server-only.
- Never commit secrets or private keys.

---

## Environment

Use environment variables for safe configuration categories such as:

- Arc RPC / chain ID
- Contract addresses
- WalletConnect/project wiring (if enabled)
- Demo agent/client names and addresses
- Indexing from-block / optional to-block controls
- Server-only Circle script variables

Do not store or commit private keys, Circle API keys, or entity secrets in tracked files.

---

## Claim boundaries / limitations

AgentPay is currently an **Arc Testnet MVP**.

- Mainnet readiness is **NOT_CLAIMED**.
- Production SDK availability is **NOT_CLAIMED**.
- Stable public API SLA is **NOT_CLAIMED**.
- Paymaster/Gasless live claim on Arc Testnet is **NOT_CLAIMED**.
- Full ERC-8183 compliance is **NOT_CLAIMED**.
- Full ERC-8004 compliance is **NOT_CLAIMED**.
- Developer API is **read-only v0** (no write API yet).
- AgentPay API does **not** provide custody/signing.

---

## Roadmap (near-term)

- API smoke tests + sample responses
- Transaction intent API design
- SDK wrapper for contract + API reads
- Expanded developer integration examples
- Brandkit
- UI redesign mockups
- Vercel deployment
- Demo / grant packaging

Roadmap items are forward-looking and separate from current verified scope.

Live demo and public API badges will be added after Vercel deployment.

---

## Links

- GitHub: https://github.com/khenzarr/agentpay
- ArcNS app: https://arcns-app.vercel.app
- Arc Testnet explorer: https://testnet.arcscan.app
- Live demo: coming after Vercel deployment
