
## Paymaster official docs discovery update (Master Prompt #22)

- Official Circle Paymaster docs reviewed:
  - `https://developers.circle.com/paymaster`
  - `https://developers.circle.com/paymaster/pay-gas-fees-usdc`
  - `https://developers.circle.com/paymaster/addresses-and-events`
- Arc Testnet paymaster contract addresses (doc-level):
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- Architecture finding: Circle Paymaster is an ERC-4337 smart-account/userOp flow and is distinct from Wallets Gas Station product surface.
- Claim boundary unchanged:
  - Paymaster: `NOT_CLAIMED`
  - Gasless: `NOT_CLAIMED`

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
9. Circle Wallets — Developer-Controlled EOA wallet creation/read + SCA wallet creation (ARC-TESTNET) + metadata read + ARC-TESTNET USDC token ID resolution + transfer estimate + message signing + live tiny transfer/send proof

SCA wallet creation proof update:

- Command: `npm run circle:wallets:create-sca:arc`
- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: 494ad75a-4d03-5021-9ddb-0c70cf566954`
- `walletAddress: 0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- `blockchain: ARC-TESTNET`
- `accountType: SCA`
- `state: LIVE`
- `responseStatus: success`
- Allowed claim: Circle Developer-Controlled SCA wallet creation verified on ARC-TESTNET.
- Boundary: no sponsored transaction executed, no Paymaster userOperation executed, no token transfer executed in this SCA creation step.

## 3) Estimate-verified integrations

10. Gateway / Unified Balance

- supported-chain/balance check succeeded
- live deposit succeeded
- confirmed Unified Balance shown
- spend estimate succeeded
- live spend not executed due to high fee relative to test amount

## 4) Estimate-verified integrations (additional)

11. Circle Wallets transfer estimate path

- implemented path exists
- ARC-TESTNET USDC token ID resolved from wallet balance discovery
- transfer estimate verified in non-mutating mode
- token-id resolution discovery document added: `docs/grant/agentpay/CIRCLE_WALLETS_TOKEN_ID_RESOLUTION.md`
- current classification: `CURRENT_CODE_IMPLEMENTED_TRANSFER_ESTIMATE_VERIFIED`
- non-mutating balance helper added: `npm run circle:wallets:list-balances`
- gasless remains NOT_CLAIMED (send/transfer now CURRENT_VERIFIED for tiny ARC-TESTNET proof transfer)

## 5) Not-yet-verified integrations

12. Circle Wallets gasless
13. Paymaster
14. Full ERC-8183 compliance
15. Full ERC-8004 compliance

## 6) Next technical sprints

1. Circle Wallets gasless transaction proof
2. Paymaster / Gas Station proof
3. Gateway live spend decision (execute vs defer with rationale)
4. Full ERC-8183 compatibility expansion
5. ERC-8004 compatibility layer for identity/reputation evolution

## 7) Proof rule

For every integration area:

**Implement → verify → record proof → claim**

No integration should be publicly claimed before runtime proof is captured and documented.

## 8) Claim boundary

- **Grant-safe/current claims:** only currently verified scope plus explicitly estimate-verified scope.
- **Roadmap/completion direction:** full Circle + Arc integration coverage target.

Roadmap targets are implementation goals, not shipped-status statements.

## 9) Risks and blockers

- Gasless flow may require SCA/ERC-4337-compatible account path
- Circle policy/permissions setup requirements for transaction operations
- Fee economics (e.g., Gateway live spend cost vs test amount)
- Arc mainnet availability timing for production activation

Gas Station / Paymaster readiness observation update (testnet mode, founder-observed):

- `Default Arc Testnet Policy` is visible in Circle Console
- policy status is `Active`
- policy network is `Arc Testnet`
- policy daily spend limit is `50 USDC-TESTNET`
- `Sponsored Transactions` UI is present
- settled sponsored tx count currently `0`

This reduces Console-visibility uncertainty, but does **not** change claim status:

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

Remaining blockers to verification:

- EOA vs SCA requirement for sponsored flow remains unresolved
- policy/config identifier requirement in SDK transaction params remains unresolved
- exact SDK/API method + parameterization for sponsored transfer still needs runtime proof
- no real sponsored transaction proof artifact captured yet

## 10) Demo/grant posture

- Claim only verified pieces in demos and submissions.
- Keep estimate-verified and blocked items explicitly labeled.
- Present this roadmap as active implementation direction, not completed status.

Gasless/paymaster setup/readiness checklist:

- `docs/grant/agentpay/GAS_STATION_PAYMASTER_SETUP_CHECKLIST.md`

SCA paymaster proof planning doc (Master Prompt #23):

- `docs/grant/agentpay/SCA_PAYMASTER_PROOF_PATH_PLAN.md`

Optional non-mutating readiness utility:

- `npm run circle:sca-paymaster:readiness`

Claim boundary remains unchanged:

- Gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`
