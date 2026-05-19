# FINAL GRANT READINESS AUDIT â€” AgentPay

**Date:** 2026-05-19  
**Scope:** Final claim/readiness audit before grant demo recording.  
**Policy:** No overclaim; no unverified runtime assertions.

Related public docs:

- `docs/AGENT_INTEGRATION_GUIDE.md`
- `docs/FULL_CIRCLE_ARC_INTEGRATION_ROADMAP.md`

---

## 1) Final integration matrix

| # | Integration | Status | Claim boundary |
|---|---|---|---|
| 1 | Arc Testnet execution | CURRENT_VERIFIED | Claimable |
| 2 | USDC escrow lifecycle | CURRENT_VERIFIED | Claimable |
| 3 | Contracts / smart contract interaction | CURRENT_VERIFIED | Claimable |
| 4 | ERC-8183 lifecycle scope | CURRENT_VERIFIED (tutorial subset) | Full compliance NOT_CLAIMED |
| 5 | Real AgentPay job lifecycle | CURRENT_VERIFIED | Claimable |
| 6 | ArcNS identity display/resolution | CURRENT_VERIFIED (optional) | Optional/non-blocking |
| 7 | App Kit Send | CURRENT_VERIFIED | Claimable with tx proof |
| 8 | Bridge / CCTP | CURRENT_VERIFIED | Claimable with approve/burn/mint proofs |
| 9 | Circle Wallets (Developer-Controlled) | CURRENT_VERIFIED (EOA wallet creation/read + SCA wallet creation + token ID resolution + transfer estimate + message signing + tiny transfer/send) | Gasless remains NOT_CLAIMED |
| 10 | Gateway / Unified Balance | CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED | Below CURRENT_VERIFIED; live spend not executed |
| 11 | Circle Wallets transfer estimate path | CURRENT_CODE_IMPLEMENTED_TRANSFER_ESTIMATE_VERIFIED | Non-mutating transfer estimate verified with resolved ARC-TESTNET USDC token ID |
| 12 | Circle Wallets gasless | NOT_CLAIMED | No gasless runtime proof |
| 13 | Paymaster | NOT_CLAIMED | Feasible in principle only |
| 14 | Full ERC-8183 compliance | NOT_CLAIMED | Tutorial subset only |
| 15 | Full ERC-8004 compliance | NOT_CLAIMED | Not fully implemented/verified |

---

## 2) Allowed claims

- Live on Arc Testnet.
- Mainnet readiness: NOT_CLAIMED.
- ERC-8183 tutorial ABI lifecycle subset implemented and verified.
- App Kit Send CURRENT_VERIFIED (tx proof available).
- Bridge/CCTP CURRENT_VERIFIED (approve/burn/mint proofs available).
- Gateway/Unified Balance verified through supported-chain check, live deposit, confirmed balance, and spend estimate; live spend not executed due high fee.
- Circle Developer-Controlled Wallet live tiny transfer/send verified on ARC-TESTNET.
- Paymaster feasible in principle, not claimed.

---

## 3) Disallowed claims

- â€œFull ERC-8183 compliance.â€
- â€œFull ERC-8004 compliance.â€
- â€œPaymaster integrated.â€
- â€œGasless transactions verified.â€
- â€œCircle Wallets gasless verified.â€
- â€œGateway / Unified Balance live spend verified.â€

---

## 4) Evidence references

### App Kit Send
- Tx: `0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb`
- ArcScan: https://testnet.arcscan.app/tx/0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb

### Bridge / CCTP
- Provider: `CCTPV2BridgingProvider`
- Route: `Ethereum_Sepolia -> Arc_Testnet`
- Approve: `0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd`
- Burn: `0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9`
- Mint: `0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436`

### Gateway / Unified Balance
- Deposit tx: `0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a`
- Explorer: https://sepolia.etherscan.io/tx/0x9538a056ddde900acd019e6ecff651fee43115a3ae08584f2d61180a483afc1a
- Confirmed balance: `0.010000 USDC`
- Spend estimate: gasFee `1.203595 USDC`, forwarder fee `0.203594 USDC`

