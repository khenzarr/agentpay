import { IntegrationBanner } from "@/components/agentpay/IntegrationBanner";
import { JobDetailPanel } from "@/components/agentpay/JobDetailPanel";
import Link from "next/link";
import { AgentPayShell } from "@/components/ui/agentpay/AgentPayShell";
import { AgentPayCard } from "@/components/ui/agentpay/AgentPayCard";
import { AgentPayBadge } from "@/components/ui/agentpay/AgentPayBadge";
import { AgentPayButton } from "@/components/ui/agentpay/AgentPayButton";
import { AgentPaySectionHeader } from "@/components/ui/agentpay/AgentPaySectionHeader";
import { AgentPayStatusPill } from "@/components/ui/agentpay/AgentPayStatusPill";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let jobId: bigint;
  try {
    jobId = BigInt(id);
  } catch {
    return (
      <AgentPayShell>
        <AgentPayCard variant="muted" className="space-y-2 border-red-400/30 text-red-200">
          <AgentPaySectionHeader
            eyebrow="Invalid Route Parameter"
            title="Invalid job ID"
            description="Use a numeric id in the URL path, for example /jobs/1."
          />
          <div className="flex flex-wrap gap-2">
            <Link href="/jobs">
              <AgentPayButton>Back to jobs</AgentPayButton>
            </Link>
            <Link href="/docs">
              <AgentPayButton variant="secondary">Read docs</AgentPayButton>
            </Link>
          </div>
        </AgentPayCard>
      </AgentPayShell>
    );
  }

  return (
    <AgentPayShell className="space-y-6 pb-2 md:space-y-8">
      <AgentPayCard variant="elevated" glow className="space-y-5">
        <AgentPaySectionHeader
          eyebrow={`Job #${jobId.toString()}`}
          title={`Job #${jobId.toString()}`}
          description="On-chain job state and lifecycle controls for an Arc Testnet agent workflow."
        />
        <div className="flex flex-wrap gap-2">
          <AgentPayBadge variant="arc">Arc Testnet</AgentPayBadge>
          <AgentPayBadge variant="readonly">Job detail</AgentPayBadge>
          <AgentPayBadge variant="neutral">Read/write wallet actions where applicable</AgentPayBadge>
          <AgentPayBadge variant="neutral">Wallet confirmation required for actions</AgentPayBadge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/jobs">
            <AgentPayButton variant="secondary">Back to jobs</AgentPayButton>
          </Link>
          <Link href="/create-job">
            <AgentPayButton>Create job</AgentPayButton>
          </Link>
        </div>
      </AgentPayCard>

      <AgentPayCard variant="muted">
        <IntegrationBanner />
      </AgentPayCard>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <AgentPayCard className="overflow-hidden">
          <AgentPaySectionHeader
            eyebrow="Operational Panel"
            title="Lifecycle controls and on-chain detail"
            description="Real-time read surface and existing action handlers from the verified JobDetailPanel flow."
            className="mb-4"
          />
          <JobDetailPanel jobId={jobId} />
        </AgentPayCard>

        <div className="space-y-4">
          <AgentPayCard className="space-y-3">
            <AgentPaySectionHeader
              eyebrow="Lifecycle Legend"
              title="MVP job states"
              description="Status mapping is derived from existing contract/job state logic."
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
              eyebrow="Action Safety"
              title="Wallet-controlled execution"
              description="Boundary notes for all write actions surfaced by JobDetailPanel."
            />
            <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-400">
              <li>Wallet confirmation is required for each available action.</li>
              <li>No server-side signing and no custody for user approvals/funds.</li>
              <li>User wallet controls final transaction approval and submission.</li>
              <li>Actions may require the correct participant role for the current state.</li>
            </ul>
          </AgentPayCard>

          <AgentPayCard variant="muted" className="space-y-3">
            <AgentPaySectionHeader
              eyebrow="Indexing / RPC Boundary"
              title="Read surface caveats"
            />
            <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-400">
              <li>Job detail is sourced from on-chain reads and indexed context.</li>
              <li>RPC and indexing windows may lag the latest chain block.</li>
              <li>This UI is Arc Testnet MVP and does not claim protocol-wide finality.</li>
            </ul>
          </AgentPayCard>
        </div>
      </div>
    </AgentPayShell>
  );
}
