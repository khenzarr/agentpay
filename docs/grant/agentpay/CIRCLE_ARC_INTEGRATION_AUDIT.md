# Circle + Arc Integration Audit — AgentPay (Master Prompt #8)

**Date:** 2026-05-18  
**Method:** Strict code/docs/runtime-path audit in current AgentPay repo.

## 1) Audit objective

Determine which Circle/Arc integrations are actually implemented and verifiable now, and classify everything else as **NOT_CLAIMED** or **BLOCKED** (never “planned” for product-facing claims).

## 2) Verified current integration scope

- **USDC escrow on Arc Testnet**: implemented and demoed.
- **ERC-8183 tutorial ABI integration**: implemented for MVP lifecycle flow.
- **Real Arc Testnet lifecycle completion**: documented for Job #21683.
- **ArcNS identity support**: optional/non-blocking display-resolution support only.

## 3) Strict Circle product audit

| Product / Capability | Status | Audit finding | Classification rationale |
|---|---|---|---|
| App Kit Send | **CURRENT_VERIFIED** | Live verification executed via `npm run appkit:send:arc:usdc` with `APPKIT_DRY_RUN=false` on `Arc_Testnet` sending `USDC` amount `0.01`; tx hash: `0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb` ([ArcScan](https://testnet.arcscan.app/tx/0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb)); script used isolated `.env.appkit.local`; private key was not printed | Runtime path now verifiably executed and confirmed |
| Bridge / CCTP | **CURRENT_VERIFIED** | Live verification executed via `npm run appkit:bridge:usdc:arc` with `APPKIT_BRIDGE_DRY_RUN=false` using `CCTPV2BridgingProvider`, route `Ethereum_Sepolia -> Arc_Testnet`, token `USDC`, amount `0.01`; bridge result state `success`, transfer speed `FAST`; approve tx `0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd`, burn tx `0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9`, mint tx `0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436`; isolated `.env.appkit.local`; private key not printed | Runtime path now verifiably executed and confirmed |
| Gateway / Unified Balance | **NOT_CLAIMED** | No Gateway APIs/UI/runtime integration in current repo | Not implemented/verified |
| Circle Wallets (Developer-Controlled / Programmable) | **NOT_CLAIMED** | MVP demo uses user wallets; no verified Circle Wallets runtime integration path | Not implemented/verified |
| Paymaster / gas sponsorship | **NOT_CLAIMED** | No paymaster configuration or runtime sponsorship flow | Not implemented/verified |

## 4) Blocked state policy

For this repo snapshot, none of the above non-integrated Circle products are partially wired in a way that qualifies as runtime-**BLOCKED** integration attempts. They are treated as **NOT_CLAIMED** due to missing verifiable implementation paths.

## 5) Product-copy enforcement applied

- Homepage copy updated to:
  - **“Live on Arc Testnet”**
  - **“Mainnet-ready architecture, waiting for Arc mainnet availability.”**
- Product-facing roadmap/planned integration language removed from landing-page scope.
- Demo/readiness docs updated to strict classification wording: App Kit Send is CURRENT_VERIFIED; Bridge/CCTP is CURRENT_VERIFIED; Gateway/Wallets/Paymaster remain NOT_CLAIMED.

## 6) Claim-safe statement set (allowed now)

1. USDC escrow on Arc Testnet
2. ERC-8183 tutorial ABI integration (subset)
3. Real Arc Testnet lifecycle completed
4. Optional ArcNS identity display/resolution support (non-blocking)

Everything else remains **NOT_CLAIMED** until implemented and re-verified with passing validation.

App Kit Send is currently classified as **CURRENT_VERIFIED** for this sprint.

Bridge / CCTP is now **CURRENT_VERIFIED** in this sprint with live bridge proof recorded.

Live verification evidence recorded:

- Command: `npm run appkit:bridge:usdc:arc`
- Env mode: `APPKIT_BRIDGE_DRY_RUN=false`
- Provider: `CCTPV2BridgingProvider`
- Source chain: `Ethereum_Sepolia`
- Destination chain: `Arc_Testnet`
- Source address: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
- Recipient address: `0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
- Token: `USDC`
- Amount: `0.01`
- Estimate was shown before live execution.
- Bridge result state: `success`
- Transfer speed: `FAST`
- Approve tx: `0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd` (https://sepolia.etherscan.io/tx/0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd)
- Burn tx: `0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9` (https://sepolia.etherscan.io/tx/0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9)
- Attestation: state `success`, cctpVersion `2`, status `complete`, sourceDomain `0`, destinationDomain `26`
- Mint tx: `0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436` (https://testnet.arcscan.app/tx/0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436), Arc block `42834309`
- Private key was not printed.
- Script used isolated `.env.appkit.local` (git-ignored).
