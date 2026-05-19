import { defineChain } from "viem";
import {
  createBundlerClient,
  createPaymasterClient,
  entryPoint07Address,
  entryPoint08Address,
  sendUserOperation,
  toSimple7702SmartAccount,
  waitForUserOperationReceipt,
} from "viem/account-abstraction";

type ArchitectureStep =
  | "owner account"
  | "public client"
  | "bundler client"
  | "paymaster data builder"
  | "toSimple7702SmartAccount"
  | "sendUserOperation"
  | "waitForUserOperationReceipt";

const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
    public: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
});

function printHeader(): void {
  console.log("[circle-paymaster-v08-7702-account-dry-run] mode=NON_MUTATING_DRY_RUN");
  console.log("networkCalls=false");
  console.log("signing=false");
  console.log("walletCreation=false");
  console.log("sendUserOperation=false");
  console.log("bundlerSubmission=false");
  console.log("tokenTransfer=false");
}

function printChain(): void {
  console.log("\n[arc_testnet_chain]");
  console.log(`chainId=${arcTestnet.id}`);
  console.log(`name=${arcTestnet.name}`);
  console.log(`rpc=${arcTestnet.rpcUrls.default.http[0]}`);
  console.log(`explorer=${arcTestnet.blockExplorers?.default.url ?? "unknown"}`);
  console.log(`nativeCurrency=${arcTestnet.nativeCurrency.symbol}`);
}

function printImports(): void {
  const importChecks = {
    toSimple7702SmartAccount: typeof toSimple7702SmartAccount === "function",
    createBundlerClient: typeof createBundlerClient === "function",
    createPaymasterClient: typeof createPaymasterClient === "function",
    sendUserOperation: typeof sendUserOperation === "function",
    waitForUserOperationReceipt: typeof waitForUserOperationReceipt === "function",
    entryPoint07Address: typeof entryPoint07Address === "string",
    entryPoint08Address: typeof entryPoint08Address === "string",
  };

  console.log("\n[import_availability]");
  for (const [key, available] of Object.entries(importChecks)) {
    console.log(`${key}=${available ? "available" : "missing"}`);
  }

  console.log("\n[import_paths]");
  console.log("toSimple7702SmartAccount=viem/account-abstraction");
  console.log("entryPoint07Address=viem/account-abstraction");
  console.log("entryPoint08Address=viem/account-abstraction");
  console.log("defineChain=viem");
}

function printConstructionRequirements(): void {
  console.log("\n[construction_requirements_toSimple7702SmartAccount]");
  console.log("required.client=true");
  console.log("required.ownerPrivateKeyAccount=true");
  console.log("optional.entryPoint=true");
  console.log("optional.implementation=true");
  console.log("optional.getNonce=true");
  console.log("ownerRequirement=PrivateKeyAccount");
  console.log("canConstructWithoutOwnerSigner=false");
  console.log("constructionInvokedInThisDryRun=false");
}

function printFutureArchitecture(): void {
  const steps: ArchitectureStep[] = [
    "owner account",
    "public client",
    "bundler client",
    "paymaster data builder",
    "toSimple7702SmartAccount",
    "sendUserOperation",
    "waitForUserOperationReceipt",
  ];

  console.log("\n[intended_future_architecture]");
  for (const step of steps) {
    console.log(`- ${step}`);
  }
}

function printBlockers(): void {
  console.log("\n[current_blockers]");
  console.log("- no owner signer configured");
  console.log("- no bundler URL");
  console.log("- no EntryPoint address/version selection for runtime wiring");
  console.log("- no live proof");
}

function printStatus(): void {
  console.log("\n[known_circle_paymaster]");
  console.log("paymasterV08Address=0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966");
  console.log("entryPoint07Address=0x0000000071727De22E5E9d8BAf0edAc6f37da032");
  console.log("entryPoint08Address=0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108");

  console.log("\n[status]");
  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");
}

function main(): void {
  printHeader();
  printChain();
  printImports();
  printConstructionRequirements();
  printFutureArchitecture();
  printBlockers();
  printStatus();
}

main();
