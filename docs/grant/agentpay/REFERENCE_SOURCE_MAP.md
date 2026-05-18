# Reference Source Map

**Purpose:** Trace every external reference used in AgentPay grant planning.  
**Rule:** Do not cite APIs, addresses, or SDK methods unless listed here or verified in the local workspace.

---

## Local workspace sources

| Source | Path / URL | Used for |
|--------|------------|----------|
| AgentPay workspace | `c:\Users\mertb\Desktop\NODE\agentpay` | Confirmed empty; greenfield scope |
| ArcNS (local) | `c:\Users\mertb\Desktop\NODE\ArcNameServices\arcns` | USDC address, deployments, resolver API, grant patterns, hardhat network |
| FlowPay (local) | `c:\Users\mertb\Desktop\NODE\flowpay\flowpay` | wagmi config, chains.ts, ArcNS resolver client, stack choices |
| ArcNS GitHub (reference) | https://github.com/khenzarr/arcns | Listed in prompt; **not cloned at default path** — local ArcNameServices copy used instead |
| FlowPay GitHub (reference) | https://github.com/khenzarr/flowpay | Listed in prompt; local nested `flowpay/flowpay` used |

---

## Circle Grant

| URL | Status | Used for |
|-----|--------|----------|
| https://www.circle.com/grant | **Accessible** (fetched 2026-05-17) | Grant themes: Arc alignment, USDC, agentic activity, traction, milestone funding, co-marketing |

**Themes extracted:** Arc-centric value flow, Circle products as building blocks, shipping teams, demo traction, ecosystem impact (USDC utility on Arc).

---

## Arc core documentation

| URL | Status | Used for |
|-----|--------|----------|
| https://docs.arc.io | **Accessible** (index via llms.txt referenced in pages) | Documentation hub |
| https://docs.arc.io/llms.txt | **Referenced** in docs pages | Full doc discovery — **not fully fetched** in this pass |
| https://docs.arc.io/arc/references/connect-to-arc | **Accessible** | Chain ID 5042002, RPC, explorer, faucet, USDC as gas token |
| https://docs.arc.io/arc/tutorials/deploy-on-arc | **Not individually fetched** | Deployment workflow — revisit before implementation |
| https://docs.arc.io/arc/tutorials/deploy-contracts | **Not individually fetched** | Contract deploy steps — revisit before implementation |
| https://docs.arc.io/arc/tutorials/interact-with-contracts | **Not individually fetched** | Interaction patterns — revisit before implementation |
| https://docs.arc.io/arc/tutorials/monitor-contract-events | **Not individually fetched** | Event indexing — revisit for dashboard |

---

## Arc agentic economy (critical)

| URL | Status | Used for |
|-----|--------|----------|
| https://docs.arc.io/arc/tutorials/register-your-first-ai-agent | **Accessible** (fetched) | ERC-8004 testnet contract addresses; Circle Developer Controlled Wallets flow; **roadmap** only for MVP |
| https://docs.arc.io/arc/tutorials/create-your-first-erc-8183-job | **Accessible** (fetched) | ERC-8183 reference address `0x0747EEf0706327138c69792bF28Cd525089e4583`; USDC `0x3600…0000`; job states Open/Funded/Submitted/Completed; `createJob`, `setBudget`, `approve`, `fund`, `submit`, `complete` |

**ERC-8004 testnet addresses (from Arc docs — verify on explorer before grant claims):**

