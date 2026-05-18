import { IntegrationBanner } from "@/components/agentpay/IntegrationBanner";
import { JobDetailPanel } from "@/components/agentpay/JobDetailPanel";

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
      <p className="text-red-400">Invalid job ID. Use a numeric id, e.g. /jobs/1</p>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Job detail</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Two-wallet demo: client funds and completes; agent submits deliverable.
        </p>
      </header>
      <IntegrationBanner />
      <JobDetailPanel jobId={jobId} />
    </div>
  );
}
