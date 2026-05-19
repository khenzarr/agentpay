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

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function toDefinedEntries(input: Record<string, unknown>): Record<string, unknown> {
  const entries = Object.entries(input).filter(([, value]) => value !== undefined);
  return Object.fromEntries(entries);
}

function pickRecord(...values: unknown[]): Record<string, unknown> | undefined {
  for (const value of values) {
    if (value !== null && typeof value === "object") {
      return value as Record<string, unknown>;
    }
  }

  return undefined;
}

function pickString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
}

function pickAmount(data: Record<string, unknown>): string | undefined {
  const directAmount = pickString(data.amount, data.amountInUSD, data.amountInUsd);
  if (directAmount) {
    return directAmount;
  }

  const amountObject = pickRecord(data.amount);
  if (amountObject) {
    const nestedAmount = pickString(amountObject.amount, amountObject.value, amountObject.quantity);
    if (nestedAmount) {
      return nestedAmount;
    }
  }

  const amounts = data.amounts;
  if (Array.isArray(amounts)) {
    const first = amounts.find((item) => typeof item === "string");
    if (typeof first === "string") {
      return first;
    }
  }

  return undefined;
}

function isLikelyTransactionShape(data: Record<string, unknown>): boolean {
  return [
    data.id,
    data.transactionId,
    data.state,
    data.status,
    data.txHash,
    data.transactionHash,
    data.blockchain,
    data.walletId,
    data.sourceWalletId,
  ].some((value) => value !== undefined);
}

function pickTransactionObject(response: Record<string, unknown>): {
  transaction: Record<string, unknown>;
  shape: string;
} {
  const responseData = asRecord(response.data);
  const candidates: Array<{ value: unknown; shape: string }> = [
    { value: responseData.transaction, shape: "response.data.transaction" },
    { value: responseData, shape: "response.data" },
    { value: response.transaction, shape: "response.transaction" },
    { value: response, shape: "response" },
  ];

  for (const candidate of candidates) {
    const record = asRecord(candidate.value);
    if (Object.keys(record).length > 0 && isLikelyTransactionShape(record)) {
      return { transaction: record, shape: candidate.shape };
    }
  }

  return { transaction: asRecord(responseData), shape: "response.data" };
}

function sanitizeForSummary(value: unknown, depth = 0): unknown {
  const MAX_DEPTH = 2;
  const MAX_KEYS = 20;
  const MAX_ARRAY_ITEMS = 10;
  const MAX_STRING = 240;
  const secretPattern = /api[_-]?key|secret|cipher|authorization|token/i;

  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    if (value.length > MAX_STRING) {
      return `${value.slice(0, MAX_STRING)}...<truncated>`;
    }

    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    if (depth >= MAX_DEPTH) {
      return `[array length=${value.length}]`;
    }

    return value.slice(0, MAX_ARRAY_ITEMS).map((item) => sanitizeForSummary(item, depth + 1));
  }

  if (typeof value === "object") {
    if (depth >= MAX_DEPTH) {
      return "[object]";
    }

    const record = value as Record<string, unknown>;
    const limitedEntries = Object.entries(record).slice(0, MAX_KEYS);
    const redacted: Record<string, unknown> = {};

    for (const [key, entryValue] of limitedEntries) {
      if (secretPattern.test(key)) {
        redacted[key] = "[redacted]";
        continue;
      }

      redacted[key] = sanitizeForSummary(entryValue, depth + 1);
    }

    return redacted;
  }

  return String(value);
}

