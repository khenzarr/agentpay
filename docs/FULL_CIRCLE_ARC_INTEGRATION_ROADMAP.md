# AgentPay Full Circle + Arc Integration Roadmap

## 1) Product goal

AgentPay’s target is a full Circle + Arc integration dApp for agentic commerce.

This roadmap represents active implementation direction. Product/grant claims remain strictly tied to verified proof.

## 2) Current verified integrations

1. Arc Testnet execution
2. USDC escrow lifecycle
3. Contracts / smart contract interaction
4. ERC-8183 tutorial ABI lifecycle subset
5. Real AgentPay job lifecycle
6. ArcNS optional identity display/resolution support
7. App Kit Send
8. Bridge / CCTP
9. Circle Wallets — Developer-Controlled Wallet creation + metadata read on ARC-TESTNET

## 3) Estimate-verified integrations

10. Gateway / Unified Balance

- supported-chain/balance check succeeded
- live deposit succeeded
- confirmed Unified Balance shown
- spend estimate succeeded
- live spend not executed due to high fee relative to test amount

## 4) Implemented but blocked integrations

11. Circle Wallets transfer estimate path

- implemented path exists
- blocked on official ARC-TESTNET USDC Circle Wallet token ID
- token ID is unresolved in current lookup surface
- signing/send/gasless remains NOT_CLAIMED

## 5) Not-yet-verified integrations

12. Circle Wallets signing/send/gasless
13. Paymaster
14. Full ERC-8183 compliance
15. Full ERC-8004 compliance

## 6) Next technical sprints

1. Circle Wallets token ID resolution
2. Circle Wallets transfer estimate verification
3. Circle Wallets signing proof
4. Circle Wallets send/transfer proof
5. Circle Wallets gasless transaction proof
6. Paymaster / Gas Station proof
7. Gateway live spend decision (execute vs defer with rationale)
8. Full ERC-8183 compatibility expansion
9. ERC-8004 compatibility layer for identity/reputation evolution

## 7) Proof rule

For every integration area:

**Implement → verify → record proof → claim**

No integration should be publicly claimed before runtime proof is captured and documented.

## 8) Claim boundary

- **Grant-safe/current claims:** only currently verified scope plus explicitly estimate-verified scope.
- **Roadmap/completion direction:** full Circle + Arc integration coverage target.

Roadmap targets are implementation goals, not shipped-status statements.

## 9) Risks and blockers

- Official token ID blocker for Circle Wallets ARC-TESTNET USDC transfer estimate path
- Gasless flow may require SCA/ERC-4337-compatible account path
- Circle policy/permissions setup requirements for transaction operations
- Fee economics (e.g., Gateway live spend cost vs test amount)
- Arc mainnet availability timing for production activation

## 10) Demo/grant posture

- Claim only verified pieces in demos and submissions.
- Keep estimate-verified and blocked items explicitly labeled.
- Present this roadmap as active implementation direction, not completed status.
