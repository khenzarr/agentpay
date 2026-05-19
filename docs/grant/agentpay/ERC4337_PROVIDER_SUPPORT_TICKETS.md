# ERC-4337 Provider Support Tickets — AgentPay (ARC-TESTNET)

## 1. Purpose

This document provides concise, provider-neutral support/outreach ticket drafts to confirm whether ERC-4337 infrastructure providers can support AgentPay on `ARC-TESTNET` (`chainId 5042002`) for bundler + paymaster proof readiness.

Scope boundary:

- docs-only
- no live transactions
- no API calls
- no secrets
- no claim upgrade

---

## 2. Technical context to include in every ticket

Use this context block in each provider message:

- Project: AgentPay
- Network: Arc Testnet
- `chainId`: `5042002`
- RPC: `https://rpc.testnet.arc.network`
- Explorer: `https://testnet.arcscan.app`
- Native gas/payment symbol: `USDC`
- Current status: Paymaster `NOT_CLAIMED`, Gasless `NOT_CLAIMED`
- Verified smart account context:
  - Circle Wallets SCA wallet creation verified on `ARC-TESTNET`
  - SCA wallet address: `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- Known Circle Paymaster addresses on Arc Testnet:
  - EntryPoint v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
  - EntryPoint v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`
- Deterministic proof artifacts needed:
  - `userOpHash`
  - `txHash`
  - `receipt/finality`
  - EntryPoint version/address used
  - paymaster field/address/log evidence
  - sponsored fee evidence

---

## 3. Pimlico support ticket draft

Subject: Arc Testnet (`chainId 5042002`) ERC-4337 Bundler/Paymaster Support Check

Hello Pimlico team,

We are evaluating ERC-4337 infrastructure for AgentPay on Arc Testnet (`chainId 5042002`) and would like to confirm supportability before any implementation claims.

Technical context:
- Arc RPC: `https://rpc.testnet.arc.network`
- Explorer: `https://testnet.arcscan.app`
- Circle SCA wallet (verified): `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- Circle paymaster addresses:
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`

Could you please confirm the questions listed below (Arc support, bundler endpoint availability, EntryPoint version support, Circle paymaster interoperability, required account/API setup, and minimal config example)?

Thank you.

---

## 4. Stackup support ticket draft

Subject: Arc Testnet (`chainId 5042002`) ERC-4337 Bundler/Paymaster Support Check

Hello Stackup team,

We are assessing ERC-4337 support for AgentPay on Arc Testnet (`chainId 5042002`) and need explicit confirmation for infra readiness.

Technical context:
- Arc RPC: `https://rpc.testnet.arc.network`
- Explorer: `https://testnet.arcscan.app`
- Circle SCA wallet (verified): `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- Circle paymaster addresses:
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`

Could you please confirm the questions listed below (network support, bundler RPC availability, EntryPoint compatibility, Circle paymaster compatibility, account/API requirements, and minimal configuration)?

Thank you.

---

## 5. Alchemy support ticket draft

Subject: Arc Testnet (`chainId 5042002`) ERC-4337 Infra Availability Inquiry

Hello Alchemy team,

We are validating whether AgentPay can use ERC-4337 infra on Arc Testnet (`chainId 5042002`) and would appreciate explicit confirmation on support boundaries.

Technical context:
- Arc RPC: `https://rpc.testnet.arc.network`
- Explorer: `https://testnet.arcscan.app`
- Circle SCA wallet (verified): `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- Circle paymaster addresses:
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`

Could you please respond to the exact questions below, including whether custom chain onboarding is available and what account/project setup is required?

Thank you.

---

## 6. Biconomy support ticket draft

Subject: Arc Testnet (`chainId 5042002`) ERC-4337 Bundler/Paymaster Support Inquiry

Hello Biconomy team,

We are performing a conservative readiness check for AgentPay ERC-4337 support on Arc Testnet (`chainId 5042002`).

Technical context:
- Arc RPC: `https://rpc.testnet.arc.network`
- Explorer: `https://testnet.arcscan.app`
- Circle SCA wallet (verified): `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- Circle paymaster addresses:
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`

Please confirm the exact support details requested below (Arc support, bundler endpoint, EntryPoint versions, paymaster interoperability, onboarding requirements, and sample configuration).

Thank you.

---

## 7. Optional Gelato / ZeroDev short inquiry

Subject: Arc Testnet (`chainId 5042002`) ERC-4337 Support Availability

Hello team,

Quick check: does your ERC-4337 stack currently support Arc Testnet (`chainId 5042002`) for bundler and paymaster-compatible flows? If yes, could you share required onboarding steps and a minimal config example?

Context:
- Arc RPC: `https://rpc.testnet.arc.network`
- Circle SCA wallet (verified): `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- Circle paymaster addresses (Arc):
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`

Thank you.

---

## 8. Exact questions to ask

Ask these questions exactly (or as close as possible):

1. Do you support Arc Testnet / `chainId 5042002`?
2. Can you provide a bundler RPC for Arc Testnet?
3. Do you support EntryPoint `v0.8`? If not, `v0.7`?
4. Can your bundler work with Circle Paymaster on Arc Testnet?
5. Do you support custom chain configuration?
6. Do we need an API key/project/account?
7. Can we capture `userOpHash`, `txHash`, `UserOperationReceipt`, and finality?
8. Can we verify paymaster field/address/event logs?
9. Are there special requirements for Circle-created SCA/smart accounts?
10. Can you provide a minimal config example?

---

## 9. Required confirmation checklist

Mark provider as actionable only if all relevant items are confirmed in writing:

- [ ] Arc Testnet (`chainId 5042002`) support confirmed
- [ ] Bundler RPC endpoint format provided
- [ ] EntryPoint support confirmed (`v0.8` preferred, `v0.7` fallback)
- [ ] Circle paymaster interoperability confirmed (or clearly bounded)
- [ ] Custom chain onboarding path confirmed (if not already listed)
- [ ] API key / project / account prerequisites confirmed
- [ ] Proof artifact capture support confirmed (`userOpHash`, `txHash`, receipt/finality)
- [ ] Paymaster field/address/log verification path confirmed
- [ ] Circle SCA special requirements documented (or “none” explicitly stated)
- [ ] Minimal configuration example provided

---

## 10. How to evaluate provider replies

Use conservative classification:

- **Confirmed**: explicit written “yes” for Arc support + endpoint/onboarding details + artifact capture clarity.
- **Partially confirmed**: some support claims but missing endpoint details, missing EntryPoint clarity, or unclear Circle paymaster/SCA compatibility.
- **Not confirmed / blocked**: no explicit Arc support, no bundler path, or no clear integration prerequisites.

Only treat raw ERC-4337 proof path as unblocked after all mandatory checklist items are explicitly answered.

---

## 11. Claim boundary

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
- Raw ERC-4337 status: blocked pending provider/infra confirmations
- Claim stance: `DO_NOT_CLAIM`

No claim upgrade is justified from outreach/ticket drafting alone.