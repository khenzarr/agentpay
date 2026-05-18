import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const PLACEHOLDER_TOKENS = ["BURAYA", "PLACEHOLDER", "TODO", "YOUR_", "CHANGE_ME", "example"];

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

function normalize(value?: string): string {
  return (value ?? "").trim().toUpperCase();
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

async function main(): Promise<void> {
  console.log("[circle-wallets] list wallet token balances (server-only, non-mutating)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const walletId = getRequiredEnv("CIRCLE_WALLET_ID");
  const filterBlockchain = normalize(process.env.CIRCLE_TOKEN_LOOKUP_BLOCKCHAIN ?? "ARC-TESTNET");
  const filterSymbol = normalize(process.env.CIRCLE_TOKEN_LOOKUP_SYMBOL ?? "USDC");

  const client = initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });

  try {
    const response = await client.getWalletTokenBalance({
      id: walletId,
      includeAll: true,
    });

    const tokenBalances = response.data?.tokenBalances ?? [];

    const filtered = tokenBalances.filter((item) => {
      const blockchain = normalize((item as unknown as { token?: { blockchain?: string } }).token?.blockchain);
      const symbol = normalize((item as unknown as { token?: { symbol?: string } }).token?.symbol);

      const blockchainOk = !filterBlockchain || !blockchain || blockchain === filterBlockchain;
      const symbolOk = !filterSymbol || !symbol || symbol === filterSymbol;
      return blockchainOk && symbolOk;
    });

    console.log(`[circle-wallets] walletId=${walletId}`);
    console.log(`[circle-wallets] returnedTokenBalanceCount=${tokenBalances.length}`);
    console.log(`[circle-wallets] filteredCount=${filtered.length}`);
    console.log(`[circle-wallets] filterBlockchain=${filterBlockchain}`);
    console.log(`[circle-wallets] filterSymbol=${filterSymbol}`);

    for (const item of filtered) {
      const token = (item as unknown as { token?: Record<string, unknown> }).token;
      const amount = (item as unknown as { amount?: string }).amount;
      console.log("--- token-balance ---");
      if (typeof token?.id === "string") console.log(`tokenId=${token.id}`);
      if (typeof token?.symbol === "string") console.log(`symbol=${token.symbol}`);
      if (typeof token?.name === "string") console.log(`name=${token.name}`);
      if (typeof token?.blockchain === "string") console.log(`blockchain=${token.blockchain}`);
      if (typeof token?.tokenAddress === "string") console.log(`tokenAddress=${token.tokenAddress}`);
      if (typeof token?.decimals === "number") console.log(`decimals=${token.decimals}`);
      if (typeof amount === "string") console.log(`amount=${amount}`);
    }

    if (filtered.length === 0) {
      console.log("[circle-wallets] No matching token balances returned for current wallet/filter.");
      console.log("[circle-wallets] This can mean the wallet is unfunded for the requested token/chain.");
      console.log("[circle-wallets] Do not guess token ID. Fund wallet with target token, then rerun.");
    }
  } catch (error) {
    console.error("[circle-wallets] getWalletTokenBalance failed.");
    console.error(errorMessage(error));
    throw error;
  }
}

void main();
