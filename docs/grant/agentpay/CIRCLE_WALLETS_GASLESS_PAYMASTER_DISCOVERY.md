# Circle Wallets Gasless + Paymaster Discovery — AgentPay (ARC-TESTNET)

## 1) Product/feature evaluated

- Circle Wallets Gas Station / gasless sponsorship path.
- Paymaster-style sponsored transaction feasibility for Circle Wallets on ARC-TESTNET.
- Discovery-only scope (no live sponsored transaction execution in this sprint).

## 2) Official docs/API reviewed

- Circle Wallets Gas Station quickstart (official):
  - https://developers.circle.com/wallets/gas-station/send-a-gasless-transaction
- Circle Wallets supported blockchains (official):
  - https://developers.circle.com/wallets/supported-blockchains
- Arc account abstraction docs (official):
  - https://docs.arc.io/arc/tools/account-abstraction
- Installed official SDK types/source:
  - `node_modules/@circle-fin/developer-controlled-wallets/dist/types/clients/developer-controlled-wallets.d.ts`
  - `node_modules/@circle-fin/developer-controlled-wallets/dist/types/clients/core.d.ts`

## 3) Existing EOA wallet compatibility

Existing verified wallet:

- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `walletAddress: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- `accountType: EOA`
- `custodyType: DEVELOPER`
- `state: LIVE`

Finding:

- Existing wallet is **EOA** and is already verified for metadata read, message signing, estimate transfer, and tiny live transfer/send.
- This does **not** constitute gasless/paymaster proof.

## 4) SCA/ERC-4337 requirement analysis

Conservative finding:

- Circle gasless/paymaster flow should be treated as **SCA/ERC-4337 path dependent**.
- Installed SDK surface includes explicit EOA vs SCA account model and SCA-specific constraints/errors (e.g. SCA fee-level requirements, SCA support checks, SCA policy eligibility message).

Classification:

- `BLOCKED_EXISTING_WALLET_IS_EOA`
- `FEASIBLE_BUT_NEEDS_SCA_WALLET`

## 5) Circle Gas Station policy/config requirement

Conservative finding:

- Gas Station/paymaster eligibility appears policy/config dependent.
- Installed SDK error surface includes policy-eligibility language for SCA account creation.
- No in-repo runtime proof currently demonstrates active Gas Station sponsorship policy usage.
- Founder observed Circle Console policy visibility in testnet mode:
  - `Default Arc Testnet Policy`
  - network `Arc Testnet`
  - status `Active`
  - daily spend limit `50 USDC-TESTNET`
  - `Sponsored Transactions` UI present
  - settled sponsored tx count currently `0`

Classification:

- `FEASIBLE_BUT_NEEDS_GAS_STATION_POLICY`
- `FEASIBLE_BUT_NEEDS_CONSOLE_SETUP`

## 6) Paymaster / sponsorship requirement

Finding:

- Paymaster sponsorship is separate from base wallet signing/send capability.
- Current verified Circle Wallets scope does not include any sponsored transaction proof.

Claim boundary:

- Paymaster remains `NOT_CLAIMED`.

## 7) ARC-TESTNET support finding

Finding:

- Circle Wallets support for `ARC-TESTNET` is already documented/verified for non-gasless flows in this repo.
- For gasless/paymaster specifically, support should remain conservatively framed as feasible but unverified in this repo until sponsored transaction proof exists.

Classification:

- `FEASIBLE_BUT_NEEDS_ARC_TESTNET_SUPPORT_CONFIRMATION` (for gasless/paymaster runtime path proof)

## 8) Required credentials/env vars

Required server-only baseline:

- `CIRCLE_API_KEY`
- `CIRCLE_ENTITY_SECRET`
- `CIRCLE_ENTITY_PUBLIC_KEY`
- `CIRCLE_ENTITY_SECRET_CIPHER_TEXT`
- `CIRCLE_WALLET_SET_ID`
- `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`

Likely additional placeholders for future gasless/paymaster verification (not used in this sprint):

- `CIRCLE_GAS_STATION_POLICY_ID`
- `CIRCLE_PAYMASTER_POLICY_ID`
- `CIRCLE_GASLESS_DRY_RUN=true`
- `CIRCLE_GASLESS_TEST_AMOUNT=0.001`

No secrets should be printed or committed.

## 9) Minimal verification path

1. Confirm official gasless/paymaster prerequisites in Circle Console/docs.
2. Provision/verify policy eligibility for sponsorship path.
3. Use **SCA** wallet path on ARC-TESTNET (do not rely on existing EOA wallet for sponsorship claim).
4. Ensure wallet has required transferable asset balance.
5. Run non-mutating preflight checks first (wallet/account type/config readiness).
6. Execute one tiny sponsored transaction only in a later approved sprint.
7. Capture finality + sponsorship evidence and only then upgrade claim status.

## 10) What can be implemented now

- Discovery documentation and conservative classification updates.
- Non-mutating readiness checks that report wallet account type and config placeholders.
- Keep all gasless/paymaster runtime claims unverified until real sponsored proof exists.

## 11) What is blocked

- Existing verified wallet is `EOA`, not SCA.
- Console policy visibility is observed, but API/runtime policy introspection is not yet implemented in this repo.
- No verified Gas Station/Paymaster sponsorship runtime proof in this repo.
- No real sponsored transaction proof artifact captured.
- Policy/config identifier requirement in sponsored tx parameters remains unresolved from current SDK type-only inspection.
- Installed SDK type surface does not provide a simple standalone “gasless verified” shortcut; policy + account mode + runtime proof are still required.

## 12) Claim recommendation

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`
- Overall discovery recommendation: `DO_NOT_CLAIM`

Supporting feasibility tags:

- `BLOCKED_EXISTING_WALLET_IS_EOA`
- `FEASIBLE_BUT_NEEDS_SCA_WALLET`
- `FEASIBLE_BUT_NEEDS_GAS_STATION_POLICY`
- `FEASIBLE_BUT_NEEDS_CONSOLE_SETUP`
- `FEASIBLE_BUT_NEEDS_ARC_TESTNET_SUPPORT_CONFIRMATION`

## 14) Official Circle Paymaster docs deep-dive update (Master Prompt #22)

Official Paymaster docs inspected:

- https://developers.circle.com/paymaster
- https://developers.circle.com/paymaster/pay-gas-fees-usdc
- https://developers.circle.com/paymaster/addresses-and-events

Findings added to discovery boundary:

- Circle Paymaster is documented as a **permissionless onchain ERC-4337 token paymaster** (v0.7 and v0.8 variants).
- It is distinct from Circle Wallets Gas Station product surface, even though both address gas UX.
- Arc Testnet paymaster addresses are explicitly documented:
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- Quickstart flow is smart-account + userOp centric; treat as SCA/ERC-4337 path requirement.

This is **documentation-level confirmation only** and does not change claim status:

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

Reference analysis document:

- `docs/grant/agentpay/CIRCLE_PAYMASTER_OFFICIAL_DOCS_ANALYSIS.md`

Setup/readiness checklist reference:

- `docs/grant/agentpay/GAS_STATION_PAYMASTER_SETUP_CHECKLIST.md`

## 13) Risk notes

- Do not treat EOA signing/send verification as gasless/paymaster verification.
- Do not create SCA/policy config by guesswork.
- Do not claim sponsorship support without transaction-level proof.
- Keep all Circle credentials server-only and never expose them in frontend/public env.
