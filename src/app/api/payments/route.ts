import { jsonError, jsonOk } from "@/lib/api-response";
import { getDerivedPayments } from "@/lib/server/agentpay-read";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : undefined;
    const payments = await getDerivedPayments(Number.isFinite(limit) ? limit : undefined);

    return jsonOk({
      payments,
      source: "derived-from-indexed-job-state",
      note: "Derived from job lifecycle state; dedicated settlement event API is not claimed unless implemented.",
      readOnly: true,
    });
  } catch {
    return jsonError(
      "PAYMENT_DERIVATION_ERROR",
      "Failed to derive payment activity from indexed job state.",
      502
    );
  }
}
