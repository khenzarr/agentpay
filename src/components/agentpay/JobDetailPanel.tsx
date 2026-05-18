"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { keccak256, toHex } from "viem";
import { useErc8183Job, parseJobResult } from "@/hooks/useErc8183Job";
import {
  useApproveUsdc,
  useFundJob,
  useSetBudget,
} from "@/hooks/useFundJob";
import { useSubmitDeliverable } from "@/hooks/useSubmitDeliverable";
import { useCompleteJob } from "@/hooks/useCompleteJob";
import { JobStatusBadge } from "@/components/agentpay/JobStatusBadge";
import { JobStatusStepper } from "@/components/agentpay/JobStatusStepper";
import { AddressIdentity } from "@/components/agentpay/AddressIdentity";
import { ArcScanTxLink } from "@/components/agentpay/ArcScanLink";
import { formatUsdcAmount, parseUsdcAmount } from "@/lib/usdc";
import {
  ARC_TESTNET_USDC_ADDRESS,
  ERC8183_AGENTIC_COMMERCE_ADDRESS,
} from "@/lib/constants";
import { isErc8183IntegrationReady } from "@/lib/erc8183";
import { NetworkGuard } from "@/components/wallet/NetworkGuard";
import { getArcscanAddressUrl } from "@/lib/arcscan";
import { getKnownArcnsPrimaryName } from "@/config/demo-identities";

export function JobDetailPanel({ jobId }: { jobId: bigint }) {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useErc8183Job(jobId);
  const job = parseJobResult(data as Parameters<typeof parseJobResult>[0]);

  const [budgetInput, setBudgetInput] = useState("1");
  const [deliverableText, setDeliverableText] = useState("");

  const setBudget = useSetBudget();
  const approve = useApproveUsdc();
  const fund = useFundJob();
  const submit = useSubmitDeliverable();
  const complete = useCompleteJob();

  const ready = isErc8183IntegrationReady();

  if (isLoading) {
    return <p className="text-sm text-zinc-400">Loading job from chain…</p>;
  }

  if (!job) {
    return (
      <p className="text-sm text-amber-200">
        Job not found on-chain. Verify job ID or wait for indexing.
      </p>
    );
  }

  const isClient = address && address.toLowerCase() === job.client.toLowerCase();
  const isProvider =
    address && address.toLowerCase() === job.provider.toLowerCase();
  const isEvaluator =
    address && address.toLowerCase() === job.evaluator.toLowerCase();

  const latestHash =
    complete.hash ?? submit.hash ?? fund.hash ?? approve.hash ?? setBudget.hash;

  async function handleSetBudget() {
    const amount = parseUsdcAmount(budgetInput);
    await setBudget.setBudget(jobId, amount);
    refetch();
  }

  async function handleFund() {
    const amount = parseUsdcAmount(budgetInput);
    await approve.approve(ERC8183_AGENTIC_COMMERCE_ADDRESS, amount);
    await fund.fund(jobId);
    refetch();
  }

  async function handleSubmit() {
    const hash = keccak256(toHex(deliverableText || "agentpay-deliverable"));
    await submit.submit(jobId, hash);
    refetch();
  }

  async function handleComplete() {
    const reason = keccak256(toHex("approved"));
    await complete.complete(jobId, reason);
    refetch();
  }

  return (
    <NetworkGuard>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold text-white">Job #{jobId.toString()}</h2>
          <JobStatusBadge status={job.status} />
        </div>

        <JobStatusStepper currentStatus={job.status} />

        <div className="card space-y-2 text-sm">
          <p>
            <span className="text-zinc-500">Job ID: </span>#{job.id.toString()}
          </p>
          <p>
            <span className="text-zinc-500">Description: </span>
            {job.description}
          </p>
          <p>
            <span className="text-zinc-500">Budget: </span>
            {formatUsdcAmount(job.budget)} USDC
          </p>
          <p>
            <span className="text-zinc-500">Expiry: </span>
            {new Date(Number(job.expiredAt) * 1000).toLocaleString()}
          </p>
          <AddressIdentity
            label="Client"
            address={job.client}
            primaryName={getKnownArcnsPrimaryName(job.client)}
          />
          <AddressIdentity
            label="Provider/Agent"
            address={job.provider}
            primaryName={getKnownArcnsPrimaryName(job.provider)}
          />
          <AddressIdentity
            label="Evaluator"
            address={job.evaluator}
            primaryName={getKnownArcnsPrimaryName(job.evaluator)}
          />
          <div className="pt-1 text-xs text-zinc-400">
            <a href={getArcscanAddressUrl(ERC8183_AGENTIC_COMMERCE_ADDRESS)} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">ERC-8183 contract ↗</a>
            <span className="mx-2">·</span>
            <a href={getArcscanAddressUrl(ARC_TESTNET_USDC_ADDRESS)} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">USDC token ↗</a>
          </div>
          <p className="text-xs text-zinc-500">
            Role guidance: client funds, provider submits, evaluator completes.
          </p>
        </div>

        {!ready && (
          <p className="text-sm text-amber-200">ABI integration required for actions.</p>
        )}

        {job.status === 0 && (
          <section className="card space-y-3">
            <h3 className="font-medium text-sky-300">Open — set budget &amp; fund</h3>
            <p className="text-xs text-zinc-500">
              Agent wallet: setBudget · Client wallet: approve + fund
            </p>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="max-w-xs"
            />
            {isProvider && (
              <button
                type="button"
                disabled={!ready || setBudget.isPending}
                onClick={handleSetBudget}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Set budget (agent)
              </button>
            )}
            {isClient && (
              <button
                type="button"
                disabled={!ready || fund.isPending || approve.isPending}
                onClick={handleFund}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Approve USDC &amp; fund (client)
              </button>
            )}
            {!isClient && !isProvider && address && (
              <p className="text-xs text-amber-200">Action required: switch wallet role</p>
            )}
          </section>
        )}

        {job.status === 1 && (
          <section className="card space-y-3">
            <h3 className="font-medium text-sky-300">Funded — submit deliverable</h3>
            <textarea
              rows={2}
              value={deliverableText}
              onChange={(e) => setDeliverableText(e.target.value)}
              placeholder="Deliverable content (hashed on-chain)"
            />
            {isProvider ? (
              <button
                type="button"
                disabled={!ready || submit.isPending}
                onClick={handleSubmit}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Submit (agent)
              </button>
            ) : (
              <p className="text-xs text-amber-200">Switch to agent wallet</p>
            )}
          </section>
        )}

        {job.status === 2 && (
          <section className="card space-y-3">
            <h3 className="font-medium text-sky-300">Submitted — complete job</h3>
            {isEvaluator ? (
              <button
                type="button"
                disabled={!ready || complete.isPending}
                onClick={handleComplete}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Complete &amp; release USDC (evaluator)
              </button>
            ) : (
              <p className="text-xs text-amber-200">Switch to client/evaluator wallet</p>
            )}
          </section>
        )}

        {job.status === 3 && (
          <p className="text-sm text-emerald-300">Completed — USDC released to agent.</p>
        )}

        <div className="space-y-1 text-xs">
          {latestHash && <ArcScanTxLink hash={latestHash} />}
          {setBudget.hash && <ArcScanTxLink hash={setBudget.hash} />}
          {approve.hash && <ArcScanTxLink hash={approve.hash} />}
          {fund.hash && <ArcScanTxLink hash={fund.hash} />}
          {submit.hash && <ArcScanTxLink hash={submit.hash} />}
          {complete.hash && <ArcScanTxLink hash={complete.hash} />}
        </div>
      </div>
    </NetworkGuard>
  );
}
