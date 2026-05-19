import { createPublicClient, defineChain, http } from "viem";

export {};

const ARC_CHAIN_ID = 5042002;
const ARC_RPC_URL = "https://rpc.testnet.arc.network";

const TARGETS = [
  {
    label: "entryPointV08",
    address: "0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108",
  },
  {
    label: "entryPointV07",
    address: "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
  },
  {
    label: "paymasterV08",
    address: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
  },
  {
    label: "paymasterV07",
    address: "0x31BE08D380A21fc740883c0BC434FcFc88740b58",
  },
] as const;

async function main(): Promise<void> {
  console.log("[circle-paymaster-deployment-readonly-check] mode=READ_ONLY");
  console.log("rpcUrl=https://rpc.testnet.arc.network");

  const arcTestnet = defineChain({
    id: ARC_CHAIN_ID,
    name: "Arc Testnet",
    nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
    rpcUrls: {
      default: { http: [ARC_RPC_URL] },
      public: { http: [ARC_RPC_URL] },
    },
    testnet: true,
  });

  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(ARC_RPC_URL),
  });

  const [chainId, blockNumber] = await Promise.all([
    publicClient.getChainId(),
    publicClient.getBlockNumber(),
  ]);

  console.log(`chainId=${chainId}`);
  console.log(`blockNumber=${blockNumber.toString()}`);

  const checks = await Promise.all(
    TARGETS.map(async (target) => {
      const code = await publicClient.getCode({
        address: target.address as `0x${string}`,
      });

      const codeLength = code ? code.length : 0;
      const codePresent = codeLength > 2;

      return {
        ...target,
        codePresent,
        codeLength,
      };
    }),
  );

  for (const result of checks) {
    console.log(
      `label=${result.label} address=${result.address} codePresent=${result.codePresent ? "yes" : "no"} codeLength=${result.codeLength}`,
    );
  }

  const paymasterV08CodePresent = checks.find((x) => x.label === "paymasterV08")?.codePresent === true;
  const paymasterV07CodePresent = checks.find((x) => x.label === "paymasterV07")?.codePresent === true;
  const entryPointV08CodePresent = checks.find((x) => x.label === "entryPointV08")?.codePresent === true;
  const entryPointV07CodePresent = checks.find((x) => x.label === "entryPointV07")?.codePresent === true;

  console.log(`paymasterV08CodePresent=${paymasterV08CodePresent ? "yes" : "no"}`);
  console.log(`paymasterV07CodePresent=${paymasterV07CodePresent ? "yes" : "no"}`);
  console.log(`entryPointV08CodePresent=${entryPointV08CodePresent ? "yes" : "no"}`);
  console.log(`entryPointV07CodePresent=${entryPointV07CodePresent ? "yes" : "no"}`);

  if (!paymasterV08CodePresent) {
    console.log("DIAGNOSTIC_PAYMASTER_V08_NOT_DEPLOYED");
  }
  if (paymasterV07CodePresent) {
    console.log("FALLBACK_V07_POSSIBLE");
  }
  if (entryPointV08CodePresent && !paymasterV08CodePresent) {
    console.log("ENTRYPOINT_OK_PAYMASTER_MISSING");
  }

  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");
}

main().catch((error) => {
  console.error("[circle-paymaster-deployment-readonly-check] FAILED");
  console.error(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
  process.exitCode = 1;
});
