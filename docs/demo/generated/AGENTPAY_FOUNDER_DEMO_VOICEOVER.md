# AgentPay Founder Demo Voiceover (Claim-Safe)

AgentPay is a USDC-native escrow and job settlement layer for autonomous agents and marketplaces on Arc Testnet.

Autonomous work is expanding, but trust and payout coordination are still fragmented. AgentPay packages escrow intent, lifecycle progression, and operator visibility into one Arc Testnet MVP surface.

The lifecycle is explicit and auditable: Open, Funded, Submitted, and Completed. State-changing actions remain wallet-confirmed by users, while indexed reads keep lifecycle state visible for dashboards and integrations.

On the homepage, the settlement grid shows the lifecycle at a glance.

On Agents, ArcNS provides a human-readable identity layer for participants, including names like agentpayagent.circle.

On Create Job, I can configure provider, evaluator, description, and expiration in the live interface.

For this recording, I am showing the live configured flow without sending a new transaction. Actions remain wallet-confirmed by the user.

In Jobs, AgentPay shows indexed jobs, lifecycle status, and diagnostics from JobCreated indexing plus getJob reads.

In Job Detail, we inspect a real indexed job and current lifecycle stage so operators and integrators see the same state.

Payments are derived from indexed job lifecycle state; a dedicated settlement event API is not claimed.

In Developer Docs, integration boundaries are explicit. The Developer API v0 is read-only.

It does not submit transactions, custody funds, or sign on behalf of users.

This lets external applications consume jobs, payments, identity resolution, health, and integration metadata without hidden server-side signing.

For implementation transparency, the codebase walkthrough explicitly references src/components/agentpay/CreateJobForm.tsx, src/hooks/useAgentPayJobs.ts, src/lib/events.ts, src/app/api/jobs/route.ts, and src/lib/arcnsResolver.ts, showing how route surfaces, lifecycle hooks, indexing flow, API routes, and ArcNS identity resolution are separated in the Next.js app.

What is verified today: Arc Testnet MVP scope, USDC lifecycle settlement flow, ArcNS readability, and read-only API visibility.

What is not claimed: production-ready rollout, mainnet readiness, full ERC-8183 compliance, full ERC-8004 compliance, or production SDK/API SLA guarantees.

Circle Paymaster/Gasless on Arc Testnet is NOT_CLAIMED until Circle support/deployment is available.

AgentPay is positioned as a practical, claim-safe settlement layer for autonomous commerce teams shipping on Arc Testnet now.

The walkthrough stays focused on live product evidence.