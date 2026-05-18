# Integration Completion Matrix — AgentPay (Master Prompt #8)

**Date:** 2026-05-18  
**Scope:** Strictly verified in-repo integration status for product/demo claims.

## Status Legend

- **VERIFIED**: Implemented and demonstrably present in this repo/runtime flow.
- **NOT_CLAIMED**: Not implemented/verified; must not be claimed in product/demo scope.
- **BLOCKED**: Technically blocked from operation due to missing required dependency/config/runtime proof.

## Current Matrix

| Integration Area | Status | Evidence in repo | Claim policy |
|---|---|---|---|
| Arc Testnet execution (chain 5042002) | **VERIFIED** | `src/app/page.tsx`, wallet/network guards and runtime demo flow docs | Claim allowed |
| USDC escrow lifecycle on Arc Testnet | **VERIFIED** | Create/fund/submit/complete flow in UI + docs dry-run notes | Claim allowed |
| ERC-8183 tutorial ABI contract integration | **VERIFIED** | `src/lib/erc8183`, integration banner, lifecycle actions | Claim allowed as tutorial-subset only |
| Real Arc Testnet lifecycle completion | **VERIFIED** | `docs/grant/agentpay/IMPLEMENTATION_STATUS.md` dry-run section (Job #21683) | Claim allowed |
| ArcNS identity display/resolution | **VERIFIED (OPTIONAL/NON-BLOCKING)** | `AddressIdentity.tsx`, `ArcnsResolutionBadge.tsx`, resolver hooks/config | Claim allowed only as optional/non-blocking |
| App Kit Send | **CURRENT_VERIFIED** | Live send verified via `npm run appkit:send:arc:usdc` with `APPKIT_DRY_RUN=false` on Arc Testnet (`Arc_Testnet`), token `USDC`, amount `0.01`; tx `0x88866008ae2a9c71d9b868d33dae5df88995b57e06c8dfb22074f6406eef6fbb`; isolated `.env.appkit.local`; private key not printed | Claim allowed |
| Bridge / CCTP | **CURRENT_VERIFIED** | Live verification executed via `npm run appkit:bridge:usdc:arc` with `APPKIT_BRIDGE_DRY_RUN=false` using `CCTPV2BridgingProvider`; route `Ethereum_Sepolia -> Arc_Testnet`; token `USDC`; amount `0.01`; result state `success`; transfer speed `FAST`; approve/burn/mint tx proofs recorded; isolated `.env.appkit.local`; private key not printed | Claim allowed |
| Gateway / Unified Balance | **NOT_CLAIMED** | No Gateway/Unified Balance integration in repo/runtime | Do not claim |
| Circle Wallets (Developer-Controlled) | **NOT_CLAIMED** | MVP flow uses user wallets; no verified Circle Wallets integration path | Do not claim |
| Paymaster / gas sponsorship | **NOT_CLAIMED** | No paymaster runtime integration | Do not claim |
| Full ERC-8183 compliance | **NOT_CLAIMED** | Tutorial-subset integration only | Do not claim |
| Full ERC-8004 compliance | **NOT_CLAIMED** | No full ERC-8004 implementation/compliance proof in MVP | Do not claim |

## Product-safe claim boundary

Only the following are currently claimable:

1. USDC escrow on Arc Testnet
2. ERC-8183 tutorial ABI integration (subset)
3. Real Arc Testnet lifecycle completed
4. Optional ArcNS identity display/resolution support (non-blocking)
5. App Kit Send on Arc Testnet
6. App Kit Bridge/CCTP on Arc Testnet

Everything else above remains **NOT_CLAIMED** until implemented and re-verified.

Bridge/CCTP implementation status for this sprint: **CURRENT_VERIFIED**.

Live verification evidence recorded:

1. Command: `npm run appkit:bridge:usdc:arc`
2. Env mode: `APPKIT_BRIDGE_DRY_RUN=false`
3. Provider: `CCTPV2BridgingProvider`
4. Source chain: `Ethereum_Sepolia`
5. Destination chain: `Arc_Testnet`
6. Source address: `0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC`
7. Recipient address: `0xCdc3735BCC1DE14c48704859715F835d0A5a7168`
8. Token: `USDC`
9. Amount: `0.01`
10. Estimate was shown before live execution.
11. Bridge result state: `success`
12. Transfer speed: `FAST`
13. approve tx: `0xf13ff448e95e9503ac1b621f6cb967bb18538e5ce21330288a8756ffcb5da9dd`
14. burn tx: `0x561c32dc76a3a4e927cd05e1a12c8048637b9342f487f98faa7db002fd14dde9`
15. fetchAttestation: state `success`, cctpVersion `2`, status `complete`, sourceDomain `0`, destinationDomain `26`
16. mint tx: `0x6edee61d50e090c9047ec7ee606253be91fd90dcd48849f943ba216e13d87436` (Arc block `42834309`)
17. Private key was not printed.
18. Script used isolated `.env.appkit.local` (git-ignored).
