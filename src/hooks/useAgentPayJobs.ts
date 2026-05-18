"use client";

import { useMemo } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { parseAbiItem } from "viem";
import { erc8183Abi, erc8183ContractAddress, type Erc8183JobTuple } from "@/lib/erc8183";
import { ARC_CHAIN_ID } from "@/lib/wagmi";
import { ERC8183_INDEXING_FROM_BLOCK } from "@/lib/constants";
import { formatUsdcAmount } from "@/lib/usdc";
import { getJobCreatedEventTopic, normalizeJobId } from "@/lib/events";

export type JobsFilter = "all" | "client" | "provider";

export interface IndexedAgentPayJob {
  id: bigint;
  client: `0x${string}`;
  provider: `0x${string}`;
  evaluator: `0x${string}`;
  description: string;
  budget: bigint;
  expiredAt: bigint;
  status: number;
  hook: `0x${string}`;
}

export interface AgentPayJobStats {
  totalJobs: number;
  openJobs: number;
  fundedJobs: number;
  submittedJobs: number;
  completedJobs: number;
  totalEscrowedUsdc: string;
  totalPaidOutUsdc: string;
}

export interface AgentPayIndexDiagnostics {
  fromBlock: bigint;
  toBlock?: bigint;
  isToBlockFixed: boolean;
  latestBlock?: bigint;
  indexedJobCount: number;
  contractAddress: `0x${string}`;
  eventTopic: `0x${string}`;
  connectedWallet?: `0x${string}`;
  errorShort?: string;
  suggestion?: string;
}

const jobCreatedEvent = parseAbiItem(
  "event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, address evaluator, uint256 expiredAt, address hook)"
);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unknown indexing error";
}

export function getIndexingFromBlock(): bigint {
  const raw = process.env.NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK;
  if (!raw) return ERC8183_INDEXING_FROM_BLOCK;

  try {
    return BigInt(raw);
  } catch {
    return ERC8183_INDEXING_FROM_BLOCK;
  }
}

export function getIndexingToBlock(): bigint | undefined {
  const raw = process.env.NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK;
  if (!raw) return undefined;

  try {
    return BigInt(raw);
  } catch {
    return undefined;
  }
}

function asJobTuple(job: unknown): Erc8183JobTuple | undefined {
  if (!job || typeof job !== "object") return undefined;
  const candidate = job as Partial<Erc8183JobTuple>;
  if (
    typeof candidate.id === "bigint" &&
    typeof candidate.client === "string" &&
    typeof candidate.provider === "string" &&
    typeof candidate.evaluator === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.budget === "bigint" &&
    typeof candidate.expiredAt === "bigint" &&
    typeof candidate.status === "number" &&
    typeof candidate.hook === "string"
  ) {
    return candidate as Erc8183JobTuple;
  }
  return undefined;
}