### Circle Wallets (verified scope)
- walletSetId: `70d4bdf1-74a3-5098-8b37-5c573641e764`
- walletId: `d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- walletAddress: `0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- blockchain: `ARC-TESTNET`, accountType: `EOA`, custodyType: `DEVELOPER`, state: `LIVE`
- SCA creation command: `npm run circle:wallets:create-sca:arc`
- SCA walletId: `494ad75a-4d03-5021-9ddb-0c70cf566954`
- SCA walletAddress: `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
- SCA blockchain/accountType/state: `ARC-TESTNET` / `SCA` / `LIVE`
- SCA creation responseStatus: `success`
- Boundary for SCA creation proof: no sponsored transaction, no Paymaster userOperation, no token transfer, no secrets printed.
- message signing command: `npm run circle:wallets:sign-message`
- message: `AgentPay Circle Wallets signing proof on ARC-TESTNET`
- signature captured (server-only benign message signing), status: `200`
- tiny transfer/send command: `npm run circle:wallets:send-tiny-transfer`
- submitted `transactionId: 373289ce-27f9-55d7-8601-b853f8fd9cc2` with initial state `INITIATED`
- finality check command: `npm run circle:wallets:get-transaction` (non-mutating)
- final state: `COMPLETE`
- tx hash: `0x702c86b15ee071666327004e2ded60eb8ed065b9f153e52ba2bbcd60378e912e`
- `finalityFieldsPresent: true`

---

## 5) Remaining blockers

1. Circle Wallets gasless runtime proof not captured.
2. Paymaster runtime sponsored/gasless proof not captured.
3. Gateway / Unified Balance live spend intentionally not executed (fee too high relative to test amount).

Gasless/paymaster discovery addendum (Master Prompt #19):

- Reference: `docs/grant/agentpay/CIRCLE_WALLETS_GASLESS_PAYMASTER_DISCOVERY.md`
- Classification: `DO_NOT_CLAIM`
- Conservative blockers: existing verified wallet is EOA (`BLOCKED_EXISTING_WALLET_IS_EOA`), SCA path and Gas Station/Console policy setup are still prerequisite gates.

Circle Wallets transfer-estimate proof addendum:

- `npm run circle:wallets:list-balances` returned ARC-TESTNET `USDC` token balance with `tokenId: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`.
- `npm run circle:wallets:token-lookup` returned `candidateCount: 1`, `source: getWalletTokenBalance`, `id: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`.
- `npm run circle:wallets:estimate-transfer` succeeded using `CIRCLE_WALLET_TRANSFER_TOKEN_ID=15dc2b5d-0994-58b0-bf8c-3a0501148ee8` and `CIRCLE_WALLET_TRANSFER_DRY_RUN=true`.
- No live transfer was executed.

---

## 6) Demo recording checklist (final)

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run dev`
- [ ] Check `/jobs`
- [ ] Check `/payments`
- [ ] Show docs/evidence briefly
- [ ] Avoid overclaims
- [ ] Keep recording under 5 minutes (if required)
- [ ] Include codebase walkthrough
- [ ] Show current Circle product usage
- [ ] Show integration demonstration

---

## 7) Grant form claim language recommendations

- Use: **â€œmainnet readiness is NOT_CLAIMED in the current repo proof boundary.â€**
- Use: **â€œnot claimed until runtime proof exists.â€**
- Keep Gateway wording at: **implemented + deposit/balance/estimate verified; live spend not executed**.
- Keep Circle Wallets wording at: **EOA wallet creation/read + SCA wallet creation verified on ARC-TESTNET, plus metadata read, token ID resolution, transfer estimate, message signing, tiny transfer/send verified; gasless NOT_CLAIMED**.
- Keep Paymaster wording at: **feasible in principle, NOT_CLAIMED**.

---

## 8) Final go/no-go status

**GO FOR DEMO RECORDING** after:

1. validation commands pass (`lint`, `typecheck`, `build`), and
2. narrator follows strict claim boundaries above.

---

## Arc Testnet Circle Paymaster Support Boundary (Correction)

- Circle Paymaster official supported chains do not currently include Arc Testnet.
- The Arc Testnet Paymaster path is blocked by unsupported/missing Circle Paymaster deployment, not by AgentPay client-side readiness.
- EntryPoint and bundler readiness on Arc Testnet are verified/readiness-only, but Circle Paymaster/Gasless remains NOT_CLAIMED.
- No claim should state that Circle Paymaster is live or supported on Arc Testnet.

Final status:

- Paymaster: NOT_CLAIMED
- Gasless: NOT_CLAIMED

Classification:

- BLOCKED_CIRCLE_PAYMASTER_ARC_NOT_SUPPORTED
- BLOCKED_PAYMASTER_CONTRACT_NOT_DEPLOYED_ON_ARC_TESTNET
- READINESS_COMPLETE_CLIENT_SIDE
- DO_NOT_CLAIM

## Chain-aware Circle Paymaster / Gasless labeling

- Circle Paymaster / Gasless is chain-aware in AgentPay.
- Available on Circle Paymaster-supported networks.
- Unsupported on Arc Testnet until Circle Paymaster support/deployment is available.
- Client-side readiness is complete, but Arc Testnet live proof remains NOT_CLAIMED.



