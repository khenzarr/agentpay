import { createPublicClient, http, parseAbiItem } from "viem";
import {
  ARC_TESTNET_CHAIN_ID,
  ARC_TESTNET_EXPLORER_URL,
  ARC_TESTNET_RPC_URL,
  ERC8183_AGENTIC_COMMERCE_ADDRESS,
  ERC8183_INDEXING_FROM_BLOCK,
} from "@/lib/constants";
import { erc8183Abi, getJobStatusLabel, type Erc8183JobTuple } from "@/lib/erc8183";
import { normalizeJobId } from "@/lib/events";

const jobCreatedEvent = parseAbiItem(
  "event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, address evaluator, uint256 expiredAt, address hook)"
);

export interface ReadJob {
  id: string;
  client: `0x${string}`;
  provider: `0x${string}`;
  evaluator: `0x${string}`;
  description: string;
  budget: string;
  expiredAt: string;
  status: number;
  statusLabel: string;
  hook: `0x${string}`;
  explorer: string;
}

function asJobTuple(job: unknown): Erc8183JobTuple | undefined {
  if (!job || typeof job !== "object") return undefined;
  const c = job as Partial<Erc8183JobTuple>;
  if (
    typeof c.id === "bigint" &&
    typeof c.client === "string" &&
    typeof c.provider === "string" &&
    typeof c.evaluator === "string" &&
    typeof c.description === "string" &&
    typeof c.budget === "bigint" &&
    typeof c.expiredAt === "bigint" &&
    typeof c.status === "number" &&
    typeof c.hook === "string"
  ) {
    return c as Erc8183JobTuple;
  }
  return undefined;
}

function mapReadJob(tuple: Erc8183JobTuple): ReadJob {
  return {
    id: tuple.id.toString(),
    client: tuple.client,
    provider: tuple.provider,
    evaluator: tuple.evaluator,
    description: tuple.description,
    budget: tuple.budget.toString(),
    expiredAt: tuple.expiredAt.toString(),
    status: tuple.status,
    statusLabel: getJobStatusLabel(tuple.status),
    hook: tuple.hook,
    explorer: `${ARC_TESTNET_EXPLORER_URL}/address/${ERC8183_AGENTIC_COMMERCE_ADDRESS}`,
  };
}

export function getPublicClient() {
  return createPublicClient({
    chain: {
      id: ARC_TESTNET_CHAIN_ID,
      name: "Arc Testnet",
      nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
      rpcUrls: {
        default: { http: [ARC_TESTNET_RPC_URL] },
      },
    },
    transport: http(ARC_TESTNET_RPC_URL),
  });
}

function getIndexingFromBlock(): bigint {
  const raw = process.env.NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK;
  if (!raw) return ERC8183_INDEXING_FROM_BLOCK;
  try {
    return BigInt(raw);
  } catch {
    return ERC8183_INDEXING_FROM_BLOCK;
  }
}

export async function getIndexedJobs(limit?: number): Promise<ReadJob[]> {
  const publicClient = getPublicClient();
  const fromBlock = getIndexingFromBlock();
  const latestBlock = await publicClient.getBlockNumber();
  if (fromBlock > latestBlock) return [];

  const logs: Awaited<ReturnType<typeof publicClient.getLogs>> = [];
  const chunkSize = 2_000n;
  let cursor = fromBlock;
  while (cursor <= latestBlock) {
    const end = cursor + chunkSize > latestBlock ? latestBlock : cursor + chunkSize;
    const chunk = await publicClient.getLogs({
      address: ERC8183_AGENTIC_COMMERCE_ADDRESS,
      fromBlock: cursor,
      toBlock: end,
      event: jobCreatedEvent,
    });
    logs.push(...chunk);
    cursor = end + 1n;
  }

  const uniqueJobIds = new Set<bigint>();
  for (const log of logs) {
    const decoded = (log as { args?: { jobId?: unknown } }).args;
    const jobId = normalizeJobId(decoded?.jobId);
    if (jobId !== undefined) uniqueJobIds.add(jobId);
  }

  const sortedIds = Array.from(uniqueJobIds).sort((a, b) => (a > b ? -1 : 1));
  const trimmedIds = typeof limit === "number" && limit > 0 ? sortedIds.slice(0, limit) : sortedIds;
  const jobs = await Promise.all(
    trimmedIds.map(async (jobId) => {
      try {
        const result = await publicClient.readContract({
          address: ERC8183_AGENTIC_COMMERCE_ADDRESS,
          abi: erc8183Abi,
          functionName: "getJob",
          args: [jobId],
        });
        const tuple = asJobTuple(result);
        return tuple ? mapReadJob(tuple) : undefined;
      } catch {
        return undefined;
      }
    })
  );

  return jobs.filter((j): j is ReadJob => Boolean(j));
}

export async function getJobById(jobId: bigint): Promise<ReadJob | undefined> {
  const publicClient = getPublicClient();
  const result = await publicClient.readContract({
    address: ERC8183_AGENTIC_COMMERCE_ADDRESS,
    abi: erc8183Abi,
    functionName: "getJob",
    args: [jobId],
  });
  const tuple = asJobTuple(result);
  if (!tuple) return undefined;
  if (tuple.id === 0n && tuple.client === "0x0000000000000000000000000000000000000000") return undefined;
  return mapReadJob(tuple);
}

export async function getDerivedPayments(limit?: number) {
  const jobs = await getIndexedJobs(limit);
  return jobs.map((job) => ({
    jobId: job.id,
    client: job.client,
    provider: job.provider,
    status: job.status,
    statusLabel: job.statusLabel,
    amount: job.budget,
    completed: job.status === 3,
    explorer: job.explorer,
  }));
}
