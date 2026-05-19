## Master Prompt #22 official-docs delta (discovery only)

- [x] Circle Paymaster official docs reviewed (`/paymaster`, `/pay-gas-fees-usdc`, `/addresses-and-events`)
- [x] Arc Testnet paymaster addresses identified from official docs:
  - v0.7: `0x31BE08D380A21fc740883c0BC434FcFc88740b58`
  - v0.8: `0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- [x] Relationship clarified: Paymaster vs Circle Wallets Gas Station are distinct surfaces
- [x] Requirement clarified: paymaster integration is SCA/ERC-4337 userOp path (not plain EOA transfer path)
- [ ] Runtime paymaster/gasless proof on Arc Testnet (deferred to next approved sprint)

Claim boundary reminder:

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`

# Circle Gas Station / Paymaster Setup Checklist — ARC-TESTNET (Readiness Only)

## 1) Current status

- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster / Gas Station: `NOT_CLAIMED`
- Current verified wallet is `EOA` (not yet proven eligible for sponsorship path)
- SCA + policy configuration is likely required for claimable gasless/paymaster proof
- Discovery classification remains:
  - `DO_NOT_CLAIM`
  - `BLOCKED_EXISTING_WALLET_IS_EOA`
  - `FEASIBLE_BUT_NEEDS_SCA_WALLET`
  - `FEASIBLE_BUT_NEEDS_GAS_STATION_POLICY`
  - `FEASIBLE_BUT_NEEDS_CONSOLE_SETUP`
  - `FEASIBLE_BUT_NEEDS_ARC_TESTNET_SUPPORT_CONFIRMATION`

## 2) What is already verified

Circle Wallets base scope on `ARC-TESTNET` is already verified (non-gasless path):

- Wallet creation + metadata read: `CURRENT_VERIFIED`
- Message signing: `CURRENT_VERIFIED`
- Transfer estimate: `CURRENT_CODE_IMPLEMENTED_TRANSFER_ESTIMATE_VERIFIED`
- Tiny live transfer/send: `CURRENT_VERIFIED`

Known wallet proof:

- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `walletAddress: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- `accountType: EOA`
- `custodyType: DEVELOPER`
- `state: LIVE`

Known live transfer proof:

- `transactionId: 373289ce-27f9-55d7-8601-b853f8fd9cc2`
- `state: COMPLETE`
- `txHash: 0x702c86b15ee071666327004e2ded60eb8ed065b9f153e52ba2bbcd60378e912e`
- `tokenId: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `amount: 0.001`
- `chain: ARC-TESTNET`

## 3) What must be confirmed in Circle Console

Founder-observed Console state (testnet mode, documented for readiness):

- Policy name: `Default Arc Testnet Policy`
- Network: `Arc Testnet`
- Status: `Active`
- Daily spend limit: `50 USDC-TESTNET`
- `Sponsored Transactions` UI/tab is present
- Current settled sponsored transaction count: `0`

Confirm all items below before any gasless/paymaster verification attempt:

1. Is `ARC-TESTNET` supported for Gas Station / Paymaster in current Circle Console/account tier?
2. Can an existing `EOA` wallet be sponsored, or is `SCA` mandatory?
3. If SCA is required, must `accountType=SCA` be set at wallet creation time?
4. Where is policy setup configured in Circle Console (exact section/path)?
5. Which chains/tokens/operations are currently allowed under sponsorship?
6. What allowlist / spending-rule constraints must be configured?
7. What sponsorship caps/limits/rate limits apply?
8. Is testnet Gas Station/paymaster explicitly enabled for this account/project?
9. Does a non-secret `policyId` / `configId` / `appId` / `paymasterId` exist and map to ARC-TESTNET usage?

## 4) Console checklist (founder-run)

