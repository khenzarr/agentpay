# Integration Completion Matrix — AgentPay (Master Prompt #6)

**Date:** 2026-05-17  
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
| Bridge / CCTP | **NOT_CLAIMED** | No bridge/CCTP integration flow implemented in AgentPay MVP | Do not claim |
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

Everything else above remains **NOT_CLAIMED** until implemented and re-verified.
