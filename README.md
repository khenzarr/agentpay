# AgentPay for Arc

USDC-native escrow and settlement for autonomous AI agents on **Arc Testnet**.

## Stack

- Next.js 16 (App Router)
- wagmi v3 + viem
- Arc ERC-8183 Agentic Commerce reference contract
- Circle USDC on Arc Testnet

## Setup

```bash
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_DEMO_AGENT_ADDRESS to your agent test wallet
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Connect MetaMask on **Arc Testnet** (5042002). Fund USDC via [faucet.circle.com](https://faucet.circle.com/).

## Contracts (testnet)

| | Address |
|---|---------|
| USDC | `0x3600000000000000000000000000000000000000` |
| ERC-8183 reference | `0x0747EEf0706327138c69792bF28Cd525089e4583` |

## Grant docs

Planning and status: `docs/grant/agentpay/`

## Agent integration

AgentPay helps AI agents and clients coordinate USDC-funded jobs on Arc through escrow, delivery, completion, and settlement.

- Integration guide: `docs/AGENT_INTEGRATION_GUIDE.md`

## Product docs page

- In-app docs route: `/docs`
- Focus: third-party integration patterns for autonomous agents, marketplaces, and external apps (routes, contract/event reads, ArcNS identity, and API/SDK roadmap with claim-safe boundaries)

## Read-only Developer API v0

- AgentPay now exposes a **read-only Developer API v0** for integrators.
- Endpoints are documented on `/docs`.
- Scope is intentionally read-only (metadata, agents, jobs, payments, identity resolution, integration status).
- No server-side signing, no transaction submission, no custody, and no production SLA claim.

Claim-safe status summary:
- **Verified:** Arc Testnet, USDC escrow lifecycle, App Kit Send, Bridge/CCTP, Circle Wallets EOA create/read/sign/send + SCA wallet creation, ArcNS identity display
- **Estimate-verified:** Gateway / Unified Balance
- **Not claimed yet:** Paymaster, Circle Wallets gasless, full ERC-8183, full ERC-8004

## Honesty

Current claim boundary for this repo snapshot:

- Live on Arc Testnet
- Mainnet readiness: NOT_CLAIMED
- ERC-8183 tutorial ABI lifecycle subset
- App Kit Send: CURRENT_VERIFIED
- Bridge / CCTP: CURRENT_VERIFIED
- Gateway / Unified Balance: implemented through supported-chain check, live deposit, confirmed balance, and spend estimate; live spend not executed due to high fee relative to test amount
- Circle Wallets EOA create/read/sign/send and SCA wallet creation: CURRENT_VERIFIED on ARC-TESTNET
- Paymaster is feasible in principle, but remains NOT_CLAIMED until sponsored/gasless transaction proof exists
- Full ERC-8183 and full ERC-8004 compliance are NOT_CLAIMED
