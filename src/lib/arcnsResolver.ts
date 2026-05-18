/**
 * Optional ArcNS resolution — ported from FlowPay.
 * https://arcns-app.vercel.app/api/v1/resolve/name/{name}
 */

const ARCNS_ADAPTER_BASE = "https://arcns-app.vercel.app/api/v1";
const RESOLUTION_TIMEOUT_MS = 10_000;

export type ResolutionState =
  | "idle"
  | "resolving"
  | "resolved"
  | "zero_address"
  | "not_found"
  | "invalid"
  | "unsupported_tld"
  | "adapter_unavailable";

export interface ArcNSResolutionResult {
  state: ResolutionState;
  address?: string;
}

export const SUPPORTED_TLDS: string[] = [".arc", ".circle"];

export function isArcNSName(input: string): boolean {
  if (!input) return false;
  const lower = input.toLowerCase();
  return SUPPORTED_TLDS.some((tld) => {
    if (!lower.endsWith(tld)) return false;
    const label = input.slice(0, input.length - tld.length);
    return label.length > 0;
  });
}

interface AdapterResponse {
  status: "ok" | "resolved" | "not_found" | "invalid" | "unsupported_tld";
  address?: string;
}

export async function resolveArcNSName(
  name: string,
  signal?: AbortSignal
): Promise<ArcNSResolutionResult> {
  if (!isArcNSName(name)) {
    const lower = name.toLowerCase();
    const hasDot = lower.lastIndexOf(".") > 0;
    if (hasDot) return { state: "unsupported_tld" };
    return { state: "invalid" };
  }

  const timeoutSignal = AbortSignal.timeout(RESOLUTION_TIMEOUT_MS);
  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  try {
    const url = `${ARCNS_ADAPTER_BASE}/resolve/name/${encodeURIComponent(name)}`;
    const response = await fetch(url, { signal: combinedSignal });

    if (!response.ok) return { state: "adapter_unavailable" };

    let data: AdapterResponse;
    try {
      data = await response.json();
    } catch {
      return { state: "adapter_unavailable" };
    }

    switch (data.status) {
      case "ok":
      case "resolved": {
        const addr = data.address ?? "";
        if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) return { state: "not_found" };
        if (addr === "0x0000000000000000000000000000000000000000") {
          return { state: "zero_address" };
        }
        return { state: "resolved", address: addr };
      }
      case "not_found":
        return { state: "not_found" };
      case "invalid":
        return { state: "invalid" };
      case "unsupported_tld":
        return { state: "unsupported_tld" };
      default:
        return { state: "adapter_unavailable" };
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      if (timeoutSignal.aborted) return { state: "adapter_unavailable" };
      throw err;
    }
    return { state: "adapter_unavailable" };
  }
}
