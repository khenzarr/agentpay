import { jsonError, jsonOk } from "@/lib/api-response";
import { getIndexedJobs } from "@/lib/server/agentpay-read";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const provider = searchParams.get("provider")?.toLowerCase();
    const client = searchParams.get("client")?.toLowerCase();
    const stateParam = searchParams.get("state");
    const limit = limitParam ? Number(limitParam) : undefined;
    const state = stateParam !== null ? Number(stateParam) : undefined;

    const jobs = await getIndexedJobs(Number.isFinite(limit) ? limit : undefined);
    const filtered = jobs.filter((job) => {
      if (provider && job.provider.toLowerCase() !== provider) return false;
      if (client && job.client.toLowerCase() !== client) return false;
      if (state !== undefined && Number.isFinite(state) && job.status !== state) return false;
      return true;
    });

    return jsonOk({
      jobs: filtered,
      count: filtered.length,
      source: "arc-testnet-rpc",
      readOnly: true,
    });
  } catch {
    return jsonError("RPC_INDEXING_ERROR", "Failed to read indexed jobs from Arc Testnet RPC.", 502);
  }
}
