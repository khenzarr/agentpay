# AgentPay Founder Demo Storyboard (Claim-Safe)

- **Target**: 4:30–4:50 (hard limit 5:00)
- **Format**: 16:9 (1920x1080)
- **Style**: Founder-level, clear, technically credible, claim-safe
- **Live App**: https://agentpay-dusky.vercel.app
- **Repo**: https://github.com/khenzarr/agentpay

## Scene Plan

1. **Opening / Identity** (15s) — `/`
   - Message: AgentPay identity and Arc Testnet MVP framing.

2. **Problem** (20s) — `/`
   - Message: Autonomous work requires escrow + lifecycle trust + readability.

3. **How AgentPay Works** (25s) — `/`
   - Message: Open → Funded → Submitted → Completed with wallet-confirmed actions.

4. **Agents + ArcNS** (25s) — `/agents`
   - Message: ArcNS is identity/readability layer, not escrow logic.

5. **Create Job Flow** (30s) — `/create-job`
   - Message: Show configured flow without sending a transaction.
   - Required line: “For this recording, I’m showing the live configured flow without sending a new transaction. Actions remain wallet-confirmed by the user.”

6. **Jobs Dashboard** (30s) — `/jobs`
   - Message: Indexed jobs and stats from `JobCreated` logs + `getJob` reads.

7. **Job Detail** (25s) — `/jobs/35698`
   - Message: Real indexed job detail and lifecycle state.

8. **Payments** (25s) — `/payments`
   - Message: Payment view is derived from lifecycle-indexed state.

9. **Developer Docs + API v0** (35s) — `/docs` + API proof screens
   - Show: `/api/health`, `/api/jobs?limit=1`, `/api/identity/resolve?name=agentpayagent.circle`

10. **Codebase Walkthrough** (40s) — repo/slide
   - Mention key files and architecture boundaries.

11. **Closing** (20s) — `/` or `/docs`
   - Message: verified scope + explicit NOT_CLAIMED boundaries.

## Claim-Safe Boundary Checklist

- Arc Testnet MVP ✅
- USDC-native escrow/job lifecycle ✅
- API v0 read-only ✅
- No API tx submission/custody/signing ✅
- Payments derived from indexed lifecycle state ✅
- Dedicated settlement event API not claimed ✅
- ArcNS identity/readability ✅
- Wallet-confirmed actions where tx needed ✅
- Paymaster/Gasless on Arc Testnet NOT_CLAIMED ✅
- Mainnet readiness NOT_CLAIMED ✅
- Full ERC-8183 compliance NOT_CLAIMED ✅
- Full ERC-8004 compliance NOT_CLAIMED ✅
- Production SDK/API SLA NOT_CLAIMED ✅