1. Log in to Circle Console.
2. Navigate to Wallets + Gas Station / Paymaster/policy area.
3. Confirm ARC-TESTNET sponsorship support is visible for your account.
4. Inspect existing policy or create policy only with explicit documented settings.
5. Define allowed chain (`ARC-TESTNET`) and allowed operation scope.
6. Define allowed token(s) and transfer/operation constraints.
7. Confirm wallet type requirement (`EOA` vs `SCA`).
8. Record non-secret identifiers (`policyId`/`configId`) **locally only**.
9. Never paste API keys/entity secrets in chat.

## 5) Env vars likely needed (placeholders only)

Do not expose secrets. Do not add public env for Circle secrets.

Potential server-only placeholders for a future gated sprint:

- `CIRCLE_GAS_STATION_POLICY_ID`
- `CIRCLE_PAYMASTER_POLICY_ID`
- `CIRCLE_GASLESS_DRY_RUN=true`
- `CIRCLE_GASLESS_WALLET_ID`
- `CIRCLE_GASLESS_TOKEN_ID`
- `CIRCLE_GASLESS_DESTINATION`
- `CIRCLE_GASLESS_AMOUNT`

Note: placeholders are documentation-only in this sprint; no mutation run is authorized.

## 6) SCA wallet decision

- If Console confirms existing EOA sponsorship is unsupported, create an SCA wallet in a later gated sprint.
- Do not claim gasless/paymaster until SCA requirement is satisfied and proof exists.
- SCA wallet creation and verification must be separately documented with proof artifacts.

## 7) Minimal proof path (later approved sprint)

1. Readiness check (non-mutating): policy + wallet-type prerequisite confirmation.
2. Create/use SCA wallet if required by Console policy rules.
3. Run dry-run/estimate preflight (if available) before live sponsorship.
4. Execute one tiny sponsored transaction.
5. Confirm transaction status/finality.
6. Capture tx hash plus sponsorship/policy evidence.
7. Update proof registry only after finality is confirmed.

## 8) Required proof artifacts

- Wallet type used (`EOA` or `SCA`)
- Non-secret `policyId` / `configId`
- Request/operation identifier
- Transaction hash
- Final transaction state
- Chain (`ARC-TESTNET`)
- Token + amount
- Explicit evidence that sponsorship/paymaster policy was applied
- Confirmation that no secrets were printed

## 9) Current blockers

- Existing verified wallet is `EOA`
- Console policy visibility is now observed on ARC-TESTNET, but API/runtime policy introspection remains unproven in-repo
- EOA vs SCA requirement for sponsorship path remains unresolved
- Policy/config identifier requirement for sponsored transaction params remains unresolved
- Exact sponsored transfer SDK parameterization remains unresolved
- No sponsored transaction proof captured

## 10) Go / no-go criteria

- **GO** only after Console confirms policy setup + wallet-type requirements and these are documented.
- **NO-GO** if ARC-TESTNET sponsorship is unsupported or official guidance is insufficient to produce safe proof.

## 11) Claim boundary

### Allowed now

- Keep gasless/paymaster as `NOT_CLAIMED`
- Keep conservative discovery tags and blockers documented
- Perform setup/readiness documentation only

### Not allowed yet

- Do not claim gasless verified
- Do not claim paymaster verified
- Do not run live sponsored transaction in this sprint
- Do not treat existing EOA transfer proof as sponsorship proof

## Master Prompt #23 planning checkpoint

- Planning doc: `docs/grant/agentpay/SCA_PAYMASTER_PROOF_PATH_PLAN.md`
- Optional non-mutating script: `scripts/circle-sca-paymaster-readiness.ts`
- Script command: `npm run circle:sca-paymaster:readiness`

Conservative classification remains:

- `FEASIBLE_BUT_NEEDS_SCA_WALLET_CREATION`
- `FEASIBLE_BUT_NEEDS_APP_KIT_PAYMASTER_PATH`
- `FEASIBLE_BUT_NEEDS_RAW_ERC4337_PATH`
- `DO_NOT_CLAIM`

Status boundary unchanged:

- Gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`
