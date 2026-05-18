# Circle Wallets Token ID Resolution — ARC-TESTNET USDC (Verified)

Date: 2026-05-19  
Mode: verified non-mutating discovery + verified transfer estimate

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

## Verified token ID proof

Command:

- `npm run circle:wallets:list-balances`

Result:

- `returnedTokenBalanceCount: 1`
- `filteredCount: 1`
- `filterBlockchain: ARC-TESTNET`
- `filterSymbol: USDC`
- `tokenId: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `symbol: USDC`
- `name: USDC`
- `blockchain: ARC-TESTNET`
- `decimals: 18`
- `amount: 20`

Command:

- `npm run circle:wallets:token-lookup`

Result:

- `lookupBlockchain: ARC-TESTNET`
- `lookupSymbol: USDC`
- `candidateCount: 1`
- `source: getWalletTokenBalance`
- `id: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `symbol: USDC`
- `name: USDC`
- `blockchain: ARC-TESTNET`
- `decimals: 18`

## Transfer estimate proof (non-mutating)

Env used:

- `CIRCLE_WALLET_TRANSFER_TOKEN_ID=15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `CIRCLE_WALLET_TRANSFER_DRY_RUN=true`

Command:

- `npm run circle:wallets:estimate-transfer`

Result:

- transfer estimate succeeded.

Latest successful estimate output:

- low:
  - `gasLimit: 21000`
  - `networkFee: 0.000897567715086`
  - `networkFeeRaw: 0.000477567715086`
  - `baseFee: 20`
  - `priorityFee: 2.741319766`
  - `maxFee: 42.741319766`
- medium:
  - `gasLimit: 21000`
  - `networkFee: 0.000911224445355`
  - `networkFeeRaw: 0.000491224445355`
  - `baseFee: 20`
  - `priorityFee: 3.391640255`
  - `maxFee: 43.391640255`
- high:
  - `gasLimit: 21000`
  - `networkFee: 0.000933483353355`
  - `networkFeeRaw: 0.000513483353355`
  - `baseFee: 20`
  - `priorityFee: 4.451588255`
  - `maxFee: 44.451588255`

No live transfer was executed.

## Claim boundary status

- Circle Wallets transfer estimate: **CURRENT_CODE_IMPLEMENTED_TRANSFER_ESTIMATE_VERIFIED**.
- Circle Wallets signing/send/gasless: **NOT_CLAIMED**.
- Paymaster: **NOT_CLAIMED**.
