import {
  decodeEventLog,
  parseEventLogs,
  toEventSelector,
  type AbiEvent,
  type TransactionReceipt,
} from "viem";

const jobCreatedEvent: AbiEvent = {
  type: "event",
  name: "JobCreated",
  inputs: [
    { indexed: true, name: "jobId", type: "uint256" },
    { indexed: true, name: "client", type: "address" },
    { indexed: true, name: "provider", type: "address" },
    { indexed: false, name: "evaluator", type: "address" },
    { indexed: false, name: "expiredAt", type: "uint256" },
    { indexed: false, name: "hook", type: "address" },
  ],
  anonymous: false,
};

export function getJobCreatedEventTopic(): `0x${string}` {
  return toEventSelector(jobCreatedEvent);
}

export function normalizeJobId(value: unknown): bigint | undefined {
  if (typeof value === "bigint") return value;
  if (typeof value === "number" && Number.isFinite(value)) return BigInt(value);
  if (typeof value === "string") {
    try {
      return BigInt(value);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function parseJobCreatedFromReceipt(
  receipt: TransactionReceipt | undefined
): bigint | undefined {
  if (!receipt) return undefined;

  const parsed = parseEventLogs({
    abi: [jobCreatedEvent],
    logs: receipt.logs,
    eventName: "JobCreated",
    strict: false,
  });

  const first = parsed[0] as { args?: { jobId?: unknown } } | undefined;
  if (first?.args?.jobId !== undefined) {
    return normalizeJobId(first.args.jobId);
  }

  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: [jobCreatedEvent],
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName === "JobCreated") {
        const args = decoded.args as { jobId?: unknown } | undefined;
        if (args?.jobId !== undefined) {
          return normalizeJobId(args.jobId);
        }
      }
    } catch {
      // ignore non-matching logs
    }
  }

  return undefined;
}
