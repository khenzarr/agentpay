# Circle Wallets Server Setup — Developer-Controlled Wallets (Arc Testnet)

**Date:** 2026-05-18  
**Scope:** Server-only setup path for Circle Developer-Controlled Wallets. No automatic live wallet creation.

## Security rules

- Never expose Circle secrets in client code.
- Never use `NEXT_PUBLIC_*` for Circle credentials.
- Never commit `.env.circle.local` or recovery artifacts.
- Never paste API key/entity secret in chat.

## Required env file

Use `.env.circle.local` only:

```bash
CIRCLE_API_KEY=
CIRCLE_ENTITY_SECRET=
CIRCLE_WALLET_SET_ID=
CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET
CIRCLE_WALLETS_DRY_RUN=true
CIRCLE_WALLET_SET_NAME=AgentPay Arc Testnet Wallet Set
CIRCLE_WALLET_ACCOUNT_TYPE=EOA
```

`CIRCLE_ENTITY_SECRET_CIPHERTEXT` is optional and only relevant for direct REST paths. It is not required for the official SDK quickstart flow used here.

## Founder runbook (manual)

1. Create Circle API key in Circle Console.
2. Generate entity secret locally:

```bash
npm run circle:wallets:generate-entity-secret
```

3. Store entity secret in a password manager.
4. Add `CIRCLE_API_KEY` and `CIRCLE_ENTITY_SECRET` to `.env.circle.local`.
5. Register entity secret and download recovery file:

```bash
npm run circle:wallets:register-entity-secret
```

6. Secure recovery artifact from `.circle-recovery/`.
7. Run readiness checks:

```bash
npm run circle:wallets:readiness
```

8. Dry-run wallet creation (safe mode by default):

```bash
npm run circle:wallets:create:arc
```

9. Live creation only after explicit approval and env change:

```bash
# in .env.circle.local
CIRCLE_WALLETS_DRY_RUN=false

npm run circle:wallets:create:arc
```

10. Read back verified wallet metadata (non-mutating):

```bash
npm run circle:wallets:get-wallet
```

11. Run transfer fee estimate only (non-mutating, no sign/send):

```bash
npm run circle:wallets:estimate-transfer
```

11.5. Run token lookup helper (non-mutating, server-only):

```bash
npm run circle:wallets:token-lookup
```

11.6. Run wallet balances helper (non-mutating, server-only):

```bash
npm run circle:wallets:list-balances
```

11.7. Run tiny transfer script (dry-run default; no mutation unless explicitly disabled):

```bash
npm run circle:wallets:send-tiny-transfer
```

11.8. Check a submitted transfer by transaction id (non-mutating, server-only):

```bash
npm run circle:wallets:get-transaction
```

Required transfer-estimate env values in `.env.circle.local`:

```bash
CIRCLE_WALLET_ID=
CIRCLE_WALLET_ADDRESS=
CIRCLE_WALLET_TRANSFER_DESTINATION=
CIRCLE_WALLET_TRANSFER_AMOUNT=0.001
CIRCLE_WALLET_TRANSFER_TOKEN_ID=
CIRCLE_WALLET_TRANSACTION_ID=
CIRCLE_WALLET_TRANSFER_DRY_RUN=true
CIRCLE_TOKEN_LOOKUP_BLOCKCHAIN=ARC-TESTNET
CIRCLE_TOKEN_LOOKUP_SYMBOL=USDC
CIRCLE_TOKEN_LOOKUP_TOKEN_ID=
```

Important:

- Do not guess `CIRCLE_WALLET_TRANSFER_TOKEN_ID`.
- `CIRCLE_WALLET_TRANSFER_TOKEN_ID` is required for transfer estimate.
- If unknown, discover the correct token id for your ARC-TESTNET asset via Circle Console/API inventory and then set it explicitly.
- The estimate script fails intentionally if token id is missing.
- Token lookup script (`circle:wallets:token-lookup`) is non-mutating and server-only; if it cannot resolve a token id from available SDK read endpoints, use Circle Console/API supported-token inventory as source of truth.
- Wallet balance script (`circle:wallets:list-balances`) is non-mutating and server-only; it may reveal token IDs once the wallet actually holds the target token.
- Current transfer-estimate classification: `CURRENT_CODE_IMPLEMENTED_TRANSFER_ESTIMATE_VERIFIED` (see `docs/grant/agentpay/CIRCLE_WALLETS_TOKEN_ID_RESOLUTION.md`).

