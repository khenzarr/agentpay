import { IntegrationBanner } from "@/components/agentpay/IntegrationBanner";
import { CreateJobForm } from "@/components/agentpay/CreateJobForm";

export default async function CreateJobPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create job</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Client wallet: create job on Arc&apos;s ERC-8183 reference contract.
          Then agent sets budget; client approves USDC and funds escrow.
        </p>
      </div>
      <IntegrationBanner />
      <CreateJobForm defaultAgentId={params.agent} />
    </div>
  );
}
