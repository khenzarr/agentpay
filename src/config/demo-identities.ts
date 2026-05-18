import type { Address } from "viem";

export interface DemoIdentity {
  address: Address;
  primaryName: string;
}

export const DEMO_CLIENT_IDENTITY: DemoIdentity = {
  address:
    (process.env.NEXT_PUBLIC_DEMO_CLIENT_ADDRESS as Address | undefined) ??
    "0xCdc3735BCC1DE14c48704859715F835d0A5a7168",
  primaryName:
    process.env.NEXT_PUBLIC_DEMO_CLIENT_ARCNS_NAME?.trim() || "agentpayclient.arc",
};

export const DEMO_AGENT_IDENTITY: DemoIdentity = {
  address:
    (process.env.NEXT_PUBLIC_DEMO_AGENT_ADDRESS as Address | undefined) ??
    "0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC",
  primaryName:
    process.env.NEXT_PUBLIC_DEMO_AGENT_ARCNS_NAME?.trim() || "agentpayagent.circle",
};

export function getKnownArcnsPrimaryName(address?: string): string | undefined {
  if (!address) return undefined;
  const lower = address.toLowerCase();
  if (lower === DEMO_CLIENT_IDENTITY.address.toLowerCase()) {
    return DEMO_CLIENT_IDENTITY.primaryName;
  }
  if (lower === DEMO_AGENT_IDENTITY.address.toLowerCase()) {
    return DEMO_AGENT_IDENTITY.primaryName;
  }
  return undefined;
}
