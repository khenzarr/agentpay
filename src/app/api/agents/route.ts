import { demoAgents } from "@/config/demo-agents";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  return jsonOk({
    agents: demoAgents.map((a) => ({
      id: a.id,
      name: a.name,
      role: a.role,
      description: a.description,
      address: a.address,
      arcnsName: a.arcnsName,
      demo: true,
    })),
    source: "static-demo-catalog",
    note: "MVP demo catalog; production agent registry is not claimed.",
    readOnly: true,
  });
}