## Verified status and evidence (founder-run)

Circle Wallets is now `CURRENT_VERIFIED` for wallet creation, metadata read, ARC-TESTNET USDC token ID resolution, transfer estimate, message signing, and live tiny transfer/send after capturing real proof artifacts:

- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `walletAddress: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- Command: `npm run circle:wallets:get-wallet`
- Result: wallet metadata fetched
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `address: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `accountType: EOA`
- `custodyType: DEVELOPER`
- `state: LIVE`
- Command: `npm run circle:wallets:readiness`
- Result: readiness checks passed
- `CIRCLE_TESTNET_BLOCKCHAIN=ARC-TESTNET`
- `CIRCLE_WALLETS_DRY_RUN=true`
- secrets redacted
- no live mutation performed by readiness
- Entity Secret registration succeeded
- Recovery directory confirmed: `./.circle-recovery`
- `.env.circle.local` and `.circle-recovery` remain git-ignored
- No secrets committed

Claim boundary (strict):

- ✅ Allowed: Circle Developer-Controlled Wallet creation, metadata read, ARC-TESTNET USDC token ID resolution, transfer estimate, message signing, and tiny transfer/send verification on ARC-TESTNET
- ❌ Not allowed yet: gasless transaction verification, paymaster verification
- ✅ Transfer estimate claim allowed: `CURRENT_CODE_IMPLEMENTED_TRANSFER_ESTIMATE_VERIFIED` (non-mutating estimate proof captured)
- ✅ Message signing claim allowed: `CURRENT_VERIFIED` (server-only benign message signing proof)
- ✅ Send/transfer claim allowed: `CURRENT_VERIFIED` (live tiny transfer/send proof captured and finalized)

Message-signing proof evidence (no funds movement):

- Command: `npm run circle:wallets:sign-message`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `message: AgentPay Circle Wallets signing proof on ARC-TESTNET`
- `signature: 0x78d2d1364b64fb0be9b053b78abe519890dfb82e0ab3d52125675ada7e4913533f54e056b33121a95a886a4446bfb2db3a864a2a328314bf3e66f00b651f5aee1c`
- `status: 200`
- No transfer created; no funds moved.

Additional verified proof (non-mutating):

- Command: `npm run circle:wallets:list-balances`
- Result: ARC-TESTNET USDC token ID resolved from wallet balance
- `tokenId: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `symbol: USDC`, `blockchain: ARC-TESTNET`, `decimals: 18`, `amount: 20`
- Command: `npm run circle:wallets:token-lookup`
- Result: `candidateCount: 1`, `source: getWalletTokenBalance`, `id: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- Command: `npm run circle:wallets:estimate-transfer`
- Env: `CIRCLE_WALLET_TRANSFER_TOKEN_ID=15dc2b5d-0994-58b0-bf8c-3a0501148ee8`, `CIRCLE_WALLET_TRANSFER_DRY_RUN=true`
- Result: transfer estimate succeeded (low/medium/high tiers recorded)
- No live transfer was executed.

Tiny transfer send script status:

- Script added: `scripts/circle-wallets-send-tiny-transfer.ts`
- Package command: `npm run circle:wallets:send-tiny-transfer`
- Default safety gate: `CIRCLE_WALLET_TRANSFER_DRY_RUN=true`
- Live send is now **CURRENT_VERIFIED** for the captured tiny ARC-TESTNET proof transfer.

Live transfer submission note (final proof captured):

- Command used: `npm run circle:wallets:send-tiny-transfer`
- Submitted `transactionId: 373289ce-27f9-55d7-8601-b853f8fd9cc2`
- Captured initial state: `INITIATED`
- Final transfer proof is captured from transaction read including final status and tx hash/finality evidence.
- Send/transfer claim is now `CURRENT_VERIFIED` for the tiny ARC-TESTNET proof transaction.

Safety rule after any live wallet-creation run:

- Set/restore `CIRCLE_WALLETS_DRY_RUN=true` in `.env.circle.local` to prevent accidental duplicate wallet creation.
