export const CIRCLE_PAYMASTER_V07_SUPPORTED_CHAINS = [
  "Arbitrum",
  "Base",
] as const;

export const CIRCLE_PAYMASTER_V08_SUPPORTED_CHAINS = [
  "Arbitrum",
  "Avalanche",
  "Base",
  "Ethereum",
  "Optimism",
  "Polygon",
  "Unichain",
] as const;

export const ARC_TESTNET_CHAIN_ID = 5042002;

export type CirclePaymasterSupportStatusCode =
  | "AVAILABLE_ON_SUPPORTED_CIRCLE_PAYMASTER_CHAINS"
  | "UNSUPPORTED_ON_ARC_TESTNET"
  | "CLIENT_SIDE_READINESS_COMPLETE"
  | "NOT_CLAIMED_ON_ARC_TESTNET";

export interface CirclePaymasterSupportStatus {
  supported: boolean;
  label: string;
  status: CirclePaymasterSupportStatusCode;
  detail: string;
}

export function getCirclePaymasterSupportStatus(
  chainId: number,
): CirclePaymasterSupportStatus {
  if (chainId === ARC_TESTNET_CHAIN_ID) {
    return {
      supported: false,
      label: "Unsupported on Arc Testnet",
      status: "UNSUPPORTED_ON_ARC_TESTNET",
      detail:
        "Circle Paymaster is not currently listed as supported on Arc Testnet. Client-side readiness is complete, but live proof is blocked by missing Paymaster deployment.",
    };
  }

  return {
    supported: true,
    label: "Available on supported Circle Paymaster chains",
    status: "AVAILABLE_ON_SUPPORTED_CIRCLE_PAYMASTER_CHAINS",
    detail:
      "Circle Paymaster / Gasless is available on Circle Paymaster-supported networks. Arc Testnet remains unsupported until official support/deployment is available.",
  };
}