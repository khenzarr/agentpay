import { jsonError, jsonOk } from "@/lib/api-response";
import { getDerivedPayments } from "@/lib/server/agentpay-read";

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

function parsePositiveInt(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 0) return undefined;
  return parsed;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const providerParam = searchParams.get("provider");
    const clientParam = searchParams.get("client");
    const stateParam = searchParams.get("state");

    if (providerParam && !ADDRESS_REGEX.test(providerParam)) {
      return jsonError("INVALID_PROVIDER", "Invalid provider address filter.", 400);
    }
    if (clientParam && !ADDRESS_REGEX.test(clientParam)) {
      return jsonError("INVALID_CLIENT", "Invalid client address filter.", 400);
    }

    const limit = parsePositiveInt(limitParam);
    if (limitParam !== null && limit === undefined) {
      return jsonError("INVALID_LIMIT", "Invalid limit. Use a non-negative integer.", 400);
    }

    const state = parsePositiveInt(stateParam);
    if (stateParam !== null && state === undefined) {
      return jsonError("INVALID_STATE", "Invalid state. Use a non-negative integer.", 400);
    }

    const derived = await getDerivedPayments({
      limit,
      provider: providerParam?.toLowerCase() as `0x${string}` | undefined,
      client: clientParam?.toLowerCase() as `0x${string}` | undefined,
      state,
    });

    return jsonOk({
      payments: derived.payments,
      source: derived.source,
      note: "Derived from job lifecycle state; dedicated settlement event API is not claimed unless implemented.",
      readOnly: derived.readOnly,
      indexing: derived.indexing,
    });
  } catch {
    return jsonError(
      "PAYMENT_DERIVATION_ERROR",
      "Failed to derive payment activity from indexed job state.",
      502
    );
  }
}
