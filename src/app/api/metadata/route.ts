import {
  ARC_TESTNET_EXPLORER_URL,
  ARC_TESTNET_RPC_URL,
  ARC_TESTNET_USDC_ADDRESS,
  ERC8183_AGENTIC_COMMERCE_ADDRESS,
} from "@/lib/constants";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  return jsonOk({
    app: {
      name: "AgentPay",
      description:
        "USDC escrow and job settlement infrastructure for autonomous agents, marketplaces, and external apps on Arc Testnet.",
      status: "Arc Testnet MVP",
    },
    chain: {
      name: "Arc Testnet",
      chainId: 5042002,
      rpcUrl: ARC_TESTNET_RPC_URL,
      explorer: ARC_TESTNET_EXPLORER_URL,
      nativeCurrency: "USDC",
    },
    usdcAddress: ARC_TESTNET_USDC_ADDRESS,
    erc8183ReferenceContract: ERC8183_AGENTIC_COMMERCE_ADDRESS,
    publicRoutes: ["/agents", "/create-job", "/jobs", "/jobs/[id]", "/payments", "/docs"],
    integrationSurfaces: [
      "web routes",
      "contract calls",
      "event/indexing reads",
      "ArcNS identity",
      "read-only API v0",
    ],
    limitations: [
      "No production SDK claimed",
      "No stable transaction intent API yet",
      "Mainnet readiness NOT_CLAIMED",
      "Paymaster/Gasless on Arc Testnet NOT_CLAIMED",
    ],
    readOnly: true,
  });
}