export function useAgentPayJobs(filter: JobsFilter = "all") {
  const publicClient = usePublicClient({ chainId: ARC_CHAIN_ID });
  const { address } = useAccount();
  const fromBlock = getIndexingFromBlock();
  const fixedToBlock = getIndexingToBlock();
  const isToBlockFixed = fixedToBlock !== undefined;

  const query = useQuery({
    queryKey: [
      "agentpay-jobs",
      ARC_CHAIN_ID,
      erc8183ContractAddress,
      fromBlock.toString(),
      fixedToBlock?.toString() ?? "latest",
    ],
    queryFn: async (): Promise<{ jobs: IndexedAgentPayJob[]; latestBlock: bigint; toBlockUsed: bigint }> => {
      if (!publicClient) return { jobs: [], latestBlock: fromBlock, toBlockUsed: fromBlock };
      const latestBlock = await publicClient.getBlockNumber();
      const toBlockUsed = fixedToBlock && fixedToBlock < latestBlock ? fixedToBlock : latestBlock;

      if (fromBlock > toBlockUsed) {
        return { jobs: [], latestBlock, toBlockUsed };
      }

      const logs = [] as Awaited<ReturnType<typeof publicClient.getLogs>>;

      // Arc RPC can fail on large log ranges; chunk requests for stability.
      const chunkSize = 2_000n;
      let cursor = fromBlock;
      while (cursor <= toBlockUsed) {
        const end = cursor + chunkSize > toBlockUsed ? toBlockUsed : cursor + chunkSize;
        const chunk = await publicClient.getLogs({
          address: erc8183ContractAddress,
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

      const jobs = await Promise.all(
        sortedIds.map(async (jobId) => {
          try {
            const result = await publicClient.readContract({
              address: erc8183ContractAddress,
              abi: erc8183Abi,
              functionName: "getJob",
              args: [jobId],
            });

            const tuple = asJobTuple(result);
            if (!tuple) return undefined;

            return {
              id: tuple.id,
              client: tuple.client,
              provider: tuple.provider,
              evaluator: tuple.evaluator,
              description: tuple.description,
              budget: tuple.budget,
              expiredAt: tuple.expiredAt,
              status: tuple.status,
              hook: tuple.hook,
            } satisfies IndexedAgentPayJob;
          } catch {
            return undefined;
          }
        })
      );

      return {
        jobs: jobs.filter((job): job is IndexedAgentPayJob => Boolean(job)),
        latestBlock,
        toBlockUsed,
      };
    },
    staleTime: 30_000,
  });

  const filteredJobs = useMemo(() => {
    const jobs = query.data?.jobs ?? [];
    if (!address || filter === "all") return jobs;

    const normalized = address.toLowerCase();
    if (filter === "client") {
      return jobs.filter((job) => job.client.toLowerCase() === normalized);
    }
    return jobs.filter((job) => job.provider.toLowerCase() === normalized);
  }, [address, filter, query.data]);

  const stats = useMemo<AgentPayJobStats>(() => {
    const source = query.data?.jobs ?? [];
    const openJobs = source.filter((j) => j.status === 0).length;
    const fundedJobs = source.filter((j) => j.status === 1).length;
    const submittedJobs = source.filter((j) => j.status === 2).length;
    const completedJobs = source.filter((j) => j.status === 3).length;
    const totalEscrowedRaw = source.reduce((sum, j) => sum + j.budget, 0n);
    const totalPaidRaw = source
      .filter((j) => j.status === 3)
      .reduce((sum, j) => sum + j.budget, 0n);

    return {
      totalJobs: source.length,
      openJobs,
      fundedJobs,
      submittedJobs,
      completedJobs,
      totalEscrowedUsdc: formatUsdcAmount(totalEscrowedRaw),
      totalPaidOutUsdc: formatUsdcAmount(totalPaidRaw),
    };
  }, [query.data]);

  const diagnostics: AgentPayIndexDiagnostics = {
    fromBlock,
    toBlock: query.data?.toBlockUsed ?? fixedToBlock,
    isToBlockFixed,
    latestBlock: query.data?.latestBlock,
    indexedJobCount: query.data?.jobs.length ?? 0,
    contractAddress: erc8183ContractAddress,
    eventTopic: getJobCreatedEventTopic(),
    connectedWallet: address,
    errorShort: query.error ? getErrorMessage(query.error) : undefined,
    suggestion: query.error
      ? "Arc RPC log query may be range-limited. Keep NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK close to the target tx block, then retry."
      : undefined,
  };

  return {
    jobs: filteredJobs,
    allJobs: query.data?.jobs ?? [],
    stats,
    fromBlock,
    toBlock: query.data?.toBlockUsed ?? fixedToBlock,
    isToBlockFixed,
    jobCreatedTopic: getJobCreatedEventTopic(),
    hasCustomFromBlock: Boolean(process.env.NEXT_PUBLIC_ERC8183_INDEXING_FROM_BLOCK),
    hasCustomToBlock: Boolean(process.env.NEXT_PUBLIC_ERC8183_INDEXING_TO_BLOCK),
    diagnostics,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAgentPayManualJob(jobIdInput: string) {
  const publicClient = usePublicClient({ chainId: ARC_CHAIN_ID });
  const jobId = normalizeJobId(jobIdInput);

  return useQuery({
    queryKey: ["agentpay-manual-job", jobIdInput],
    enabled: Boolean(publicClient && jobId !== undefined),
    queryFn: async (): Promise<IndexedAgentPayJob | undefined> => {
      if (!publicClient || jobId === undefined) return undefined;
      const result = await publicClient.readContract({
        address: erc8183ContractAddress,
        abi: erc8183Abi,
        functionName: "getJob",
        args: [jobId],
      });
      const tuple = asJobTuple(result);
      if (!tuple) return undefined;
      return {
        id: tuple.id,
        client: tuple.client,
        provider: tuple.provider,
        evaluator: tuple.evaluator,
        description: tuple.description,
        budget: tuple.budget,
        expiredAt: tuple.expiredAt,
        status: tuple.status,
        hook: tuple.hook,
      };
    },
  });
}
