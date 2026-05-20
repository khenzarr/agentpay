# AgentPay Codebase Walkthrough

## Suggested walkthrough order

1. `README.md`
2. `src/app/page.tsx`
3. `src/app/create-job/page.tsx`
4. `src/components/agentpay/CreateJobForm.tsx`
5. `src/hooks/useCreateJob.ts`
6. `src/hooks/useFundJob.ts`
7. `src/hooks/useSubmitDeliverable.ts`
8. `src/hooks/useCompleteJob.ts`
9. `src/app/jobs/page.tsx`
10. `src/hooks/useAgentPayJobs.ts`
11. `src/lib/events.ts`
12. `src/lib/erc8183.ts`
13. `src/app/api/*`
14. `src/lib/server/agentpay-read.ts`
15. `src/lib/arcnsResolver.ts`
16. `src/lib/circle-paymaster-support.ts`
17. `src/components/ui/agentpay/*`

## Talking point for each file

- `README.md`: show the live demo links, scope, and claim-safe boundaries first.
- `src/app/page.tsx`: explain the homepage as the product entry point and live proof surface.
- `src/app/create-job/page.tsx`: show the configured job creation flow and where the user starts lifecycle creation.
- `src/components/agentpay/CreateJobForm.tsx`: point out the structured form for job parameters and wallet-aware input handling.
- `src/hooks/useCreateJob.ts`: describe how the create flow is orchestrated without implying server custody.
- `src/hooks/useFundJob.ts`: explain funding state handling and wallet-confirmed action boundaries.
- `src/hooks/useSubmitDeliverable.ts`: show how deliverable submission is modeled as a lifecycle step.
- `src/hooks/useCompleteJob.ts`: explain completion handling and how finalization is separated from display.
- `src/app/jobs/page.tsx`: show indexed jobs, stats, and filtering.
- `src/hooks/useAgentPayJobs.ts`: explain the read/index aggregation used for job lists.
- `src/lib/events.ts`: show `JobCreated` parsing and event-to-view model conversion.
- `src/lib/erc8183.ts`: explain the ERC-8183-inspired tutorial/reference subset framing.
- `src/app/api/*`: show the read-only API v0 surface and route boundaries.
- `src/lib/server/agentpay-read.ts`: show server-side read helpers for direct reads and indexing fallback.
- `src/lib/arcnsResolver.ts`: explain identity resolution for `.arc` and `.circle` names.
- `src/lib/circle-paymaster-support.ts`: show the chain-aware support model and unsupported Arc Testnet boundary.
- `src/components/ui/agentpay/*`: show the shared design primitives used across the UI.

## What not to open

- `.env.local`
- `.env.circle.local`
- `.env.appkit.local`
- private keys
- local wallet files
- any secret-bearing terminal output

## Codebase proof points

- Live routes are present and publicly demoable.
- Developer API v0 is read-only.
- Job lifecycle hooks are isolated and testable.
- Jobs are indexed and rendered from lifecycle data.
- ArcNS identity resolution is available for readability.
- Circle Paymaster/Gasless on Arc Testnet remains unsupported and not claimed.