async function main(): Promise<void> {
  console.log("[circle-wallets] get transaction status (server-only, non-mutating)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const transactionId = getRequiredEnv("CIRCLE_WALLET_TRANSACTION_ID");

  const client = initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });

  const response = await client.getTransaction({ id: transactionId });
  const responseRecord = asRecord(response);
  const { transaction: data, shape } = pickTransactionObject(responseRecord);
  const token = pickRecord(data.token);
  const source = pickRecord(data.source);
  const destination = pickRecord(data.destination);

  const id = pickString(data.id, data.transactionId, transactionId) ?? transactionId;
  const state = pickString(data.state);
  const status = typeof response.status === "number" ? String(response.status) : undefined;
  const txHash = pickString(data.txHash, data.transactionHash);
  const blockchain = pickString(data.blockchain, token?.blockchain, source?.blockchain, destination?.blockchain);
  const sourceWalletId = pickString(data.walletId, data.sourceWalletId, source?.walletId);
  const sourceAddress = pickString(data.sourceAddress, data.fromAddress, source?.address, source?.sourceAddress);
  const destinationAddress = pickString(
    data.destinationAddress,
    data.toAddress,
    destination?.address,
    destination?.destinationAddress,
  );
  const tokenId = pickString(data.tokenId, token?.id, token?.tokenId);
  const tokenSymbol = pickString(data.symbol, data.tokenSymbol, token?.symbol);
  const amount = pickAmount(data);
  const feeLevel = pickString(data.feeLevel, asRecord(data.fees).feeLevel);
  const createdAt = pickString(data.createDate, data.createdAt);
  const updatedAt = pickString(data.updateDate, data.updatedAt);

  const summary = toDefinedEntries({
    transactionId: id,
    state,
    status,
    txHash,
    blockchain,
    sourceWalletId,
    sourceAddress,
    destinationAddress,
    tokenId,
    tokenSymbol,
    amount,
    feeLevel,
    createdAt,
    updatedAt,
  });

  const finalityFieldsPresent = Boolean(state || txHash || blockchain || updatedAt || createdAt);

  console.log("[circle-wallets] transaction status fetched.");
  console.log(`responseShape=${shape}`);
  console.log(`transactionId=${id}`);

  if (state) {
    console.log(`state=${state}`);
  }

  if (status) {
    console.log(`status=${status}`);
  }

  if (txHash) {
    console.log(`txHash=${txHash}`);
  }

  if (blockchain) {
    console.log(`blockchain=${blockchain}`);
  }

  if (sourceWalletId) {
    console.log(`sourceWalletId=${sourceWalletId}`);
  }

  if (sourceAddress) {
    console.log(`sourceAddress=${sourceAddress}`);
  }

  if (destinationAddress) {
    console.log(`destinationAddress=${destinationAddress}`);
  }

  if (tokenId) {
    console.log(`tokenId=${tokenId}`);
  }

  if (tokenSymbol) {
    console.log(`tokenSymbol=${tokenSymbol}`);
  }

  if (amount) {
    console.log(`amount=${amount}`);
  }

  if (feeLevel) {
    console.log(`feeLevel=${feeLevel}`);
  }

  if (createdAt) {
    console.log(`createdAt=${createdAt}`);
  }

  if (updatedAt) {
    console.log(`updatedAt=${updatedAt}`);
  }

  if (finalityFieldsPresent) {
    console.log("finalityFieldsPresent=true");
  } else {
    console.log("finalityFieldsPresent=false");
    console.log("Only HTTP/API status was returned; cannot mark transfer verified yet.");
  }

  const expectedKeys = [
    "transactionId",
    "state",
    "status",
    "txHash",
    "blockchain",
    "sourceWalletId",
    "sourceAddress",
    "destinationAddress",
    "tokenId",
    "tokenSymbol",
    "amount",
    "feeLevel",
    "createdAt",
    "updatedAt",
  ];
  const missingExpected = expectedKeys.filter((key) => summary[key] === undefined);

  if (missingExpected.length > 0) {
    const summaryPayload = {
      responseShape: shape,
      extractedSummary: summary,
      transactionSample: sanitizeForSummary(data),
      responseSample: sanitizeForSummary(responseRecord),
      missingExpected,
    };

    console.log("sanitizedSummary=");
    console.log(JSON.stringify(summaryPayload, null, 2));
  }
}

void main();