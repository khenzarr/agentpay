"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { isAddress, type Address } from "viem";
import { useRouter } from "next/navigation";
import { useCreateJob } from "@/hooks/useCreateJob";
import { isErc8183IntegrationReady } from "@/lib/erc8183";
import { NetworkGuard } from "@/components/wallet/NetworkGuard";
import { ArcScanTxLink } from "@/components/agentpay/ArcScanLink";
import { AddressIdentity } from "@/components/agentpay/AddressIdentity";
import { demoAgents } from "@/config/demo-agents";
import { getKnownArcnsPrimaryName } from "@/config/demo-identities";
import { parseJobCreatedFromReceipt } from "@/lib/events";
import { getArcscanTxUrl } from "@/lib/arcscan";

export function CreateJobForm({ defaultAgentId }: { defaultAgentId?: string }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { createJob, isPending, isConfirming, hash, error, receipt } = useCreateJob();

  const agent = demoAgents.find((a) => a.id === defaultAgentId) ?? demoAgents[0];

  const [provider, setProvider] = useState<string>(agent.address);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetHint, setBudgetHint] = useState("1");
  const [daysUntilExpiry, setDaysUntilExpiry] = useState("7");
  const [createTxHash, setCreateTxHash] = useState<`0x${string}` | undefined>();

  const ready = isErc8183IntegrationReady();
  const parsedJobId = useMemo(
    () => parseJobCreatedFromReceipt(receipt.data),
    [receipt.data]
  );

  useEffect(() => {
    if (!receipt.isSuccess) return;

    if (parsedJobId !== undefined) {
      router.push(`/jobs/${parsedJobId.toString()}`);
    }
  }, [parsedJobId, receipt.isSuccess, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address || !ready) return;
    if (!isAddress(provider)) {
      alert("Invalid agent address");
      return;
    }

    const desc = title.trim()
      ? `${title.trim()}: ${description.trim()}`
      : description.trim() || "AgentPay job on Arc Testnet";

    const expiredAt =
      BigInt(Math.floor(Date.now() / 1000)) +
      BigInt(Number(daysUntilExpiry) * 86400);

    const { txHash } = await createJob({
      provider: provider as Address,
      evaluator: address,
      expiredAt,
      description: desc,
    });
    setCreateTxHash(txHash);
  }

  const eventParseFailed =
    Boolean(createTxHash) && receipt.isSuccess && parsedJobId === undefined;

  const connectedClientArcns = getKnownArcnsPrimaryName(address);
  const selectedAgentArcns = getKnownArcnsPrimaryName(provider);

  return (
    <NetworkGuard>
      <form onSubmit={onSubmit} className="card mx-auto max-w-lg space-y-4">
        {!ready && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
            Contract integration pending ABI verification — writes blocked.
          </p>
        )}

        <div>
          <label htmlFor="provider">Agent address (provider)</label>
          <input
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="0x…"
            className="font-mono text-sm"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Agent wallet submits deliverable. Set via demo agent or paste address.
          </p>
          <div className="mt-1">
            <AddressIdentity
              label="Agent identity"
              address={isAddress(provider) ? (provider as Address) : undefined}
              primaryName={selectedAgentArcns}
            />
          </div>
        </div>

        <AddressIdentity
          label="Connected client/evaluator"
          address={address}
          primaryName={connectedClientArcns}
        />

        <div>
          <label htmlFor="title">Job title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Research summary"
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What the agent should deliver…"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget">USDC budget (planned)</label>
            <input
              id="budget"
              type="number"
              min="0"
              step="0.01"
              value={budgetHint}
              onChange={(e) => setBudgetHint(e.target.value)}
            />
            <p className="mt-1 text-xs text-zinc-500">
              After create: agent calls setBudget, then client approves &amp; funds.
            </p>
          </div>
          <div>
            <label htmlFor="expiry">Expires in (days)</label>
            <input
              id="expiry"
              type="number"
              min="1"
              value={daysUntilExpiry}
              onChange={(e) => setDaysUntilExpiry(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isConnected || !ready || isPending || isConfirming}
          className="w-full rounded-lg bg-sky-600 py-2.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
        >
          {!isConnected
            ? "Connect wallet (client)"
            : isPending || isConfirming
              ? "Confirm in wallet…"
              : "Create job on-chain"}
        </button>

        {error && (
          <p className="text-sm text-red-400">
            {(error as Error).message ?? "Transaction failed"}
          </p>
        )}
        {hash && <ArcScanTxLink hash={hash} />}

        {eventParseFailed && createTxHash && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
            <p className="font-medium">JobCreated event could not be parsed automatically.</p>
            <p className="mt-1 break-all">Transaction hash: {createTxHash}</p>
            <a
              href={getArcscanTxUrl(createTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sky-300 hover:underline"
            >
              Open transaction on ArcScan ↗
            </a>
            <p className="mt-2 text-amber-200/90">
              Open the JobCreated log in ArcScan, copy the numeric <code>jobId</code>, and navigate to
              <code className="mx-1 text-sky-300">/jobs/&lt;jobId&gt;</code>.
            </p>
          </div>
        )}
      </form>
    </NetworkGuard>
  );
}
