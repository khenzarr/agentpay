import { jsonError, jsonOk } from "@/lib/api-response";
import { resolveArcNSName } from "@/lib/arcnsResolver";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name) {
    return jsonError("MISSING_NAME", "Query parameter 'name' is required.", 400);
  }

  const result = await resolveArcNSName(name);

  if (result.state === "resolved" && result.address) {
    return jsonOk({
      name,
      address: result.address,
      source: "ArcNS resolver",
      readOnly: true,
    });
  }

  if (result.state === "unsupported_tld") {
    return jsonError("UNSUPPORTED_TLD", "Unsupported identity TLD.", 400, { name });
  }

  if (result.state === "invalid") {
    return jsonError("INVALID_NAME", "Invalid ArcNS name.", 400, { name });
  }

  return jsonError("IDENTITY_NOT_FOUND", "Identity not found.", 404, { name });
}
