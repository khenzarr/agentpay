# Circle Wallets Token ID Resolution — ARC-TESTNET USDC (Discovery-Only)

Date: 2026-05-19  
Mode: discovery + safe non-mutating implementation only

## Scope and constraints

- No token ID guessing.
- No transfer/sign/send/gasless/paymaster mutation.
- No secret exposure.
- No UI, escrow, ABI, or claim-boundary expansion.

## Environment context

- walletSetId: `70d4bdf1-74a3-5098-8b37-5c573641e764`
- walletId: `d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- walletAddress: `0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- blockchain: `ARC-TESTNET`
- accountType: `EOA`
- custodyType: `DEVELOPER`
- state: `LIVE`

## Narrow SDK/API findings

From installed `@circle-fin/developer-controlled-wallets` type surface (`dist/types/clients/developer-controlled-wallets.d.ts`) and existing non-mutating scripts:

1. **Transfer estimate input supports `tokenId` and `tokenAddress`.**
   - `EstimateTransferTransactionFeeRequest` includes optional `tokenId` and `tokenAddress`.
   - Current local estimate script enforces `CIRCLE_WALLET_TRANSFER_TOKEN_ID`; this is a local safety/implementation choice, not proof that token address is impossible.

2. **Create transfer input supports `tokenId` and `tokenAddress`.**
   - `CreateTransferTransactionForDeveloperRequest` includes optional `tokenId` and `tokenAddress`.
   - No live transfer was executed in this sprint.

3. **Wallet-specific balance endpoint exists and is non-mutating.**
   - `getWalletTokenBalance({ id, includeAll })` is available and already used in `scripts/circle-wallets-token-lookup.ts`.
   - This endpoint is the safest wallet-local path to reveal token metadata/IDs when present.

4. **Monitored token endpoint exists but is not a guaranteed global supported-token inventory.**
   - `listMonitoredTokens(...)` exists and was queried by current token lookup script.
   - Existing lookup result for `ARC-TESTNET` + `USDC`: `candidateCount=0`.

5. **`getToken({ id })` is ID→details, not reverse lookup.**
   - Requires pre-known token ID.
   - No SDK reverse resolver found for `(blockchain + symbol/address) -> tokenId` in this discovery.

6. **Supported-token inventory endpoint is not proven in this repo via installed SDK.**
   - No official, verified, non-mutating SDK method was found here that guarantees global token inventory by chain for Wallet token IDs.
   - Console/API may expose inventory outside this installed lookup surface, but that path is not runtime-proven in this sprint.

7. **Practical blocker may be inventory visibility/funding state.**
   - If wallet holds no ARC-TESTNET USDC, wallet-balance-driven discovery may return no token entries.
   - Funding wallet with ARC-TESTNET USDC, then querying wallet balances, is the safest next official path to attempt token ID discovery without guessing.

## Classification

**BLOCKED_NEEDS_WALLET_FUNDING_TO_REVEAL_TOKEN_ID**

Rationale:

- No official ARC-TESTNET USDC token ID was returned from current non-mutating lookup surface.
- SDK confirms wallet-balance and monitored-token read surfaces, but no proven reverse resolver from `(chain,symbol)` to token ID.
- Next safe path is to fund wallet and inspect wallet token balances for token IDs.

## Funding path (non-mutating follow-up sequencing)

Fund target wallet (external manual action, outside this sprint’s mutations):

- walletAddress: `0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- chain: `ARC-TESTNET`
- token: `USDC`

Then run non-mutating discovery:

1. `npm run circle:wallets:get-wallet`
2. `npm run circle:wallets:list-balances`
3. `npm run circle:wallets:token-lookup`

Expected outcome if funding path works:

- Wallet balance output includes token entries and token IDs.
- Token ID can be set explicitly in `CIRCLE_WALLET_TRANSFER_TOKEN_ID`.

## Claim boundary status

- Circle Wallets transfer estimate: **NOT_CLAIMED** (still blocked pending token-ID resolution + successful estimate proof).
- Circle Wallets signing/send/gasless: **NOT_CLAIMED**.
- Paymaster: **NOT_CLAIMED**.
