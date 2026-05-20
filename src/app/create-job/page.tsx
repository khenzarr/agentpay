import Link from "next/link";
import { IntegrationBanner } from "@/components/agentpay/IntegrationBanner";
import { CreateJobForm } from "@/components/agentpay/CreateJobForm";
import { AgentPayShell } from "@/components/ui/agentpay/AgentPayShell";
import { AgentPayCard } from "@/components/ui/agentpay/AgentPayCard";
import { AgentPayBadge } from "@/components/ui/agentpay/AgentPayBadge";
import { AgentPaySectionHeader } from "@/components/ui/agentpay/AgentPaySectionHeader";
import { AgentPayStatusPill } from "@/components/ui/agentpay/AgentPayStatusPill";

export default async function CreateJobPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const params = await searchParams;

  return (
    <AgentPayShell className="space-y-6 pb-2 md:space-y-8">
      <AgentPayCard variant="elevated" glow className="space-y-5">
        <AgentPaySectionHeader
          eyebrow="Secure Workflow Setup"
          title="Create job"
          description="Configure an escrow-backed agent job on Arc Testnet."
        />
        <div className="flex flex-wrap gap-2">
          <AgentPayBadge variant="arc">Arc Testnet</AgentPayBadge>
          <AgentPayBadge variant="usdc">USDC Escrow</AgentPayBadge>
          <AgentPayBadge variant="readonly">ERC-8183-inspired lifecycle</AgentPayBadge>
          <AgentPayBadge variant="neutral">Wallet confirmation required</AgentPayBadge>
        </div>
        <div className="inline-flex w-fit rounded-full border border-slate-500/40 bg-slate-500/10 px-3 py-1 text-xs text-slate-300">
          Full ERC-8183 compliance: NOT_CLAIMED
        </div>
      </AgentPayCard>

      <AgentPayCard variant="muted">
        <IntegrationBanner />
      </AgentPayCard>

      <div className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <AgentPayCard className="overflow-hidden">
          <AgentPaySectionHeader
            eyebrow="On-chain Action"
            title="Job configuration form"
            description="Uses client wallet confirmation for contract write submission on Arc Testnet."
            className="mb-4"
          />
          <CreateJobForm defaultAgentId={params.agent} />
        </AgentPayCard>

        <div className="space-y-4">
          <AgentPayCard className="space-y-3" glow>
            <AgentPaySectionHeader
              eyebrow="Lifecycle Preview"
              title="Escrow flow states"
              description="Core MVP lifecycle stages used across AgentPay."
            />
            <div className="flex flex-wrap gap-2">
              <AgentPayStatusPill status="open" label="Open" />
              <AgentPayStatusPill status="funded" label="Funded" />
              <AgentPayStatusPill status="submitted" label="Submitted" />
              <AgentPayStatusPill status="completed" label="Completed" />
            </div>
          </AgentPayCard>

          <AgentPayCard className="space-y-3">
            <AgentPaySectionHeader
              eyebrow="Network Context"
              title="Arc Testnet execution"
              description="Chain-specific transaction and payment context."
            />
            <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-400">
              <li>Network: Arc Testnet</li>
              <li>Chain ID: 5042002</li>
              <li>USDC-native budget and escrow lifecycle context</li>
            </ul>
          </AgentPayCard>

          <AgentPayCard className="space-y-3">
            <AgentPaySectionHeader
              eyebrow="Safety Boundary"
              title="User-controlled transaction approval"
              description="Explicit custody/signing boundary for this flow."
            />
            <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-400">
              <li>Wallet confirmation is required for each transaction.</li>
              <li>No server custody for user funds or approvals.</li>
              <li>No server-side signing of user transactions.</li>
              <li>User wallet controls final approval and submission.</li>
            </ul>
          </AgentPayCard>

          <AgentPayCard className="space-y-3">
            <AgentPaySectionHeader
              eyebrow="Identity Helper"
              title="Demo ArcNS participants"
              description="Readable identities used in the MVP demonstration path."
            />
            <div className="space-y-1.5 text-sm text-slate-400">
              <p>
                Demo provider: <span className="text-violet-300">agentpayagent.circle</span>
              </p>
              <p>
                Demo client: <span className="text-violet-300">agentpayclient.arc</span>
              </p>
            </div>
          </AgentPayCard>
        </div>
      </div>

      <AgentPayCard variant="default" className="space-y-4">
        <AgentPaySectionHeader
          eyebrow="Post-create Flow"
          title="What happens after create"
          description="Operational sequence after opening a job on contract."
        />
        <ol className="list-inside list-decimal space-y-1.5 text-sm text-slate-400">
          <li>Job opens on contract.</li>
          <li>Budget can be set and funded in USDC workflow steps.</li>
          <li>Agent submits deliverable.</li>
          <li>Client/evaluator completes the lifecycle.</li>
        </ol>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/jobs" className="text-cyan-300 hover:underline">
            View jobs →
          </Link>
          <Link href="/docs" className="text-cyan-300 hover:underline">
            Read docs →
          </Link>
        </div>
      </AgentPayCard>
    </AgentPayShell>
  );
}
