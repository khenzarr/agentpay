import { formatUnits, parseUnits } from "viem";
import { USDC_DECIMALS } from "@/lib/constants";

/** Parse human USDC amount (6 decimals) to base units */
export function parseUsdcAmount(amount: string): bigint {
  const trimmed = amount.trim();
  if (!trimmed || Number.isNaN(Number(trimmed))) {
    throw new Error("Invalid USDC amount");
  }
  return parseUnits(trimmed, USDC_DECIMALS);
}

/** Format USDC base units (6 decimals) for display */
export function formatUsdcAmount(
  amount: bigint,
  maximumFractionDigits = 6
): string {
  const formatted = formatUnits(amount, USDC_DECIMALS);
  const num = Number(formatted);
  if (Number.isNaN(num)) return formatted;
  return num.toLocaleString(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  });
}
