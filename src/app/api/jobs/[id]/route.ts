import { jsonError, jsonOk } from "@/lib/api-response";
import { getJobById } from "@/lib/server/agentpay-read";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  let jobId: bigint;
  try {
    jobId = BigInt(id);
  } catch {
    return jsonError("INVALID_JOB_ID", "Invalid job id. Use a numeric id.", 400);
  }

  try {
    const job = await getJobById(jobId);
    if (!job) {
      return jsonError("JOB_NOT_FOUND", "Job not found.", 404);
    }

    return jsonOk({
      job,
      source: "getJob",
      readOnly: true,
    });
  } catch {
    return jsonError("JOB_READ_ERROR", "Failed to read job from contract.", 502);
  }
}
