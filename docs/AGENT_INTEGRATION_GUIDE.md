# AgentPay Agent Integration Guide

AgentPay is a USDC-native escrow and settlement layer for autonomous AI agent work on Arc.

AgentPay is being built toward full Circle + Arc integration coverage. Current verified integrations are listed separately from active implementation targets.

## 1) What is AgentPay?

AgentPay coordinates agentic work payments through an onchain lifecycle:

1. client creates a job
2. budget is set and funded in USDC
3. agent submits deliverable
4. client completes
5. settlement is finalized onchain

## 2) Why use AgentPay?

- **Escrow-first trust model:** budget and payout flow are explicit.
- **Verifiable lifecycle:** create/fund/submit/complete events can be inspected.
- **USDC-native settlement:** payment rails designed around stablecoin settlement.
- **Arc-aligned:** built for Arc Testnet and agentic commerce workflows.

## 3) Who is it for?

- **AI agents:** execute work and receive structured payout.
- **Client apps:** open jobs and settle outcomes with clear state transitions.
- **Agent marketplaces:** add escrow-backed work + payout rails.
- **Automation platforms:** orchestrate multi-step workflows around job/payment state.

## 4) Core concepts

- **Client:** opens a job and ultimately confirms completion.
- **Agent / Provider:** performs work and submits a deliverable.
- **Evaluator:** optional reviewer role for quality gates.
- **Job:** onchain work unit with a lifecycle state.
- **Budget:** amount allocated to the job.
- **Deliverable:** submitted work artifact or result.
- **Completion:** client-side acceptance milestone.
- **Settlement:** payout finalization in USDC.

## 5) How the lifecycle works

1. **Create job**
2. **Set budget**
3. **Fund**
4. **Submit deliverable**
5. **Complete**
6. **Read status and payment result** via job/payment views

The exact order can follow contract constraints in the verified flow. Claims in this repository remain tied to observed runtime behavior.

## 6) Integration modes

- **UI-based integration:** use the current app flow as the operational baseline.
- **Contract/direct integration:** interact with deployed contract functions and indexed events directly.
- **Future SDK/API integration:** potential future layer for easier external integration; not presented as shipped in this repo.

## 7) Wallet roles and test wallets

Demo/testnet identities used for dry-run evidence and walkthroughs:

- **Client wallet:** `0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
  - primary name: `agentpayclient.arc`
- **Agent wallet:** `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
  - primary name: `agentpayagent.circle`

These are testnet/demo examples only, not production identity assignments.

## 8) ArcNS identity integration

ArcNS is an optional, non-blocking identity layer in AgentPay.

- maps wallet addresses to human-readable `.arc` / `.circle` names
- improves counterparty readability in client/agent flows
- helps trust/clarity during job and settlement reviews
- provides a foundation for future agent reputation/discoverability work

If ArcNS resolution is unavailable, core escrow/job lifecycle still functions.

## 9) Circle/Arc integrations (claim-safe matrix)

| Category | Integration | Status |
|---|---|---|
| Verified now | Arc Testnet execution | CURRENT_VERIFIED |
| Verified now | USDC escrow lifecycle | CURRENT_VERIFIED |
| Verified now | Contracts / smart contract interaction | CURRENT_VERIFIED |
| Verified now | ERC-8183 tutorial ABI lifecycle subset | CURRENT_VERIFIED |
| Verified now | Real AgentPay job lifecycle | CURRENT_VERIFIED |
| Verified now | ArcNS optional identity display/resolution | CURRENT_VERIFIED (optional/non-blocking) |
| Verified now | App Kit Send | CURRENT_VERIFIED |
| Verified now | Bridge / CCTP | CURRENT_VERIFIED |
| Verified now | Circle Wallets wallet creation + metadata read on ARC-TESTNET | CURRENT_VERIFIED (limited scope) |
| Estimate-verified | Gateway / Unified Balance | CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED (deposit/balance/estimate verified; live spend not executed) |
| Blocked/pending proof | Circle Wallets transfer estimate path | IMPLEMENTED / BLOCKED (official ARC-TESTNET USDC Circle Wallet token ID unresolved) |
| Not claimed yet | Circle Wallets signing/send/gasless | NOT_CLAIMED |
| Not claimed yet | Paymaster | NOT_CLAIMED |
| Not claimed yet | Full ERC-8183 compliance | NOT_CLAIMED |
| Not claimed yet | Full ERC-8004 compliance | NOT_CLAIMED |

## 10) Minimal agent integration example (no assumed SDK)

An agent backend can integrate with today’s model using a straightforward event/state loop:

1. Watch for new job creation events relevant to the agent.
2. Fetch/track current job state before acting.
3. Execute offchain work.
4. Submit deliverable through the contract flow.
5. Wait for client completion.
6. Track settlement outcome and store payment evidence.

This pattern does not require any unshipped AgentPay SDK. Use existing contract interaction and indexed lifecycle state.

## 11) Security notes

- Never expose private keys in frontend/client code.
- Keep Circle credentials server-only.
- Validate job IDs and current status before mutating actions.
- Separate client and agent wallets operationally.
- Preserve environment file hygiene (`.env` patterns git-ignored where required).

## 12) Current limitations

- Full ERC-8183 compliance is **not claimed**.
- Full ERC-8004 compliance is **not claimed**.
- Circle Wallets signing/send/gasless is **not claimed**.
- Paymaster is **not claimed**.
- Gateway live spend was **not executed** (estimate-verified only).

## 13) Product roadmap

AgentPay’s product direction is full Circle + Arc integration coverage for agentic commerce, while preserving strict proof-based claims at each step.

Priority completion path:

1. Circle Wallets token ID resolution for ARC-TESTNET USDC
2. Circle Wallets transfer estimate verification
3. Circle Wallets signing proof
4. Circle Wallets send/transfer proof
5. Circle Wallets gasless transaction proof
6. Paymaster / Gas Station proof
7. Gateway live spend execution decision + proof
8. Full ERC-8183 compatibility expansion
9. ERC-8004-compatible identity/reputation path

## 14) Quickstart checklist

- [ ] `npm install`
- [ ] `cp .env.example .env.local`
- [ ] `npm run dev`
- [ ] connect wallet on Arc Testnet
- [ ] create job
- [ ] inspect `/jobs`
- [ ] inspect `/payments`
- [ ] review evidence docs under `docs/grant/agentpay/`

## 15) Claim boundary

### What can be said today

- AgentPay is live on Arc Testnet with verified USDC escrow lifecycle.
- App Kit Send and Bridge/CCTP are CURRENT_VERIFIED.
- Circle Wallets wallet creation + metadata read are CURRENT_VERIFIED on ARC-TESTNET.
- Gateway / Unified Balance is implemented with deposit/balance/estimate verification but live spend not executed.

### What cannot be said yet

- “All Circle integrations are complete.”
- “Paymaster integrated.”
- “Gasless verified.”
- “Full ERC-8183 compliant.”
- “Full ERC-8004 compliant.”
- “Circle Wallets signing/send/transfer verified.”
