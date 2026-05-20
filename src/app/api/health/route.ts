import pkg from "../../../../package.json";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  return jsonOk({
    version: pkg.version,
    timestamp: new Date().toISOString(),
    readOnly: true,
  });
}
