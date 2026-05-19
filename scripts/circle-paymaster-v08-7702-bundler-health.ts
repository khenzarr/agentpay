export {};

const ENTRYPOINT_V08 = "0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108";
const EXPECTED_CHAIN_ID_DEC = 5042002;

type JsonRpcSuccess<T> = {
  jsonrpc: "2.0";
  id: number;
  result: T;
};

type JsonRpcError = {
  jsonrpc: "2.0";
  id: number;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

type JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcError;

type RpcOutcome<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string };

function readEnv(key: "ARC_BUNDLER_RPC_URL"): string {
  return process.env[key]?.trim() ?? "";
}

function isPresent(value: string): boolean {
  return value.length > 0;
}

async function rpcCall<T>(url: string, method: string, params: unknown[] = []): Promise<RpcOutcome<T>> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });

    if (!response.ok) {
      return { ok: false, reason: `http_${response.status}` };
    }

    const payload = (await response.json()) as JsonRpcResponse<T>;
    if ("error" in payload) {
      return { ok: false, reason: `rpc_${payload.error.code}:${payload.error.message}` };
    }

    return { ok: true, value: payload.result };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "unknown_error",
    };
  }
}

function hexChainIdToDec(value: string): number | null {
  try {
    if (!value.startsWith("0x")) return null;
    return Number.parseInt(value, 16);
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  console.log("[circle-paymaster-v08-7702-bundler-health] mode=SERVER_ONLY_READ_ONLY");
  console.log("signing=false");
  console.log("userOps=false");
  console.log("transactions=false");
  console.log("mutationMethodsCalled=none");

  const bundlerUrl = readEnv("ARC_BUNDLER_RPC_URL");
  const bundlerUrlPresent = isPresent(bundlerUrl);

  console.log(`bundlerUrlPresent=${bundlerUrlPresent ? "yes" : "no"}`);

  if (!bundlerUrlPresent) {
    console.log("healthVerdict=BLOCKED_NO_BUNDLER");
    console.log("BLOCKED_NO_BUNDLER");
    console.log("paymasterStatus=NOT_CLAIMED");
    console.log("gaslessStatus=NOT_CLAIMED");
    return;
  }

  const chainIdResult = await rpcCall<string>(bundlerUrl, "eth_chainId");
  const supportedEntryPointsResult = await rpcCall<string[]>(bundlerUrl, "eth_supportedEntryPoints");
  const clientVersionResult = await rpcCall<string>(bundlerUrl, "web3_clientVersion");

  let chainIdDec: number | null = null;
  if (chainIdResult.ok) {
    chainIdDec = hexChainIdToDec(chainIdResult.value);
    console.log(`chainId=${chainIdResult.value}${chainIdDec !== null ? ` (${chainIdDec})` : ""}`);
  } else {
    console.log(`chainId=unavailable (${chainIdResult.reason})`);
  }

  let supportedEntryPoints: string[] = [];
  if (supportedEntryPointsResult.ok) {
    supportedEntryPoints = supportedEntryPointsResult.value;
    console.log(
      `supportedEntryPoints=${supportedEntryPoints.length > 0 ? supportedEntryPoints.join(",") : "[]"}`,
    );
  } else {
    console.log(`supportedEntryPoints=unavailable (${supportedEntryPointsResult.reason})`);
  }

  if (clientVersionResult.ok) {
    console.log(`clientVersion=${clientVersionResult.value}`);
  } else {
    console.log(`clientVersion=unavailable (${clientVersionResult.reason})`);
  }

  const hasEntryPointV08 = supportedEntryPoints.some(
    (address) => address.toLowerCase() === ENTRYPOINT_V08.toLowerCase(),
  );
  console.log(`entryPointV08Expected=${ENTRYPOINT_V08}`);
  console.log(`entryPointV08Present=${hasEntryPointV08 ? "yes" : "no"}`);

  let healthVerdict = "UNHEALTHY_RPC_READ_FAILED";
  if (chainIdResult.ok && supportedEntryPointsResult.ok) {
    if (hasEntryPointV08) {
      healthVerdict =
        chainIdDec === EXPECTED_CHAIN_ID_DEC
          ? "HEALTHY_ENTRYPOINT_V08_PRESENT"
          : "HEALTHY_ENTRYPOINT_V08_PRESENT_CHAIN_MISMATCH";
    } else {
      healthVerdict = "UNHEALTHY_ENTRYPOINT_V08_MISSING";
    }
  }

  console.log(`healthVerdict=${healthVerdict}`);
  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");
}

void main();
