# EXTERNAL ERC-4337 Provider Research — AgentPay (ARC-TESTNET)

## 1. Purpose

Research whether external ERC-4337 infrastructure providers can support `ARC-TESTNET` for a future deterministic Circle Paymaster proof.

Scope boundary for this step:

- research/docs only
- no live transactions
- no sponsored userOps
- no wallet creation
- no secrets
- no claim upgrade

---

## 2. Current AgentPay raw ERC-4337 blockers

Baseline from current internal readiness docs remains:

- `BLOCKED_NO_BUNDLER`
- `FEASIBLE_PAYMASTER_DATA_LOCAL_PERMIT_PATH`
- `BLOCKED_CIRCLE_SCA_RAW_COMPATIBILITY`
- `FEASIBLE_BUT_NEEDS_PROVIDER_ACCOUNT`
- `DO_NOT_CLAIM`

Current status boundary remains:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

Known Arc Testnet context:

- `chainId`: `5042002`
- RPC: `https://rpc.testnet.arc.network`
- explorer: `https://testnet.arcscan.app`
- native gas/payment symbol: `USDC`

Known Circle Paymaster addresses:

- EntryPoint v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- EntryPoint v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`

---

## 3. Provider comparison matrix

Conservative interpretation rule used here:

- If explicit `ARC-TESTNET` / `chainId 5042002` support is not clearly documented in accessible evidence, mark as **not confirmed** and require provider account/support confirmation.

| Provider | Custom chains | Explicit Arc / 5042002 support | Bundler RPC | Paymaster service | EntryPoint v0.8 | Circle paymaster combinable | Account/API key needed | Deterministic proof artifacts possible (`userOpHash`,`txHash`,`receipt`,`EntryPoint`,`paymaster`) | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| Pimlico | Likely yes (supports many EVM AA flows), exact Arc onboarding path unverified in this sprint | **Not confirmed** | Yes (general AA positioning) | Yes (general paymaster offering) | Likely yes | Unclear on Arc | Yes | Likely yes once chain support + integration are confirmed | `POSSIBLE_BUT_NEEDS_ACCOUNT_OR_SUPPORT_TICKET` |
| Stackup | Likely yes (AA infra provider), custom Arc onboarding unverified | **Not confirmed** | Yes (general) | Yes (general) | Likely yes | Unclear on Arc | Yes | Likely yes once chain support + integration are confirmed | `POSSIBLE_BUT_NEEDS_ACCOUNT_OR_SUPPORT_TICKET` |
| Alchemy Account Kit / AA infra | Supports AA infra on supported networks | **Not confirmed** | Yes (for supported networks) | Yes (for supported networks) | Likely yes | Unclear on Arc | Yes | Yes on supported chains; Arc support not confirmed | `POSSIBLE_BUT_NEEDS_ACCOUNT_OR_SUPPORT_TICKET` |
| Biconomy | Supports AA stack on supported networks | **Not confirmed** | Yes (general) | Yes (general) | Likely yes | Unclear on Arc | Yes | Likely yes if Arc/custom chain support exists | `POSSIBLE_BUT_NEEDS_ACCOUNT_OR_SUPPORT_TICKET` |
| Gelato Relay / AA | Relay/AA capabilities exist | **Not confirmed** | Potentially (depends on product path) | Potentially (depends on sponsorship path) | Unclear | Unclear | Usually yes | Possible but product fit to raw ERC-4337 + Arc not confirmed | `UNCLEAR` |
| ZeroDev | AA stack exists (often built with external infra) | **Not confirmed** | Yes (via stack) | Yes (via stack) | Likely yes | Unclear | Yes | Possible if upstream chain support exists | `UNCLEAR` |
| Safe AA | Strong smart-account stack, infra often composed with partners | **Not confirmed** | Depends on chosen infra | Depends on chosen infra | Likely yes | Unclear | Yes | Possible but requires infra composition + chain confirmation | `UNCLEAR` |

---

## 4. Pimlico finding

What is supportable in this sprint:

- Public docs are clearly ERC-4337 focused (bundler/paymaster concepts visible).
- Explicit `ARC-TESTNET` / `5042002` support was not confirmed from accessible evidence in this run.

Conservative result:

- technically promising for AA
- operationally blocked until dashboard/account-level chain support confirmation or support-ticket confirmation for Arc

Verdict: `POSSIBLE_BUT_NEEDS_ACCOUNT_OR_SUPPORT_TICKET`

---

## 5. Stackup finding

What is supportable in this sprint:

- Stackup is an AA infrastructure provider category match (bundler/paymaster class).
- Explicit `ARC-TESTNET` / `5042002` support is not confirmed in current captured evidence.

Verdict: `POSSIBLE_BUT_NEEDS_ACCOUNT_OR_SUPPORT_TICKET`

---

## 6. Alchemy finding

What is supportable in this sprint:

- Alchemy Account Kit / AA infra provides bundler/paymaster style services on supported networks.
- Explicit `ARC-TESTNET` / `5042002` support was not confirmed in this research pass.

Verdict: `POSSIBLE_BUT_NEEDS_ACCOUNT_OR_SUPPORT_TICKET`

---

## 7. Biconomy finding

What is supportable in this sprint:

- Biconomy provides AA infrastructure (bundler/paymaster classes) in general.
- Explicit `ARC-TESTNET` / `5042002` support is not confirmed in captured evidence.

Verdict: `POSSIBLE_BUT_NEEDS_ACCOUNT_OR_SUPPORT_TICKET`

---

## 8. Other provider notes

### Gelato Relay / AA

- Relevant for sponsored UX and relayed execution.
- Raw ERC-4337 + Arc-specific compatibility remains unconfirmed in current evidence set.

### ZeroDev

- Relevant AA platform.
- Arc support likely depends on upstream bundler/paymaster chain support; not confirmed.

### Safe AA

- Safe smart-account stack is relevant, but deterministic raw ERC-4337 proof still needs confirmed Arc-compatible infra endpoints.
- Not a direct bypass for missing bundler/paymaster readiness.

---

## 9. Circle Paymaster compatibility concern

Circle v0.8 quickstart refinement:

- The documented viem route builds paymaster data locally via `getPaymasterData()` using EIP-2612 permit signature + packed bytes payload.
- A separate Circle paymaster service URL is therefore not yet proven necessary for that specific quickstart path.
- Bundler remains required (`createBundlerClient`).
- Compatibility between existing Circle-created SCA wallets and the quickstart account model (`toSimple7702SmartAccount`) remains unresolved.

Even if an external provider supports Arc chain onboarding, unresolved items remain:

1. Can provider bundler/paymaster flow be combined with Circle paymaster addresses on Arc (`v0.8`/`v0.7` above)?
2. Is Circle SCA metadata/signing path compatible with deterministic raw userOp construction on that provider stack?
3. Can the final artifact set be captured deterministically:
   - `userOpHash`
   - `txHash`
   - receipt/finality
   - EntryPoint version/address
   - paymaster field/address

Current conservative tag remains: `BLOCKED_CIRCLE_PAYMASTER_COMPATIBILITY_UNCLEAR`

---

## 10. Recommended provider path

1. Prioritize **Pimlico** and **Stackup** as first support-ticket/account-verification targets (both are closest category fit for raw ERC-4337 infra).
2. Keep **Alchemy** and **Biconomy** as parallel options.
3. Require explicit written confirmation for:
   - `chainId 5042002` availability
   - bundler RPC endpoint availability
   - paymaster RPC/service availability
   - EntryPoint `v0.8` support on Arc
4. Only after that, validate Circle paymaster + Circle SCA compatibility path.

---

## 11. Required founder actions

1. Open provider accounts (Pimlico, Stackup, Alchemy, Biconomy).
2. Raise support tickets with exact request:
   - “Do you explicitly support `ARC-TESTNET` (`chainId 5042002`) for ERC-4337 bundler + paymaster flows?”
   - “If not listed, can you enable custom chain support for this chain?”
3. Request concrete endpoint examples and auth requirements.
4. Request EntryPoint version support confirmation (`v0.8` preferred, `v0.7` fallback).
5. Request deterministic artifact capture guidance (`userOpHash`, `txHash`, receipt).
6. Run one approved proof sprint only after confirmations and policy approval.

---

## 12. Claim boundary

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
- Claim stance: `DO_NOT_CLAIM`

No claim upgrade is justified from this research-only step.

---

## 13. Final classification

- `FEASIBLE_WITH_PROVIDER_ACCOUNT`
- `FEASIBLE_PAYMASTER_DATA_LOCAL_PERMIT_PATH`
- `FEASIBLE_BUT_NEEDS_PROVIDER_CUSTOM_CHAIN_SUPPORT`
- `FEASIBLE_BUT_NEEDS_SUPPORT_TICKET`
- `BLOCKED_NO_PROVIDER_CONFIRMED_ARC_TESTNET`
- `BLOCKED_CIRCLE_PAYMASTER_COMPATIBILITY_UNCLEAR`
- `DO_NOT_CLAIM`
