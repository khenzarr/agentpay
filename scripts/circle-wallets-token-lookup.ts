import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const PLACEHOLDER_TOKENS = ["BURAYA", "PLACEHOLDER", "TODO", "YOUR_", "CHANGE_ME", "example"];

type PrintableToken = {
  id: string;
  symbol?: string;
  name?: string;
  blockchain?: string;
  tokenAddress?: string;
  decimals?: number;
  source: string;
};

function isPlaceholder(value: string): boolean {
  const lowered = value.toLowerCase();
  return PLACEHOLDER_TOKENS.some((token) => lowered.includes(token.toLowerCase()));
}

function getRequiredEnv(key: string): string {
  const value = process.env[key]?.trim() ?? "";

  if (!value) {
    throw new Error(`${key} is required in .env.circle.local`);
  }

  if (isPlaceholder(value)) {
    throw new Error(`${key} appears to be a placeholder. Set a real value in .env.circle.local`);
  }

  return value;
}

function getOptionalEnv(key: string): string | undefined {
  const value = process.env[key]?.trim() ?? "";
  if (!value) {
    return undefined;
  }

  if (isPlaceholder(value)) {
    return undefined;
  }

  return value;
}

function normalize(value?: string): string {
  return (value ?? "").trim().toUpperCase();
}

function toPrintableToken(rawToken: unknown, source: string): PrintableToken | null {
  const token = rawToken as Record<string, unknown> | undefined;
  if (!token || typeof token.id !== "string") {
    return null;
  }

  return {
    id: token.id,
    symbol: typeof token.symbol === "string" ? token.symbol : undefined,
    name: typeof token.name === "string" ? token.name : undefined,
    blockchain: typeof token.blockchain === "string" ? token.blockchain : undefined,
    tokenAddress: typeof token.tokenAddress === "string" ? token.tokenAddress : undefined,
    decimals: typeof token.decimals === "number" ? token.decimals : undefined,
    source,
  };
}

function printToken(token: PrintableToken): void {
  console.log("--- token ---");
  console.log(`source=${token.source}`);
  console.log(`id=${token.id}`);
  if (token.symbol) console.log(`symbol=${token.symbol}`);
  if (token.name) console.log(`name=${token.name}`);
  if (token.blockchain) console.log(`blockchain=${token.blockchain}`);
  if (token.tokenAddress) console.log(`tokenAddress=${token.tokenAddress}`);
  if (typeof token.decimals === "number") console.log(`decimals=${token.decimals}`);
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

async function main(): Promise<void> {
  console.log("[circle-wallets] token lookup (server-only, non-mutating)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");

  const lookupBlockchain = normalize(getOptionalEnv("CIRCLE_TOKEN_LOOKUP_BLOCKCHAIN") ?? "ARC-TESTNET");
  const lookupSymbol = normalize(getOptionalEnv("CIRCLE_TOKEN_LOOKUP_SYMBOL") ?? "USDC");
  const lookupTokenId = getOptionalEnv("CIRCLE_TOKEN_LOOKUP_TOKEN_ID");
  const walletId = getOptionalEnv("CIRCLE_WALLET_ID");

  const client = initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });

  const discovered: PrintableToken[] = [];

  if (lookupTokenId) {
    try {
      const response = await client.getToken({ id: lookupTokenId });
      const token = toPrintableToken(response.data?.token, "getToken(id)");
      if (token) {
        discovered.push(token);
      } else {
        console.log("[circle-wallets] getToken returned no token object.");
      }
    } catch (error) {
      console.error("[circle-wallets] getToken(id) failed.");
      console.error(errorMessage(error));
    }
  } else {
    console.log("[circle-wallets] CIRCLE_TOKEN_LOOKUP_TOKEN_ID not provided; skipping getToken(id).\n");
  }

  try {
    const monitored = await client.listMonitoredTokens({
      blockchain: lookupBlockchain as never,
      symbol: lookupSymbol,
      pageSize: 50,
    });

    const monitoredTokens = (monitored.data?.tokens ?? []) as unknown[];
    for (const raw of monitoredTokens) {
      const token = toPrintableToken(raw, "listMonitoredTokens");
      if (token) {
        discovered.push(token);
      }
    }
  } catch (error) {
    console.error("[circle-wallets] listMonitoredTokens failed.");
    console.error(errorMessage(error));
  }

  if (walletId) {
    try {
      const balances = await client.getWalletTokenBalance({
        id: walletId,
        includeAll: true,
      });

      const tokenBalances = (balances.data?.tokenBalances ?? []) as unknown[];
      for (const item of tokenBalances) {
        const balance = item as { token?: unknown };
        const token = toPrintableToken(balance.token, "getWalletTokenBalance");
        if (token) {
          discovered.push(token);
        }
      }
    } catch (error) {
      console.error("[circle-wallets] getWalletTokenBalance failed.");
      console.error(errorMessage(error));
    }
  } else {
    console.log("[circle-wallets] CIRCLE_WALLET_ID not set; skipping wallet balance token lookup.");
  }

  const uniqueById = new Map<string, PrintableToken>();
  for (const token of discovered) {
    if (!uniqueById.has(token.id)) {
      uniqueById.set(token.id, token);
    }
  }

  const filtered = [...uniqueById.values()].filter((token) => {
    const blockchainOk = !token.blockchain || normalize(token.blockchain) === lookupBlockchain;
    const symbolOk = !lookupSymbol || normalize(token.symbol) === lookupSymbol;
    return blockchainOk && symbolOk;
  });

  console.log("\n[circle-wallets] token lookup results");
  console.log(`lookupBlockchain=${lookupBlockchain}`);
  console.log(`lookupSymbol=${lookupSymbol}`);
  console.log(`candidateCount=${filtered.length}`);

  if (filtered.length > 0) {
    for (const token of filtered) {
      printToken(token);
    }
    return;
  }

  console.log("[circle-wallets] No matching token candidate found from available non-mutating SDK endpoints.");
  console.log("[circle-wallets] Token ID must not be guessed.");
  console.log(
    "[circle-wallets] Next action: obtain the ARC-TESTNET USDC token ID from Circle Console/API token inventory (or supported token endpoint), then set CIRCLE_WALLET_TRANSFER_TOKEN_ID explicitly."
  );
}

void main();
