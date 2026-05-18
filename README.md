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

## Honesty

Designed to evolve toward ERC-8004 / ERC-8183 compatible workflows. App Kit, CCTP, Gateway, and Circle Wallets are **not** integrated in this MVP scaffold.
