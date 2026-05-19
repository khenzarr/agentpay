type CheckResult = {
  packageName: string;
  version: string;
  resolved: boolean;
};

function getPackageVersion(packageName: string): CheckResult {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pkg = require(`${packageName}/package.json`) as { version?: string };
    return {
      packageName,
      version: pkg.version ?? "unknown",
      resolved: true,
    };
  } catch {
    return {
      packageName,
      version: "not-found",
      resolved: false,
    };
  }
}

function safeRequire(moduleName: string): Record<string, unknown> | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(moduleName) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function pickExports(keys: string[], patterns: RegExp[]): string[] {
  return keys.filter((key) => patterns.some((pattern) => pattern.test(key))).sort();
}

function main(): void {
  console.log("[paymaster-proof-path-inspect] mode=NON_MUTATING_LOCAL_ONLY");
  console.log("networkCalls=false");
  console.log("secretsRead=false");

  const checks = [
    "@circle-fin/app-kit",
    "@circle-fin/developer-controlled-wallets",
    "viem",
    "wagmi",
  ].map(getPackageVersion);

  console.log("\n[packages]");
  for (const check of checks) {
    console.log(`${check.packageName} resolved=${check.resolved ? "yes" : "no"} version=${check.version}`);
  }

  const appKit = safeRequire("@circle-fin/app-kit");
  const viemAa = safeRequire("viem/account-abstraction");
  const wallets = safeRequire("@circle-fin/developer-controlled-wallets");

  console.log("\n[app-kit-surface]");
  if (!appKit) {
    console.log("resolved=no");
  } else {
    const keys = Object.keys(appKit);
    const matched = pickExports(keys, [/paymaster/i, /bundler/i, /userop/i, /entrypoint/i, /gasless/i]);
    console.log("resolved=yes");
    console.log(`matchedExports=${matched.length > 0 ? matched.join(",") : "none"}`);
  }

  console.log("\n[viem-account-abstraction-surface]");
  if (!viemAa) {
    console.log("resolved=no");
  } else {
    const keys = Object.keys(viemAa);
    const matched = pickExports(keys, [
      /createBundlerClient/i,
      /createPaymasterClient/i,
      /sendUserOperation/i,
      /waitForUserOperationReceipt/i,
      /getUserOperation/i,
      /entryPoint/i,
      /toSmartAccount/i,
      /getUserOperationHash/i,
    ]);
    console.log("resolved=yes");
    console.log(`matchedExports=${matched.length > 0 ? matched.join(",") : "none"}`);
  }

  console.log("\n[circle-wallets-surface]");
  if (!wallets) {
    console.log("resolved=no");
  } else {
    const keys = Object.keys(wallets);
    const matched = pickExports(keys, [/createWallets/i, /createTransaction/i, /signMessage/i, /signTypedData/i, /signTransaction/i, /AccountType/i]);
    console.log("resolved=yes");
    console.log(`matchedExports=${matched.length > 0 ? matched.join(",") : "none"}`);
  }

  console.log("\n[classificationHint]");
  console.log("appKitDeterministicPaymasterProof=NOT_PROVEN_FROM_INSTALLED_SURFACE");
  console.log("rawErc4337ToolingSurface=PRESENT_VIA_VIEM");
  console.log("claimBoundary=DO_NOT_CLAIM");
}

main();
