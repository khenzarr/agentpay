export interface DemoAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  /** Agent provider wallet — set via NEXT_PUBLIC_DEMO_AGENT_ADDRESS or replace */
  address: `0x${string}`;
  /** Optional ArcNS name for display / resolution */
  arcnsName?: string;
}

const demoAgentAddress =
  (process.env.NEXT_PUBLIC_DEMO_AGENT_ADDRESS as `0x${string}` | undefined) ??
  "0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC";

const demoAgentName =
  process.env.NEXT_PUBLIC_DEMO_AGENT_NAME?.trim() || "AgentPay Agent";

const demoAgentArcnsName =
  process.env.NEXT_PUBLIC_DEMO_AGENT_ARCNS_NAME?.trim() || "agentpayagent.circle";

export const demoAgents: DemoAgent[] = [
  {
    id: "research-bot",
    name: demoAgentName,
    role: "Document analysis",
    description:
      "Summarizes documents and returns an on-chain deliverable hash (IPFS or content hash).",
    address: demoAgentAddress,
    arcnsName: demoAgentArcnsName || undefined,
  },
  {
    id: "data-agent",
    name: "Data Agent",
    role: "Structured extraction",
    description:
      "Extracts structured data from inputs and commits results via deliverable hash.",
    address: demoAgentAddress,
    arcnsName: undefined,
  },
];
