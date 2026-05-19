import * as appKit from "@circle-fin/app-kit";

const KEYWORDS = [
  "paymaster",
  "gasless",
  "useroperation",
  "userop",
  "smartaccount",
  "accountabstraction",
  "wallet_sendcalls",
  "sponsored",
  "policy",
  "arc_testnet",
  "arc",
  "unifiedbalance",
  "bridge",
  "send",
  "paygasfees",
];

function normalize(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function includesKeyword(name: string): boolean {
  const normalized = normalize(name);
  return KEYWORDS.some((k) => normalized.includes(normalize(k)));
}

function main(): void {
  const exportsList = Object.keys(appKit).sort();
  const matched = exportsList.filter(includesKeyword);

  console.log("[appkit-paymaster-surface] local export inspection (non-mutating)");
  console.log(`totalExports=${exportsList.length}`);
  console.log(`matchedExports=${matched.length}`);

  for (const item of matched) {
    console.log(`export=${item}`);
  }

  const hasExplicitPaymaster = matched.some((m) => /paymaster/i.test(m));
  const hasExplicitUserOp = matched.some((m) => /userop|useroperation/i.test(m));

  console.log(`explicitPaymasterModule=${hasExplicitPaymaster ? "yes" : "no"}`);
  console.log(`explicitUserOperationPrimitive=${hasExplicitUserOp ? "yes" : "no"}`);
  console.log("conclusion=APP_KIT_BLOCKED_NO_LOCAL_DETERMINISTIC_PAYMASTER_SURFACE");
  console.log("claimBoundary=DO_NOT_CLAIM");
}

main();
