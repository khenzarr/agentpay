import { ARC_TESTNET_EXPLORER_URL } from "@/lib/constants";

export function getArcscanAddressUrl(address: string): string {
  return `${ARC_TESTNET_EXPLORER_URL}/address/${address}`;
}

export function getArcscanTxUrl(hash: string): string {
  return `${ARC_TESTNET_EXPLORER_URL}/tx/${hash}`;
}

export function getArcscanTokenUrl(address: string): string {
  return `${ARC_TESTNET_EXPLORER_URL}/token/${address}`;
}
