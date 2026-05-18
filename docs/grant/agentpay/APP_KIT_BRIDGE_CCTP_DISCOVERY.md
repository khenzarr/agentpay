# App Kit Bridge / CCTP Discovery — AgentPay (Master Prompt #8)

**Date:** 2026-05-18  
**Scope:** Discovery + live Bridge/CCTP verification completed in this sprint

## 1) Official docs used

- https://docs.arc.io/app-kit/bridge
- https://docs.arc.io/app-kit/quickstarts/bridge-tokens-across-blockchains
- https://docs.arc.io/app-kit/concepts/bridge-fees
- https://docs.arc.io/app-kit/tutorials/bridge/collect-bridge-fee
- https://docs.arc.io/app-kit/tutorials/bridge/estimate-costs
- https://docs.arc.io/app-kit/tutorials/bridge/use-forwarding-service
- https://docs.arc.io/app-kit/tutorials/bridge/configure-transfer-speed
- https://docs.arc.io/app-kit/tutorials/bridge/specify-recipient-address
- https://docs.arc.io/app-kit/references/bridge-error-recovery
- https://docs.arc.io/app-kit/references/supported-blockchains
- https://docs.arc.io/app-kit/references/sdk-reference
- https://docs.arc.io/app-kit/tutorials/installation

## 2) Exact bridge API shape found

From installed typings (`node_modules/@circle-fin/app-kit/index.d.ts`):

- `bridge(params: BridgeParams): Promise<BridgeResult>`
- `estimateBridge(params: BridgeParams): Promise<EstimateResult>`
- `interface BridgeParams { from, to, amount, config?, token?: 'USDC', invocationMeta? }`
- `declare enum BridgeChain { ... Arc_Testnet, Ethereum_Sepolia, Base_Sepolia, Arbitrum_Sepolia, Polygon_Amoy_Testnet, ... }`
- `type BridgeChainIdentifier = ChainDefinition | BridgeChain | \`${BridgeChain}\``

Important typing notes:

- Token scope for bridge params is USDC (`token?: 'USDC'`, default USDC).
- Typings and docs indicate CCTP-backed flow is abstracted by App Kit Bridge.

## 3) Required imports

```ts
import { AppKit, type BridgeParams } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
```

## 4) Required package(s)

- `@circle-fin/app-kit` ✅ installed (`^1.5.1`)
- `@circle-fin/adapter-viem-v2` ✅ installed (`^1.11.0`)

## 5) Supported source chains

From official docs + installed `BridgeChain` enum, Bridge supports multiple mainnet/testnet sources, including testnet examples such as:

- `Ethereum_Sepolia`
- `Base_Sepolia`
- `Arbitrum_Sepolia`
- `Polygon_Amoy_Testnet`
- others listed in docs/types

## 6) Supported destination chains

Official docs and enum include `Arc_Testnet` as a bridge destination.

## 7) Supported token(s)

- USDC for Bridge examples and bridge param typing.

## 8) Whether Arc_Testnet is supported

**Yes** — explicitly present in App Kit `BridgeChain` enum and docs examples.

## 9) Whether USDC bridge to Arc_Testnet is supported

**Yes** — official quickstart and estimate tutorials include `Ethereum_Sepolia -> Arc_Testnet` USDC examples.

## 10) Whether estimate API exists

**Yes** — `kit.estimateBridge(params)` exists in installed typings and is documented in estimate tutorial.

## 11) Whether private-key adapter can be reused

**Yes** — current repo already uses `createViemAdapterFromPrivateKey` in `scripts/appkit-send-arc-usdc.ts`, and official bridge examples also use viem adapter/private key for EVM wallets.

## 12) Whether additional Circle credentials/API keys are required

- **For viem private-key flow:** Not required by the shown bridge quickstart path.
- **For Circle Wallets flow:** Official docs mention Circle API key/entity secret and Circle Console setup.

Conclusion for this repo sprint path: private-key local script path can proceed without Circle API credentials.

## 13) Whether source chain testnet funds are required

**Yes** for live bridge execution:

- Source-chain testnet USDC required
- Source and/or destination gas balances required (native token per chain)

Estimate-only path can be run first and is safer.

## 14) Whether bridge can run as a local script safely

**Yes**, with guardrails:

- Use `.env.appkit.local`
- Validate env vars
- Default to dry-run / estimate-only
- Never print private key
- Require explicit opt-in for live execution

## 15) Whether live verification is possible now

**Yes** — live Bridge/CCTP verification was executed successfully in this sprint.

## Classification

**CURRENT_VERIFIED**

Rationale:

- Bridge/CCTP API is present and Arc_Testnet-supported in official docs + installed package.
- Estimate flow was shown before live execution.
- Live bridge verification was completed with successful approve/burn/attestation/mint steps.

## Current implementation boundary after discovery + script integration

- Bridge/CCTP code path is now implemented as:
  - `scripts/appkit-bridge-usdc-to-arc.ts`
  - estimate-first workflow via `estimateBridge`
  - dry-run default (`APPKIT_BRIDGE_DRY_RUN=true`)
  - explicit live gate (`APPKIT_BRIDGE_DRY_RUN=false`)
- Current status for this sprint: **CURRENT_VERIFIED**
- Real bridge operation proof is now recorded below.

Live verification evidence recorded:

- Command: `npm run appkit:bridge:usdc:arc`
- Env mode: `APPKIT_BRIDGE_DRY_RUN=false`
- Provider: `CCTPV2BridgingProvider`
- Source chain: `Ethereum_Sepolia`
- Destination chain: `Arc_Testnet`
- Token: `USDC`
- Amount: `0.01`
- Source address: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Recipient address: `0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
- Estimate was shown before live execution.
- Bridge result state: `success`
- Transfer speed: `FAST`

Execution steps:

1. `approve`
   - state: `success`
   - tx hash: `0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd`
   - explorer: https://sepolia.etherscan.io/tx/0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd
2. `burn`
   - state: `success`
   - tx hash: `0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9`
   - explorer: https://sepolia.etherscan.io/tx/0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9
3. `fetchAttestation`
   - state: `success`
   - cctpVersion: `2`
   - status: `complete`
   - sourceDomain: `0`
   - destinationDomain: `26`
4. `mint`
   - state: `success`
   - tx hash: `0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436`
   - explorer: https://testnet.arcscan.app/tx/0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436
   - Arc block: `42834309`

Operational safety notes:

- Private key was not printed.
- Script used isolated `.env.appkit.local` (git-ignored).