| Contract | Address |
|----------|---------|
| IdentityRegistry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| ReputationRegistry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| ValidationRegistry | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` |

---

## Arc tools & infrastructure

| URL | Status | Used for |
|-----|--------|----------|
| https://docs.arc.io/arc/tools/account-abstraction | **Not fetched** | Paymaster/AA roadmap |
| https://docs.arc.io/arc/tools/compliance-vendors | **Not fetched** | Future compliance narrative |
| https://docs.arc.io/arc/tools/data-indexers | **Not fetched** | Subgraph/indexer choice |
| https://docs.arc.io/arc/tools/node-providers | **Not fetched** | RPC provider selection |
| https://docs.arc.io/arc/tools/oracles | **Not fetched** | Not MVP |

---

## Arc payments

| URL | Status | Used for |
|-----|--------|----------|
| https://docs.arc.io/build/payments | **Accessible** | USDC P2P on Arc, sub-second finality, App Kit send/bridge pointers |

---

## Arc App Kit (roadmap only — not implemented in AgentPay)

| URL | Status | Used for |
|-----|--------|----------|
| https://docs.arc.io/app-kit | **Not individually fetched** | Roadmap |
| https://docs.arc.io/app-kit/tutorials/installation | **Not fetched** | Planned integration |
| https://docs.arc.io/app-kit/references/supported-blockchains | **Not fetched** | Chain support check |
| https://docs.arc.io/app-kit/tutorials/adapter-setups | **Not fetched** | wagmi adapter setup |
| https://docs.arc.io/app-kit/references/sdk-reference | **Not fetched** | API surface |
| https://docs.arc.io/app-kit/send | **Not fetched** | Send USDC roadmap |
| https://docs.arc.io/app-kit/quickstarts/send-tokens-same-chain | **Not fetched** | Quickstart |
| https://docs.arc.io/app-kit/bridge | **Not fetched** | CCTP/bridge roadmap |
| https://docs.arc.io/app-kit/quickstarts/bridge-tokens-across-blockchains | **Not fetched** | Cross-chain funding |
| https://docs.arc.io/app-kit/concepts/bridge-fees | **Not fetched** | Fee UX |
| https://docs.arc.io/app-kit/tutorials/bridge/collect-bridge-fee | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/bridge/estimate-costs | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/bridge/use-forwarding-service | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/bridge/configure-transfer-speed | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/bridge/specify-recipient-address | **Not fetched** | — |
| https://docs.arc.io/app-kit/references/bridge-error-recovery | **Not fetched** | — |
| https://docs.arc.io/app-kit/swap | **Not fetched** | Swap roadmap |
| https://docs.arc.io/app-kit/quickstarts/swap-tokens-same-chain | **Not fetched** | — |
| https://docs.arc.io/app-kit/concepts/swap-fees | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/swap/estimate-swap-rate | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/swap/set-slippage-tolerance-or-stop-limit | **Not fetched** | — |
| https://docs.arc.io/app-kit/unified-balance | **Not fetched** | Gateway-style UX roadmap |
| https://docs.arc.io/app-kit/quickstarts/unified-balance-deposit-and-spend | **Not fetched** | — |
| https://docs.arc.io/app-kit/quickstarts/unified-balance-delegate-deposit-and-spend | **Not fetched** | — |
| https://docs.arc.io/app-kit/concepts/unified-balance-fees | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/unified-balance/check-unified-balance | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/unified-balance/select-source-blockchains | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/unified-balance/estimate-spend-fees | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/unified-balance/collect-custom-spend-fees | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/unified-balance/manage-delegates | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/unified-balance/use-forwarding-service | **Not fetched** | — |
| https://docs.arc.io/app-kit/tutorials/unified-balance/remove-funds-trustlessly | **Not fetched** | — |
| https://docs.arc.io/app-kit/quickstarts/swap-tokens-crosschain | **Not fetched** | — |

**Note:** FlowPay locally depends on `@circle-fin/app-kit` but does not demonstrate Send/Bridge in UI — treat App Kit docs as **implementation-phase** references.

---

## Optional infrastructure

| URL | Status | Used for |
|-----|--------|----------|
| https://arc-node.thecanteenapp.com/?utm_source=luma | **Not fetched** | Optional node reference — **UNVERIFIED** |

---

## Third-party services referenced locally (ArcNS / FlowPay)

| Service | URL | Used for |
|---------|-----|----------|
| ArcNS production API | https://arcns-app.vercel.app/api/v1 | Name → address resolution (FlowPay `arcnsResolver.ts`) |
| Arc Testnet explorer | https://testnet.arcscan.app | Tx links |
| Circle faucet | https://faucet.circle.com | Testnet USDC |
| The Graph Studio | https://api.studio.thegraph.com/... | ArcNS subgraph only |

---

## Revisit before implementation

| Priority | Source | Reason |
|----------|--------|--------|
| P0 | ERC-8183 tutorial + contract ABI on ArcScan | Exact function signatures, events, edge cases |
| P0 | Arc contract addresses page (if distinct from tutorials) | USDC decimals, official token interface |
| P1 | deploy-on-arc, deploy-contracts, interact-with-contracts | Hardhat/foundry deploy pipeline |
| P1 | monitor-contract-events | Dashboard indexing |
| P2 | App Kit installation + send quickstart | Phase 2 funding UX |
| P2 | account-abstraction / paymaster | Gas sponsorship roadmap |
| P3 | All bridge/swap/unified-balance URLs | Post-MVP cross-chain |

---

## Inaccessible or not used

| Source | Note |
|--------|------|
| GitHub arcns at `NODE\arcns` | Not present; substituted local path |
| `arc-node.thecanteenapp.com` | Not fetched |
| Most App Kit subpages | Listed for roadmap only; content not verified in this phase |
