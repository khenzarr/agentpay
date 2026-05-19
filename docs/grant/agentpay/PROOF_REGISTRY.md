# Proof Registry — AgentPay

## Circle Wallets (Developer-Controlled) — ARC-TESTNET

### Verified Circle Wallets live scope (CURRENT_VERIFIED boundary)

- `walletSetId: 70d4bdf1-74a3-5098-8b37-5c573641e764`
- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `walletAddress: 0x156c37d9a28b67588720116a13fba1ff7a5275f8`
- `blockchain: ARC-TESTNET`
- `accountType: EOA`
- `custodyType: DEVELOPER`
- `state: LIVE`

### Token ID resolution proof (non-mutating)

Command: `npm run circle:wallets:list-balances`

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

Command: `npm run circle:wallets:token-lookup`

- `lookupBlockchain: ARC-TESTNET`
- `lookupSymbol: USDC`
- `candidateCount: 1`
- `source: getWalletTokenBalance`
- `id: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `symbol: USDC`
- `name: USDC`
- `blockchain: ARC-TESTNET`
- `decimals: 18`

### Transfer estimate proof (non-mutating)

Env:

- `CIRCLE_WALLET_TRANSFER_TOKEN_ID=15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `CIRCLE_WALLET_TRANSFER_DRY_RUN=true`

Command: `npm run circle:wallets:estimate-transfer`

Result: transfer estimate succeeded.

Low:

- `gasLimit: 21000`
- `networkFee: 0.000897567715086`
- `networkFeeRaw: 0.000477567715086`
- `baseFee: 20`
- `priorityFee: 2.741319766`
- `maxFee: 42.741319766`

Medium:

- `gasLimit: 21000`
- `networkFee: 0.000911224445355`
- `networkFeeRaw: 0.000491224445355`
- `baseFee: 20`
- `priorityFee: 3.391640255`
- `maxFee: 43.391640255`

High:

- `gasLimit: 21000`
- `networkFee: 0.000933483353355`
- `networkFeeRaw: 0.000513483353355`
- `baseFee: 20`
- `priorityFee: 4.451588255`
- `maxFee: 44.451588255`

No live transfer was executed.

### Message signing proof (server-only, non-fund-moving)

Command: `npm run circle:wallets:sign-message`

Result: message signing succeeded.

- `walletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `message: AgentPay Circle Wallets signing proof on ARC-TESTNET`
- `signature: 0x78d2d1364b64fb0be9b053b78abe519890dfb82e0ab3d52125675ada7e4913533f54e056b33121a95a886a4446bfb2db3a864a2a328314bf3e66f00b651f5aee1c`
- `status: 200`
- No funds moved.
- No transfer created.

### Live tiny transfer/send proof (founder-run)

Submitted command: `npm run circle:wallets:send-tiny-transfer`

- `transactionId: 373289ce-27f9-55d7-8601-b853f8fd9cc2`
- `state: INITIATED`
- `sourceWalletId: d99113e2-2e24-5d3f-ab6d-7b8c49367566`
- `destinationAddress: 0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
- `tokenId: 15dc2b5d-0994-58b0-bf8c-3a0501148ee8`
- `amount: 0.001`
- `blockchain: ARC-TESTNET`
- `status: 201`

Finality check command (non-mutating): `npm run circle:wallets:get-transaction`

- `transactionId: 373289ce-27f9-55d7-8601-b853f8fd9cc2`
- `state: COMPLETE`
- `txHash: 0x702c86b15ee071666327004e2ded60eb8ed065b9f153e52ba2bbcd60378e912e`
- `finalityFieldsPresent: true`
- `responseShape: response.data.transaction`
- No secrets were printed.
- No gasless/paymaster flow was run.

### Classification guardrail

- Circle Wallets transfer estimate path: `CURRENT_CODE_IMPLEMENTED_TRANSFER_ESTIMATE_VERIFIED`
- Circle Wallets signing: `CURRENT_VERIFIED` (message signing only)
- Circle Wallets send/transfer: `CURRENT_VERIFIED` (live tiny transfer/send verified on ARC-TESTNET)
- Circle Wallets gasless: `NOT_CLAIMED`
- Paymaster: `NOT_CLAIMED`

Gasless/paymaster discovery update (Master Prompt #19):

- Discovery report: `docs/grant/agentpay/CIRCLE_WALLETS_GASLESS_PAYMASTER_DISCOVERY.md`
- Classification: `DO_NOT_CLAIM`
- Blocking tags: `BLOCKED_EXISTING_WALLET_IS_EOA`, `FEASIBLE_BUT_NEEDS_SCA_WALLET`, `FEASIBLE_BUT_NEEDS_GAS_STATION_POLICY`, `FEASIBLE_BUT_NEEDS_CONSOLE_SETUP`
- Arc-testnet gasless/paymaster path remains unverified without real sponsored transaction proof.
